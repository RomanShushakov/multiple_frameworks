use axum::
{
    body::Body, 
    extract::{Request, State}, 
    http::StatusCode, 
    response::{IntoResponse, Response}, 
    routing::{get, post, patch}, 
    Json, 
    Router,
};
use axum_macros::debug_handler;
use hyper::Uri;
use hyper_util::{client::legacy::connect::HttpConnector, rt::TokioExecutor};
use tower_http::
{
    services::ServeDir,
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use serde::{Deserialize, Serialize};
use http_body_util::BodyExt;
use time::Duration as TDuration;
use tower_sessions::{cookie::Key, Expiry, MemoryStore, Session, SessionManagerLayer};
use http::header::{HeaderValue, AUTHORIZATION};
use once_cell::sync::Lazy;


type Client = hyper_util::client::legacy::Client<HttpConnector, Body>;


const TOKEN_KEY: &str = "token";


static SERVER_ADDR: Lazy<String> = Lazy::new(|| 
{
    let server_addr = std::env::var("SERVER_ADDR").unwrap_or("http://localhost:3000".to_string());
    server_addr
});


#[derive(Default, Deserialize, Serialize)]
struct Token(String);


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

    let client: Client = 
        hyper_util::client::legacy::Client::<(), ()>::builder(TokioExecutor::new())
            .build(HttpConnector::new());

    let key = Key::generate(); // This is only used for demonstration purposes; provide a proper
                                    // cryptographic key in a real application.
    let session_store = MemoryStore::default();
    let session_layer = SessionManagerLayer::new(session_store)
        .with_secure(false)
        .with_expiry(Expiry::OnInactivity(TDuration::seconds(1000)))
        .with_signed(key);

    let app = Router::new()
        .route("/login", post(login))
        .route("/user_info", get(handler))
        .route("/users", get(handler))
        .route("/update_user_status", patch(handler))
        .nest_service("/", ServeDir::new("static/client"))
        .layer(TraceLayer::new_for_http())
        .layer(session_layer)
        .with_state(client);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:5001")
        .await
        .unwrap();
    tracing::debug!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}


async fn extract_token(
    res: Response<hyper::body::Incoming>,
    session: Session,
) 
{
    let auth_body = Json::<AuthBody>::from_bytes(
        &res.into_body().collect().await.unwrap().to_bytes(),
    ).unwrap();

    let token = format!("{} {}", auth_body.token_type, auth_body.access_token);

    // Put token in Memory Store
    session.insert(TOKEN_KEY, token).await.unwrap();
}


#[debug_handler]
async fn login(
    State(client): State<Client>, 
    session: Session,
    mut req: Request,
) 
    -> Result<Response, StatusCode>
{
    let path = req.uri().path();
    let path_query = req
        .uri()
        .path_and_query()
        .map(|v| v.as_str())
        .unwrap_or(path);

    let uri = format!("{}{}", SERVER_ADDR.parse::<String>().unwrap(), path_query);

    *req.uri_mut() = Uri::try_from(uri).unwrap();

    match client
        .request(req)
        .await
    {
        Ok(res) => 
        {
            extract_token(res, session).await;
            Ok((StatusCode::OK, "ok").into_response()) 
        },
        Err(_e) => 
        {
            Err(StatusCode::BAD_REQUEST)
        },
    }
}


async fn handler(
    State(client): State<Client>, 
    session: Session,
    mut req: Request,
) 
    -> Result<Response, StatusCode>
{
    let token: Token = session.get(TOKEN_KEY).await.unwrap().unwrap_or_default();

    let path = req.uri().path();
    let path_query = req
        .uri()
        .path_and_query()
        .map(|v| v.as_str())
        .unwrap_or(path);

    let uri = format!("{}{}", SERVER_ADDR.parse::<String>().unwrap(), path_query);

    *req.uri_mut() = Uri::try_from(uri).unwrap();
    req.headers_mut().insert(AUTHORIZATION,  HeaderValue::from_str(&token.0).unwrap());

    Ok(client
        .request(req)
        .await
        .map_err(|_| StatusCode::BAD_REQUEST)?
        .into_response()
    )
}


#[derive(Debug, Serialize, Deserialize)]
struct AuthBody
{
    access_token: String,
    token_type: String,
}
