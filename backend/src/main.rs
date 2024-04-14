use axum::
{
    async_trait,
    extract::{FromRequestParts, State},
    http::{header, request::Parts, HeaderValue, StatusCode, Method},
    response::{IntoResponse, Response},
    routing::{get, patch, post},
    Json, RequestPartsExt, Router,
};
use axum_extra::
{
    headers::{authorization::Bearer, Authorization},
    TypedHeader,
};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::{fs, sync::{Arc, RwLock}};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use tower_http::cors::CorsLayer;


static KEYS: Lazy<Keys> = Lazy::new(|| 
{
    let secret = std::env::var("JWT_SECRET").unwrap_or("secret".to_string());
    Keys::new(secret.as_bytes())
});


static CORS_ORIGIN: Lazy<String> = Lazy::new(|| 
{
    let cors_origin = std::env::var("CORS_ORIGIN").unwrap_or("http://localhost:5001".to_string());
    cors_origin
});


type SharedState = Arc<RwLock<AppState>>;


#[derive(Debug, Serialize, Deserialize, Clone)]
struct AppState(Vec<User>);


impl AppState
{
    fn init() -> Self
    {
        let file = fs::read_to_string("./db/users.json").unwrap().parse::<String>().unwrap();
        let app_state: AppState = serde_json::from_str(&file).expect("JSON was not well-formatted");
        app_state
    }
}


#[tokio::main]
async fn main() 
{
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "backend=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let shared_state = Arc::new(RwLock::new(AppState::init()));

    let app = Router::new()
        .route("/login", post(login))
        .route("/users", get(users))
        .route("/user_info", get(user_info))
        .route("/update_user_status", patch(update_user_status))
        .layer(
            CorsLayer::new()
                .allow_origin(CORS_ORIGIN.parse::<HeaderValue>().unwrap())
                .allow_headers([
                    header::ACCESS_CONTROL_ALLOW_ORIGIN,
                    header::CONTENT_TYPE,
                    header::AUTHORIZATION,
                ])
                .allow_methods([Method::GET, Method::POST, Method::PATCH]),
            )
        .with_state(Arc::clone(&shared_state));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    tracing::debug!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}


async fn login(
    State(state): State<SharedState>,
    Json(payload): Json<AuthPayload>,
) 
    -> Result<Json<AuthBody>, AuthError>
{
    if payload.email.is_empty() || payload.password.is_empty()
    {
        return Err(AuthError::MissingCredentials);
    }

    if let Some(user) = state
        .read()
        .unwrap()
        .0
        .iter()
        .find(|u| u.email == payload.email && u.password == payload.password && u.is_active)
    {
        let claims = Claims
        {
            name: user.name.to_owned(),
            email: user.email.to_owned(),
            // Mandatory expiry time as UTC timestamp
            exp: 2000000000, // May 2033
        };

        let token = encode(&Header::default(), &claims, &KEYS.encoding)
            .map_err(|_| AuthError::TokenCreation)?;

        Ok(Json(AuthBody::new(token)))
    }
    else
    {
        Err(AuthError::WrongCredentials)
    }
}


async fn users(
    State(state): State<SharedState>,
    claims: Claims,
)
    -> Result<Json<Vec<UserData>>, Response>
{
    if let None = state
        .read()
        .unwrap()
        .0
        .iter()
        .find(|u| u.name == claims.name && u.email == claims.email && u.role == "boss".to_string())
    {
        return Err((
            StatusCode::UNAUTHORIZED, 
            Json(json!(
                {
                    "error": "Wrong role",
                }
            ))
        ).into_response());
    }

    let users = state
        .read()
        .unwrap()
        .0
        .iter()
        .cloned()
        .filter(|u| u.role != "boss".to_string())
        .map(|u| UserData { name: u.name, email: u.email, is_active: u.is_active })
        .collect::<Vec<UserData>>();
    Ok(Json(users))
}


