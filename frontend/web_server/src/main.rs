use axum::
{
    body::{Body, Bytes}, 
    extract::{Request, State}, 
    handler::HandlerWithoutStateExt, 
    http::StatusCode, 
    response::{IntoResponse, Response}, 
    routing::{get, post}, 
    Json, 
    Router,
};
use hyper::{body::Body as HBody, Uri};
use hyper_util::{client::legacy::connect::HttpConnector, rt::TokioExecutor};
use tracing::Instrument;
use std::{collections::HashMap, net::SocketAddr};
use tower::ServiceExt;
use tower_http::
{
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use serde::{Deserialize, Serialize};

use http_body_util::BodyExt;


type Client = hyper_util::client::legacy::Client<HttpConnector, Body>;


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

    let app = Router::new()
        .route("/login", post(login))
        .nest_service("/", ServeDir::new("static/client"))
        .layer(TraceLayer::new_for_http())
        .with_state(client);
        // .route("/login", post(login))
        // .route("/users", get(users))
        // .route("/user_info", get(user_info))
        // .route("/update_user_status", patch(update_user_status))
        // .layer(
        //     CorsLayer::new()
        //         .allow_origin(CORS_ORIGIN.parse::<HeaderValue>().unwrap())
        //         .allow_headers([
        //             header::ACCESS_CONTROL_ALLOW_ORIGIN,
        //             header::CONTENT_TYPE,
        //             header::AUTHORIZATION,
        //         ])
        //         .allow_methods([Method::GET, Method::POST, Method::PATCH]),
        //     )
        // .with_state(Arc::clone(&shared_state));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:5001")
        .await
        .unwrap();
    tracing::debug!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}


async fn extract_token(
    res: Response<hyper::body::Incoming>,
) 
{
    let auth_body = Json::<AuthBody>::from_bytes(
        &res.into_body().collect().await.unwrap().to_bytes(),
    ).unwrap();

    let token = format!("{} {}", auth_body.token_type, auth_body.access_token);

    println!("{:?}", token);
}


async fn login(
    State(client): State<Client>, 
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

    let uri = format!("http://127.0.0.1:3000{}", path_query);

    *req.uri_mut() = Uri::try_from(uri).unwrap();

    let res = match client
        .request(req)
        .await
    {
        Ok(r) => 
        {
            extract_token(r).await;
            Ok((StatusCode::OK, "ok").into_response()) 
        },
        Err(_e) => 
        {
            Err(StatusCode::BAD_REQUEST)
        },
    };

    res
}


// fn using_serve_dir() -> Router 
// {
//     // serve the file in the "assets" directory under `/assets`
//     Router::new().nest_service("/assets", ServeDir::new("assets"))
// }


// fn using_serve_dir_with_assets_fallback() -> Router 
// {
//     // `ServeDir` allows setting a fallback if an asset is not found
//     // so with this `GET /assets/doesnt-exist.jpg` will return `index.html`
//     // rather than a 404
//     let serve_dir = ServeDir::new("assets").not_found_service(ServeFile::new("assets/index.html"));

//     Router::new()
//         .route("/foo", get(|| async { "Hi from /foo" }))
//         .nest_service("/assets", serve_dir.clone())
//         .fallback_service(serve_dir)
// }


// fn using_serve_dir_only_from_root_via_fallback() -> Router 
// {
//     // you can also serve the assets directly from the root (not nested under `/assets`)
//     // by only setting a `ServeDir` as the fallback
//     let serve_dir = ServeDir::new("assets").not_found_service(ServeFile::new("assets/index.html"));

//     Router::new()
//         .route("/foo", get(|| async { "Hi from /foo" }))
//         .fallback_service(serve_dir)
// }


// fn using_serve_dir_with_handler_as_service() -> Router 
// {
//     async fn handle_404() -> (StatusCode, &'static str) 
//     {
//         (StatusCode::NOT_FOUND, "Not found")
//     }

//     // you can convert handler function to service
//     let service = handle_404.into_service();

//     let serve_dir = ServeDir::new("assets").not_found_service(service);

//     Router::new()
//         .route("/foo", get(|| async { "Hi from /foo" }))
//         .fallback_service(serve_dir)
// }


// fn two_serve_dirs() -> Router 
// {
//     // you can also have two `ServeDir`s nested at different paths
//     let serve_dir_from_assets = ServeDir::new("assets");
//     let serve_dir_from_dist = ServeDir::new("dist");

//     Router::new()
//         .nest_service("/assets", serve_dir_from_assets)
//         .nest_service("/dist", serve_dir_from_dist)
// }


// #[allow(clippy::let_and_return)]
// fn calling_serve_dir_from_a_handler() -> Router 
// {
//     // via `tower::Service::call`, or more conveniently `tower::ServiceExt::oneshot` you can
//     // call `ServeDir` yourself from a handler
//     Router::new().nest_service(
//         "/foo",
//         get(|request: Request| async 
//         {
//             let service = ServeDir::new("assets");
//             let result = service.oneshot(request).await;
//             result
//         }),
//     )
// }


// fn using_serve_file_from_a_route() -> Router 
// {
//     Router::new().route_service("/foo", ServeFile::new("assets/index.html"))
// }


// async fn serve(app: Router, port: u16) 
// {
//     let addr = SocketAddr::from(([127, 0, 0, 1], port));
//     let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
//     tracing::debug!("listening on {}", listener.local_addr().unwrap());
//     axum::serve(listener, app.layer(TraceLayer::new_for_http()))
//         .await
//         .unwrap();
// }


#[derive(Debug, Serialize, Deserialize)]
struct AuthBody
{
    access_token: String,
    token_type: String,
}
