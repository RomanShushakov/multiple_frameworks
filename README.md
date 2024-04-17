## Multiple frameworks

This project is intended as an **MVP** of a development environment that should be able to use multiple front-end frameworks in a single application.

### Page content (layout)

There are rough mockups of pages, it should be reference for content only, the design and styles can be used arbitrary until a common one is agreed upon.

#### Start page

![Image](./docs/images/start%20page.svg)

#### Auth page

![Image](./docs/images/auth%20page.svg)

#### User info page

All user info pages should have the same content and functionality regardless of the framework (Vue, Svelte, React, etc.). You can use arbitrary styles.

##### Fighter info page

![Image](./docs/images/fighter%20info%20page.svg)

##### Boss info page (collapsed)

![Image](./docs/images/boss%20info%20page%20collapsed.svg)

##### Boss info page (extended)

![Image](./docs/images/boss%20info%20page%20extended.svg)

### Tasks

- [X] Add global Vite config
- [X] Add start page
- [X] Add auth page
- [X] Add **Vue** user info page
- [X] Add **Svelte** user info page
- [X] Add **React** user info page
- [X] Add **Angular** user info page (optional)
- [ ] ~~Add **Nginx** config~~
- [ ] ~~Replace **Nginx** by reverse-proxy web-server~~
- [X] Add proxy web server

### How to run

#### Prod

- `docker compose up`
- go to <http://localhost:5001>

#### Dev

##### Prerequisites

**Rust**, **npm**

##### to work on frontend

- `docker compose -f docker-compose-dev.yaml up`
- `cd ./frontend`
- `npm run dev`
- go to <http://localhost:5001>

##### to work on web-server

- `docker compose -f docker-compose-dev.yaml up`
- `cd ./frontend`
- `npm run build`
- `cd ./web_server`
- `cargo run`
- go to <http://localhost:5001>

##### to work on backend

- `cd ./backend`
- `cargo run`
- go to <http://localhost:3000>

P.S. **GLHF!** :thumbsup:
