FROM ghcr.io/gleam-lang/gleam:v1.4.1-erlang-alpine

WORKDIR /build

COPY . /build

# compile the project
RUN cd /build \
  && gleam export erlang-shipment \
  && mv build/erlang-shipment /app \
  && rm -r /build

# start the server
WORKDIR /app
ENTRYPOINT ["/app/entrypoint.sh"]

# Copy .env into the app directory
COPY .env .env

EXPOSE 8000

CMD ["run"]