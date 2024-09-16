# Ink

Ink is the **blazingly** and secure API behind Noteworthy, written in Rust (btw) for performance and reliability. It handles user note management, using JWT tokens for authentication and SQLx for interacting with a PostgreSQL database.

Built with the Axum framework, Ink can efficiently handle multiple requests while keeping the codebase simple and maintainable. Authentication is managed through JWT tokens, which must be included in the `Authorization` header of each request:

```
Authorization: Bearer <your-token-here>
```

It's important to note that **Ink is not a public API**. Access is restricted, and only authenticated users can interact with it.

The API's full documentation is available via [Swagger](https://app.swaggerhub.com/apis/RuanCampello/Noteworthy/1.0.0), providing a detailed overview of its endpoints and usage.

Ink works together with [NoteWaver](https://github.com/RuanCampello/noteworthy/tree/refactor/rusty/services/note-waver), a service dedicated to generating notes. Together, they form the core of Noteworthy, designed to make managing notes fast and easy.