async fn user_info(
    State(state): State<SharedState>,
    claims: Claims,
)
    -> Result<Json<UserInfo>, Response>
{
    if let Some(user) = state
        .read()
        .unwrap()
        .0
        .iter()
        .find(|u| u.name == claims.name && u.email == claims.email)
    {
        Ok(Json(UserInfo { name: user.name.clone(), info: user.info.clone(), role: user.role.clone() }))
    }
    else
    {
        Err((
            StatusCode::NOT_FOUND,
            Json(json!(
                {
                    "error": "Info not found"
                }
            ))
        ).into_response())
    }
}



async fn update_user_status(
    State(state): State<SharedState>,
    claims: Claims,
    Json(payload): Json<UserStatus>,
) 
    -> Result<Response, Response>
{
    if payload.email.is_empty()
    {
        return Err((StatusCode::BAD_REQUEST, "Missing user email").into_response());
    }

    if let None = state
        .read()
        .unwrap()
        .0
        .iter()
        .find(|u| u.name == claims.name && u.email == claims.email && u.role == "boss".to_string())
    {
        return Err((
            StatusCode::UNAUTHORIZED, 
            Json(json!(
                {
                    "error": "Wrong role",
                }
            ))
        ).into_response());
    }

    state
        .write()
        .unwrap()
        .0
        .iter_mut()
        .for_each(|u| if u.email == payload.email { u.is_active = payload.is_active; });

    Ok("User have been successfully updated".into_response())
}


#[derive(Debug, Serialize, Deserialize, Clone)]
struct User
{
    name: String,
    email: String,
    role: String,
    info: String,
    password: String,
    is_active: bool,
}


#[derive(Debug, Serialize, Deserialize, Clone)]
struct UserData
{
    name: String,
    email: String,
    is_active: bool,
}


#[derive(Serialize)]
struct UserInfo
{
    name: String,
    info: String,
    role: String,
}


#[derive(Serialize, Deserialize)]
struct UserStatus
{
    email: String,
    is_active: bool,
}


#[derive(Debug, Serialize)]
struct AuthBody
{
    access_token: String,
    token_type: String,
}


#[derive(Debug, Deserialize)]
struct AuthPayload
{
    email: String,
    password: String,
}


impl AuthBody
{
    fn new(access_token: String) -> Self
    {
        Self
        {
            access_token,
            token_type: "Bearer".to_string(),
        }
    }
}


#[derive(Debug, Serialize, Deserialize)]
struct Claims
{
    name: String,
    email: String,
    exp: usize,
}


#[derive(Debug)]
enum AuthError
{
    WrongCredentials,
    MissingCredentials,
    TokenCreation,
    InvalidToken,
}


#[async_trait]
impl<S> FromRequestParts<S> for Claims
where
    S: Send + Sync,
{
    type Rejection = AuthError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection>
    {
        let TypedHeader(Authorization(bearer)) = parts
            .extract::<TypedHeader<Authorization<Bearer>>>()
            .await
            .map_err(|_| AuthError::InvalidToken)?;

        let token_data = decode::<Claims>(bearer.token(), &KEYS.decoding, &Validation::default())
            .map_err(|_| AuthError::InvalidToken)?;

        Ok(token_data.claims)
    }
}


impl IntoResponse for AuthError
{
    fn into_response(self) -> Response
    {
        let (status, error_message) = match self
        {
            AuthError::WrongCredentials => (StatusCode::UNAUTHORIZED, "Wrong credentials"),
            AuthError::MissingCredentials => (StatusCode::BAD_REQUEST, "Missing credentials"),
            AuthError::TokenCreation => (StatusCode::INTERNAL_SERVER_ERROR, "Token creation error"),
            AuthError::InvalidToken => (StatusCode::BAD_REQUEST, "Invalid token"),
        };
        let body = Json(json!({
            "error": error_message,
        }));
        (status, body).into_response()
    }
}


struct Keys
{
    encoding: EncodingKey,
    decoding: DecodingKey,
}


impl Keys
{
    fn new(secret: &[u8]) -> Self
    {
        Self
        {
            encoding: EncodingKey::from_secret(secret),
            decoding: DecodingKey::from_secret(secret),
        }
    }
}
