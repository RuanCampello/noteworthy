FROM ghcr.io/gleam-lang/gleam:v1.4.1-erlang

WORKDIR /build
COPY . /build

# compiles the project
RUN cd /build \
    && gleam export erlang-shipment \
    && mv build/erlang-shipment /app \
    && rm -r /build

WORKDIR /app
ENTRYPOINT ["app/entrypoint.sh"]

EXPOSE 8000

CMD["run"]