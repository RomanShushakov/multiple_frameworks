FROM rust:1.77.2 as builder
RUN mkdir -p /app/
WORKDIR /app/
COPY ./web_server/ /app/
RUN cargo install --path .

FROM debian:bookworm-slim
RUN mkdir -p /app/
WORKDIR /app/
RUN apt update && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/static/client /app/static/client
COPY --from=builder /usr/local/cargo/bin/web_server /usr/local/bin/web_server
EXPOSE 5001
