---
title: VirtuaCarz — Build Guide, Interview Notes & Handbook
aliases:
  - VirtuaCarz handbook
  - VirtuaCarz interview prep
  - MERN car rental build guide
  - VirtuaCarz study notes
tags:
  - virtuacarz
  - project
  - mern
  - react
  - express
  - mongodb
  - tutorial
  - interview-prep
created: 2026-11-06
status: active
---

# VirtuaCarz — Build Guide, Interview Notes & Handbook

> [!info] What this note is
> A single study pack for the **VirtuaCarz** car-rental project. It contains:
> 1. a from-zero tutorial for the stack used here,
> 2. a codebase walkthrough you can revise before an interview,
> 3. interview scripts, questions, answers, and resume bullets,
> 4. reference notes: API, database, commands, troubleshooting, and a roadmap.
>
> **Repo:** `/home/aditya/Projects/VirtuaCarz`
> **Stack:** React 19 + Vite 8 + Tailwind CSS 4 + Redux Toolkit on the frontend; Node.js + Express 5 + Mongoose 9 + MongoDB on the backend.

> [!tip] How to use this note
> - **Just want to run it?** Go to [[#Part 0 — Quick start]].
> - **Learning the stack from zero?** Read [[#Part II — The stack from zero]], then [[#Part III — Build from scratch]].
> - **Interview tomorrow?** Read [[#Part IV — How the code works]] and [[#Part V — Interview playbook]].
> - **Something is broken?** Jump to [[#Part VI — Reference & other notes]].
> - **Want the design system?** See [[admin-panel-design-prompt|VirtuaCarz Editorial Design System]].

## Contents

- [[#Part 0 — Quick start]]
- [[#Part I — The project at a glance]]
- [[#Part II — The stack from zero]]
- [[#Part III — Build from scratch]]
- [[#Part IV — How the code works]]
- [[#Part V — Interview playbook]]
- [[#Part VI — Reference & other notes]]
- [[#Appendix — file inventory]]

---

## Part 0 — Quick start

### 0.1 What you need installed

| Tool | Why | Check |
| --- | --- | --- |
| Node.js 20+ (22/24 recommended) | Runs JavaScript outside the browser and powers Vite | `node -v` |
| npm | Installs packages | `npm -v` |
| MongoDB | The database | `mongod --version` or use MongoDB Atlas |
| Git | Version control | `git --version` |
| VS Code | Editor | — |
| MongoDB Compass | GUI for inspecting the database | optional but useful |
| Postman / Thunder Client / curl | Test the API without the UI | optional |

> [!note] This machine
> The project was verified with **Node v24.22.1** and **npm 11.19.1**. The README asks for Node 20+.
> `mongod` was not on `PATH` here, so use a local MongoDB install, Docker, or a free MongoDB Atlas cluster.

### 0.2 Get the code and install dependencies

```bash
git clone <your-repo-url> VirtuaCarz
cd VirtuaCarz
```

There is **no root `package.json`**. Each app is installed and run separately.

```bash
# Terminal 1 — API
cd server
npm install

# Terminal 2 — customer app
cd client
npm install

# Terminal 3 — admin panel
cd admin-panel
npm install
```

### 0.3 Create the environment files

**`server/.env`** (copy from `server/.env.example`):

```dotenv
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/virtuacarz
JWT_SECRET=replace-with-a-long-random-secret
DEV_MODE=development
```

Generate a real secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

If you use Atlas, the URI looks like:

```dotenv
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/virtuacarz?retryWrites=true&w=majority
```

**`client/.env.local`** and **`admin-panel/.env.local`**:

```dotenv
VITE_BASEURL=http://localhost:8080/api/v1
```

> [!warning] Vite env rules
> Only variables beginning with `VITE_` are exposed to browser code. Restart `npm run dev` after editing `.env.local`. Never put server secrets in a Vite env file.

### 0.4 Start the three apps

```bash
# Terminal 1
cd server
npm start
# Server Running on Port 8080 in development Mode

# Terminal 2
cd client
npm run dev
# http://localhost:5173

# Terminal 3
cd admin-panel
npm run dev
# usually http://localhost:5174
```

Open the customer app, register an account, then promote it to admin:

```bash
mongosh "mongodb://127.0.0.1:27017/virtuacarz"
```

```js
db.users.updateOne(
  { email: "you@example.com" },
  { $set: { isAdmin: true } }
)
```

In MongoDB Compass: open `virtuacarz` → `users` → find your document → edit `isAdmin` to `true` → update.

Now log in to the admin panel with the same email and password.

### 0.5 Five-minute smoke test

- [ ] `GET http://localhost:8080/` returns “Welcome to car server”.
- [ ] `GET http://localhost:8080/api/v1/car/get-all` returns `{ success: true, ... }`.
- [ ] Register works in the customer app.
- [ ] Login works and the header shows your name.
- [ ] `/cars` shows cars (the home page may show local demo data if the DB has ≤ 2 cars).
- [ ] Booking a car creates a document in `bookings`.
- [ ] Your booking appears on `/profile`.
- [ ] The admin dashboard loads and shows fleet/booking counts.
- [ ] Adding a car with an image works.
- [ ] Updating a booking status in admin changes it for the customer.

---

## Part I — The project at a glance

### 1.1 One-paragraph explanation

VirtuaCarz is a full-stack self-drive car rental platform made of **three deployable apps**: a customer-facing React app, an admin React app, and a shared Express REST API backed by MongoDB. Customers browse the fleet, register/sign in, book cars for a date range, view their reservations, edit their profile, and request booking date changes. Administrators add, edit, and delete cars (with image upload), review every booking, and change booking status. Authentication uses JWTs and bcrypt-hashed passwords; state is managed with Redux Toolkit and async API calls with Axios; the interface uses a warm editorial design system built with Tailwind CSS 4 and Framer Motion.

### 1.2 What each app does

| App | Users | Main pages | Main responsibilities |
| --- | --- | --- | --- |
| `client/` | Customers | Home, Fleet, Car details, Login, Register, Profile, About, Contact | Browse cars, book, manage profile/bookings |
| `admin-panel/` | Administrators | Login, Dashboard, All cars, Add car, Car details/edit, All bookings, Booking details | Fleet CRUD, booking review, status updates |
| `server/` | Both frontends | REST API under `/api/v1` | Auth, users, cars, bookings, MongoDB, image processing |

### 1.3 Architecture

```mermaid
flowchart LR
  Customer[Customer browser] --> Client["Customer app<br/>React + Vite :5173"]
  Admin[Administrator browser] --> Panel["Admin panel<br/>React + Vite :5174"]

  Client -->|"Axios: JSON + multipart/form-data"| API["Express API<br/>:8080/api/v1"]
  Panel -->|"Axios: JSON + multipart/form-data"| API

  API -->|Mongoose ODM| DB[(MongoDB)]
  API -->|"Multer → Base64 string"| DB
```

Key point: the two frontends are **separate SPAs** with separate builds, but they share the same API and the same `appData` localStorage shape. They can be deployed independently.

### 1.4 Repository map

```text
VirtuaCarz/
├── client/                     # Customer React app (Vite, port 5173)
│   ├── src/
│   │   ├── api/API.jsx         # Axios instance + JWT interceptor
│   │   ├── components/         # Header, Footer, modals, ui/
│   │   ├── pages/              # Auth, Car, user, Home, About, Contact
│   │   ├── store/              # Redux store + authSlice + carSlice
│   │   ├── utils/image.js      # Base64/data URL helper
│   │   ├── Data/carsData.json  # Demo/fallback cars for the home page
│   │   ├── App.jsx             # Routes + page transitions
│   │   └── main.jsx            # Provider + BrowserRouter
│   ├── index.html              # Font Awesome + Figtree CDN links
│   └── vite.config.js          # React + Tailwind plugins
│
├── admin-panel/                # Admin React app (Vite, port 5174)
│   ├── src/
│   │   ├── API/api.jsx         # Axios instance + JWT interceptor
│   │   ├── components/         # Layout, Menus
│   │   ├── pages/              # Dashboard, AllCars, AddCar, AllBookings...
│   │   ├── store/              # authSlice, carSlice, bookingSlice
│   │   ├── App.jsx             # Protected routes
│   │   └── main.jsx
│   └── vite.config.js
│
├── server/                     # Express API (port 8080)
│   ├── config/
│   │   ├── env.js              # Loads server/.env, fails fast
│   │   └── db.js               # Mongoose connection
│   ├── controllers/            # user, car, booking business logic
│   ├── middleware/
│   │   ├── authMiddleware.js   # userAuth + isAdmin
│   │   └── multer.js           # memoryStorage upload
│   ├── models/                 # User, Car, Booking schemas
│   ├── routes/                 # userRoutes, carRoute, bookingRoute
│   └── server.js               # Express app + route wiring
│
├── docs/
│   ├── admin-panel-design-prompt.md
│   └── virtuacarz-handbook.md  # this note
└── README.md
```

### 1.5 Data model

```mermaid
erDiagram
  USER ||--o{ BOOKING : makes
  CAR ||--o{ BOOKING : reserved_in

  USER {
    ObjectId _id PK
    string uname
    string email UK
    string password "bcrypt hash"
    string phone
    boolean isAdmin "default false"
    date createdAt
    date updatedAt
  }

  CAR {
    ObjectId _id PK
    string name
    string model
    string year
    string category
    string fuel
    number seats
    number milage
    number price "per day"
    string about
    string image "Base64 or URL"
    boolean transmission "true = automatic"
    boolean status "true = available"
    date createdAt
    date updatedAt
  }

  BOOKING {
    ObjectId _id PK
    ObjectId user FK
    ObjectId car FK
    date startDate
    date returnDate
    number price "daily rate snapshot"
    number totalPrice
    string status "pending | confirm | cancel"
    date createdAt
    date updatedAt
  }
```

> [!note] Two deliberate oddities
> - **`milage`** is misspelled everywhere on purpose (the API contract uses it). Do not “fix” only one side or you will break the form.
> - The booking status values are **`pending`, `confirm`, `cancel`** — not `confirmed`/`cancelled`. The UI accepts both in some maps, but the server enum only stores the short forms.

### 1.6 Request lifecycle (the mental model)

```mermaid
sequenceDiagram
  participant U as User
  participant R as React app
  participant A as Axios
  participant E as Express
  participant M as Middleware
  participant C as Controller
  participant D as MongoDB

  U->>R: clicks “Book this car”
  R->>A: API.post("/booking/create", body)
  A->>A: interceptor reads localStorage token
  A->>E: POST /api/v1/booking/create + Authorization
  E->>M: userAuth verifies JWT
  M-->>E: req.user = { id }
  E->>C: createBooking(req, res)
  C->>D: bookingModel.save()
  D-->>C: saved document
  C-->>E: 201 JSON
  E-->>A: response
  A-->>R: res.data
  R-->>U: toast + UI update
```

### 1.7 Feature inventory (what you can demo)

**Customer**

- Editorial landing page with hero search, city selector, popular fleet, “why us”, steps, testimonials, FAQ.
- Fleet listing with availability badges, loading/error/empty states.
- Car details with specs, price, availability, booking modal.
- Register/login with validation and toasts.
- Booking creation with date validation and total price.
- Profile: personal details, editing name/phone/password, booking table/cards, booking details modal, date-change modal with ₹200 penalty.
- Responsive header/footer, mobile drawer, account menu, page transitions.

**Admin**

- Separate login that rejects non-admin accounts.
- Protected routes (client-side) + admin middleware (server-side).
- Dashboard: fleet count, booking count, gross booking value, category breakdown.
- Fleet inventory: table/cards, add car with image preview, edit, delete, live listing preview.
- Bookings: status filter (all/pending/confirm/cancel), detail page, status update.

**API**

- 3 Mongoose models, 15 routes, JWT auth, admin authorization.
- Multer memory upload → Base64 string in MongoDB.
- Manual joins for booking details and `populate()` for user bookings.
- Consistent-ish `{ success, message, ... }` response shape.

---

## Part II — The stack from zero

### 2.1 The mental model: four layers

Every web app in this style has four layers:

1. **Browser / client** — the UI the user sees. Here: two React apps.
2. **HTTP API** — the server’s public interface. Here: Express routes under `/api/v1`.
3. **Business logic** — validation, auth, pricing, permissions. Here: controllers + middleware.
4. **Database** — durable storage. Here: MongoDB, accessed through Mongoose models.

A React component never talks to MongoDB directly. It sends an HTTP request to Express; Express runs middleware and a controller; the controller uses a Mongoose model; Mongoose talks to MongoDB; the result travels back as JSON.

### 2.2 Glossary for a complete beginner

| Term | Plain-English meaning | Where you see it here |
| --- | --- | --- |
| **Runtime** | The program that executes JavaScript outside a browser | Node.js |
| **Framework** | A library that provides structure and conventions | Express, React |
| **Library** | Reusable code you call when needed | Axios, bcryptjs |
| **Package** | A downloadable unit of code managed by npm | Anything in `node_modules` |
| **API** | A contract for one program to talk to another | `/api/v1/...` |
| **REST** | A style of API built around resources + HTTP verbs | `GET /car/get-all`, `POST /booking/create` |
| **Endpoint** | One URL + method pair | `PATCH /booking/update/:id` |
| **JSON** | Text format for structured data | `{ "success": true }` |
| **SPA** | Single Page Application: one HTML file, JS swaps views | Both React apps |
| **Component** | A reusable function returning UI | `<CarCard />` |
| **JSX** | HTML-like syntax inside JavaScript | `return <div>...</div>` |
| **Props** | Read-only inputs passed to a component | `<CarCard car={car} />` |
| **State** | Data that changes over time | `useState`, Redux store |
| **Hook** | A function that adds React features to a component | `useEffect`, `useSelector` |
| **Bundler** | Combines/optimises source files for the browser | Vite |
| **HMR** | Hot Module Replacement: update the page without a full reload | Vite dev server |
| **Middleware** | A function that runs between request and controller | `userAuth`, `isAdmin`, `multer` |
| **ORM/ODM** | Maps code objects to database documents | Mongoose (ODM) |
| **Schema** | The shape and rules of a document | `userSchema`, `carSchema` |
| **Model** | A schema compiled into a queryable constructor | `userModel`, `carModel` |
| **JWT** | A signed token carrying claims (here, a user id) | `jsonwebtoken` |
| **Hashing** | One-way transformation of a password | `bcryptjs` |
| **Salt** | Random data added before hashing | `bcrypt.genSalt(10)` |
| **CORS** | Browser rule for cross-origin requests | `app.use(cors())` |
| **Env var** | Configuration kept outside code | `MONGO_URI`, `JWT_SECRET` |
| **Multipart** | Encoding for file uploads | `FormData` + Multer |
| **Base64** | Text encoding for binary data | Car image stored as a string |
| **Thunk** | An async action creator in Redux Toolkit | `createAsyncThunk` |
| **Reducer** | A function that returns the next state | `authSlice.reducer` |

### 2.3 The stack at a glance

| Layer | Technology | Version in this repo | What it does here |
| --- | --- | --- | --- |
| UI library | **React** | `^19.2.8` | Components, hooks, rendering |
| Build tool | **Vite** | `^8.2.2` / `^8.3.0` | Dev server, bundling, env handling |
| Routing | **React Router** | client `react-router ^8.3.1`; admin `react-router-dom ^7.18.4` | URLs → pages, protected routes |
| Global state | **Redux Toolkit** | `^2.12.0` / `^2.13.0` | Auth, cars, bookings, async state |
| React bindings | **React Redux** | `^9.3.0` | `useSelector`, `useDispatch`, `Provider` |
| HTTP client | **Axios** | `^1.20.0` | API calls + token interceptor |
| Styling | **Tailwind CSS 4** | `^4.3.3` | Utility classes + `@theme` tokens |
| Tailwind plugin | **@tailwindcss/vite** | `^4.3.3` | Tailwind integration with Vite |
| Animation | **Framer Motion** | `^14.9.1` | Page transitions, modals, reveals |
| Toasts (client) | **react-hot-toast** | `^2.6.0` | Customer notifications |
| Toasts (admin) | **react-toastify** | `^11.1.0` | Admin notifications |
| Icons | **Font Awesome 7** | CDN | `<i className="fa-solid ..." />` |
| Font | **Figtree** | Google Fonts CDN | Display + UI type |
| Runtime | **Node.js** | 20+ | Runs the API + Vite |
| Web framework | **Express** | `^5.2.1` | Routes, middleware, JSON responses |
| ODM | **Mongoose** | `^9.9.4` | Schemas, models, validation, queries |
| Database | **MongoDB** | local or Atlas | Stores users, cars, bookings |
| Auth | **jsonwebtoken** | `^9.0.3` | Signs/verifies 7-day JWTs |
| Password hashing | **bcryptjs** | `^3.0.3` | Salt + hash + compare |
| File upload | **Multer** | `^2.3.0` | Parses multipart files into memory |
| CORS | **cors** | `^2.8.6` | Allows the two Vite origins |
| Logging | **morgan** | `^1.12.0` | HTTP request logs |
| Env loading | **dotenv** | `^17.4.2` | Reads `server/.env` |
| Terminal colour | **colors** | `^1.4.0` | Coloured server logs |
| Linting | **ESLint** | `^10.x` | Frontend lint scripts |

### 2.4 Backend packages — what and why

- **express** — creates the HTTP server, routes, and middleware chain. Express 5 handles async route rejections better than Express 4, but this code still uses `try/catch` in controllers.
- **mongoose** — gives structure to MongoDB. A schema defines fields, types, defaults, and validation; a model is the query interface (`find`, `findById`, `save`).
- **mongodb** — the official driver; installed transitively by Mongoose. You rarely import it directly.
- **dotenv** — loads key/value pairs from `.env` into `process.env`.
- **cors** — adds headers that let `http://localhost:5173` call `http://localhost:8080`.
- **morgan** — logs method, URL, status, and response time in development.
- **jsonwebtoken** — signs a token on login and verifies it on protected requests.
- **bcryptjs** — hashes passwords with a salt; pure JS, so no native build step.
- **multer** — parses `multipart/form-data` and exposes the uploaded file as `req.file`. Here it uses `memoryStorage()`, so the file lives in RAM as a `Buffer`.
- **colors** — augments strings with `.red`, `.bgBlue`, etc. for readable terminal output. (Some teams would use a logger instead.)

### 2.5 Frontend packages — what and why

- **react** / **react-dom** — component model + DOM renderer.
- **vite** — instant dev server and production bundler. It reads `.env.local` and exposes `VITE_*` variables through `import.meta.env`.
- **@vitejs/plugin-react** — enables React Fast Refresh and JSX transforms.
- **react-router** / **react-router-dom** — client-side routing. `BrowserRouter` keeps the URL in sync without full page reloads; `Routes`/`Route` map URLs to components; `NavLink` gives active styling; `Navigate` redirects.
- **@reduxjs/toolkit** — the modern Redux API: `configureStore`, `createSlice`, `createAsyncThunk`. It removes most boilerplate and includes Immer so reducers can “mutate” state safely.
- **react-redux** — connects React to the store: `<Provider>`, `useSelector`, `useDispatch`.
- **axios** — promise-based HTTP client. The `API` instance centralises the base URL and injects the JWT with an interceptor.
- **tailwindcss** + **@tailwindcss/vite** — utility-first CSS. Tailwind 4 uses a CSS-first config (`@theme`), so there is **no `tailwind.config.js`** in this repo.
- **framer-motion** — declarative animations: `motion.div`, `AnimatePresence`, variants, `useReducedMotion`.
- **react-hot-toast** — small toast API used in the customer app.
- **react-toastify** — toast API used in the admin panel. The customer app also imports its `ToastContainer` and CSS, but does not actually use it — a cleanup opportunity.
- **Font Awesome** — icon font loaded from a CDN in both `index.html` files.
- **Figtree** — the typeface, loaded from Google Fonts in both `index.html` files.

### 2.6 Why these choices (and what a senior would question)

**Good choices for this project**

- **React + Vite** is a fast feedback loop; Vite starts in milliseconds and the production build is small enough for a portfolio app.
- **Redux Toolkit** keeps auth, cars, and bookings predictable across many components and modals. The async thunk pattern gives each request `pending` / `fulfilled` / `rejected` states, which maps neatly to loading spinners, errors, and toasts.
- **Separate customer and admin apps** keep bundles and UX concerns separate. The admin can be deployed behind a VPN or a separate domain later.
- **Mongoose** gives the untyped MongoDB a useful schema layer with required fields, defaults, enums, and timestamps.
- **Tailwind 4 + design tokens** makes the editorial design system consistent across two apps without a component library.
- **JWT** is stateless and easy to reason about for a small API; no session store is needed.

**Trade-offs and things to improve**

- **No TypeScript** means field-name typos (like `milage`) are caught only at runtime.
- **No validation library** (Zod/Joi/express-validator) means controllers hand-check fields.
- **JWT in localStorage** is simple but exposed to XSS; httpOnly cookies + refresh tokens are safer.
- **Base64 images in MongoDB** avoid external storage but bloat documents and list responses; object storage is the production answer.
- **Two router packages and two toast libraries** are accidental complexity; standardise.
- **No automated tests or CI**; the server `test` script is a placeholder.
- **No pagination**; `GET /car/get-all` and `GET /booking/get-all` return everything, including base64 images.

### 2.7 Version notes that matter

- **Tailwind CSS 4** is configured in CSS with `@import "tailwindcss";` and `@theme { ... }`. Older tutorials tell you to create `tailwind.config.js` and add `@tailwind base/components/utilities`; that is v3 advice and is not used here.
- **React Router 7/8** merged much of `react-router-dom` into `react-router`. The customer app imports from `"react-router"`; the admin imports from `"react-router-dom"`. Both work because the admin's v7 DOM package re-exports the core. Pick one convention for new code.
- **Mongoose 9** deprecates `new: true`; use `returnDocument: "after"`. This repo fixed most call sites but missed one (`updateBookingStatus` uses a misspelled `returnOrignal`).
- **Express 5** changed path-to-regexp behaviour and some error handling; this app sticks to simple paths, so it is unaffected.
- **Node 20+** is required by the README. Vite 8 and modern tooling are happiest on Node 22/24.

---

## Part III — Build from scratch

> [!tip] The build order that keeps you sane
> Build and test the **API first**, then the **customer app**, then the **admin panel**. Each layer depends on the one before it. Do not start with the UI and hope the backend matches.

| Stage | You build | You can test it with |
| --- | --- | --- |
| A | Express server + MongoDB connection | `curl http://localhost:8080/` |
| B | Models + auth + JWT middleware | register/login curl |
| C | Car CRUD + image upload | admin curl or Postman |
| D | Booking CRUD | booking curl |
| E | Customer React app | browser |
| F | Admin React app | browser |
| G | Build + deploy | production URLs |

### 3.1 Install the tools

**Node.js**

- macOS/Linux with `nvm` (recommended):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# restart the terminal
nvm install 22
nvm use 22
node -v
```

- Windows: install the LTS from [nodejs.org](https://nodejs.org) and tick “Add to PATH”.

**MongoDB** — choose one:

- **Local** (Linux): follow MongoDB’s official install guide, then `sudo systemctl start mongod`.
- **Docker**: `docker run -d --name virtuacarz-mongo -p 27017:27017 mongo:7`
- **Atlas** (no install): create a free M0 cluster, a database user, allow your IP, and copy the connection string.

**Editor extensions** (optional but useful): ESLint, Prettier, Tailwind CSS IntelliSense, MongoDB for VS Code, Thunder Client.

### 3.2 Create the repository skeleton

```bash
mkdir VirtuaCarz
cd VirtuaCarz
git init
mkdir server client admin-panel docs
```

Add a `.gitignore` at the root:

```gitignore
.env
.env.*
!.env.example
node_modules/
dist/
build/
*.log
.DS_Store
.vscode/
.idea/
```

> [!warning] Environment files
> `.env` and `.env.local` must never be committed. The repo’s `.gitignore` ignores `.env.*` but keeps `.env.example`, which is the file you commit.

### 3.3 Backend: initialise the project

```bash
cd server
npm init -y
npm pkg set type=module
npm pkg set scripts.start="node server.js"
npm install express mongoose dotenv cors morgan jsonwebtoken bcryptjs multer colors
```

`"type": "module"` lets you use `import`/`export` instead of `require`. Every server file in this repo uses ESM.

Your `server/package.json` should look roughly like:

```json
{
  "name": "server",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "colors": "^1.4.0",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.9.4",
    "morgan": "^1.12.0",
    "multer": "^2.3.0"
  }
}
```

Create `server/.env.example` and `server/.env`:

```dotenv
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/virtuacarz
JWT_SECRET=replace-with-a-long-random-secret
DEV_MODE=development
```

### 3.4 Backend: environment + database connection

**`server/config/env.js`** — load the right `.env` no matter where the process starts, and fail fast if secrets are missing:

```js
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    [
      "",
      "Missing required environment variables: " + missing.join(", "),
      "",
      "Create server/.env from server/.env.example and set the values:",
      "  cp server/.env.example server/.env",
      "",
    ].join("\n")
  );
  process.exit(1);
}
```

Why this exists: if you run `node server/server.js` from the repo root, a naive `dotenv.config()` looks for `.env` in the **current working directory**, not next to the file. `fileURLToPath` + `path.join` solves that.

**`server/config/db.js`**:

```js
import mongoose from "mongoose";

export const connectDb = async () => {
  const uri = process.env.MONGO_URI;

  try {
    const conn = await mongoose.connect(uri);
    console.log(
      `Connected to MongoDB Database ${mongoose.connection.host}`.bgMagenta.white
    );
    return conn;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`.red);
    throw error;
  }
};
```

`mongoose.connect()` returns a promise. `connection.host` is available after connecting and is handy in logs.

### 3.5 Backend: models

A Mongoose schema is the contract for a document. `timestamps: true` adds `createdAt` and `updatedAt` automatically.

**`server/models/userModel.js`**

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uname: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
```

> [!note] `unique: true` is an index, not a validator
> MongoDB enforces uniqueness through an index. If the index has not been built yet, duplicates can slip in. Mongoose also does not turn a duplicate-key error into a friendly validation error automatically; the controller checks `findOne({ email })` first, but a race is still possible.

**`server/models/carModel.js`**

```js
import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Car name is required"] },
    model: { type: String, required: [true, "Car model is required"] },
    year: { type: String, required: [true, "Car year is required"] },
    category: { type: String, default: "sedan" },
    fuel: { type: String, default: "petrol" },
    seats: { type: Number, default: 4 },
    milage: { type: Number, default: 10 },
    price: { type: Number, default: 1000 },
    about: { type: String, required: [true, "Car description is required"] },
    image: { type: String },
    transmission: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const carModel = mongoose.model("Car", carSchema);
export default carModel;
```

Explain the two booleans:

- `transmission: true` means **automatic**; `false` means manual.
- `status: true` means **available**; `false` means booked out / hidden. It is a manual flag, not derived from bookings.

**`server/models/bookingModel.js`**

```js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Car",
    },
    startDate: { type: Date, required: [true, "start date is required"] },
    returnDate: { type: Date, required: [true, "return date is required"] },
    totalPrice: { type: Number, required: [true, "total price is required"] },
    price: { type: Number, required: [true, "price is required"] },
    status: {
      type: String,
      enum: ["pending", "confirm", "cancel"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const bookingModel = mongoose.model("Booking", bookingSchema);
export default bookingModel;
```

`ObjectId` + `ref` is the MongoDB way to model relationships. `populate("car", "name image price")` later replaces the id with the selected car fields.

> [!warning] The `user` ref is lowercase
> The model is registered as `"User"`, but the booking schema says `ref: "user"`. `populate("user")` would fail with `MissingSchemaError` unless the model name matches. This code avoids the issue by querying the user manually in `getBookingDetails`. If you refactor, change the ref to `"User"` or register the model as `"user"`.

### 3.6 Backend: authentication

**`server/controllers/userController.js`** — the two core functions:

```js
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { uname, email, password, phone } = req.body;

    if (!uname || !email || !password || !phone) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      uname,
      email,
      password: hashedPassword,
      phone,
    });

    await user.save();
    user.password = undefined;

    return res.status(201).send({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in register",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please add email or password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};
```

What is happening line by line:

1. `req.body` is populated by `express.json()`.
2. Validation happens before touching the database.
3. `findOne({ email })` prevents obvious duplicates.
4. `bcrypt.genSalt(10)` creates a random salt with 10 cost rounds. Higher = slower = harder to brute-force.
5. `bcrypt.hash` returns a one-way string such as `$2b$10$...`; you never store the plain password.
6. `JWT.sign({ id }, secret, { expiresIn: "7d" })` creates a signed token. Anyone can read the payload; only the server can sign/verify it.
7. `user.password = undefined` keeps the hash out of the JSON response. The complete file also has `updateUser` (hash the new password if present) and `getUser` (find by `req.user.id`, `.select("-password")`).

> [!danger] Security bug to know about (and fix in an interview)
> `updateUser` trusts `req.params.id` and `req.body`:
> ```js
> const data = { ...req.body };
> const user = await userModel.findByIdAndUpdate(id, { $set: data }, ...);
> ```
> Any signed-in user can send `PATCH /user/update/<someone-else-id>` and even `{ "isAdmin": true }`. Fix: ignore `isAdmin`, and require `req.user.id === id` (or an admin).
>
> ```js
> const { isAdmin, password, ...safe } = req.body;
> if (req.user.id !== req.params.id) {
>   return res.status(403).send({ success: false, message: "Forbidden" });
> }
> ```

### 3.7 Backend: auth middleware

**`server/middleware/authMiddleware.js`**

```js
import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const userAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(402).send({
        success: false,
        message: "Token not found",
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(402).send({
      success: false,
      message: "Error in User Auth",
      error,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (user.isAdmin !== true) {
      return res.status(402).send({
        success: false,
        message: "Unauthorized user",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(402).send({
      success: false,
      message: "Error in Admin auth",
      error,
    });
  }
};
```

Middleware is just a function with `(req, res, next)`. Call `next()` to continue; send a response to stop.

- `userAuth` accepts both `Authorization: <token>` and `Authorization: Bearer <token>`. The customer app sends the raw token; the admin car slice sends `Bearer <token>`. Both work because of the `startsWith` check.
- `isAdmin` must run **after** `userAuth` because it reads `req.user.id`.
- `402 Payment Required` is an unusual choice for auth failures. Standard codes are **401 Unauthorized** (missing/invalid token) and **403 Forbidden** (valid token, insufficient role). Mention this as a refinement.

### 3.8 Backend: cars and image uploads

**`server/middleware/multer.js`**

```js
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
```

`memoryStorage()` keeps the uploaded file in `req.file.buffer` instead of writing to disk. That is convenient for Base64 conversion but risky for large files: RAM grows with concurrent uploads. This repo does **not** set `limits.fileSize` or a MIME filter, even though the UI claims 5MB. A production version should:

```js
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});
```

**`server/controllers/carController.js`** — the important parts:

```js
import carModel from "../models/carModel.js";

export const addCar = async (req, res) => {
  try {
    const {
      name, about, year, seats, milage, fuel,
      category, price, status, transmission, model,
    } = req.body;

    if (!name || !about || !year || !seats || !milage ||
        !fuel || !category || !price || !model) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!req.file) {
      return res.status(404).send({
        success: false,
        message: "Please add image file",
      });
    }

    const photoBase64 = req.file.buffer.toString("base64");
    const isTransmissionAutomatic =
      typeof transmission === "string"
        ? transmission.toLowerCase() === "automatic" || transmission === "true"
        : Boolean(transmission);

    const car = new carModel({
      name, about, year, seats, milage, fuel, category, price,
      image: photoBase64,
      status,
      transmission: isTransmissionAutomatic,
      model,
    });

    await car.save();

    return res.status(201).send({
      success: true,
      message: "Car has been created",
      car,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in add car API",
      error: error.message,
    });
  }
};
```

The other four handlers:

- `getAllCars` → `carModel.find({})`, returns `{ totalCar, car }`.
- `getCarDetails` → `findById({ _id: id })`, 404 if missing.
- `updateCar` → copies `req.body`, converts `transmission` if present, replaces `image` only if a new file was uploaded, then `findByIdAndUpdate(id, { $set: data }, { returnDocument: "after", runValidators: true })`.
- `deleteCar` → `findByIdAndDelete({ _id: id })`.

Important details:

1. **`req.file` only exists if Multer ran.** The route uses `upload.single("image")`, so the form field must be named `image`.
2. **`req.file.buffer.toString("base64")`** turns binary into text. The client later turns it back into a data URL: `data:image/jpeg;base64,<string>`.
3. **`transmission` arrives as a string** from `FormData` (`"Automatic"` / `"Manual"`), but Mongoose expects a Boolean. The conversion handles both string and boolean inputs.
4. **`status` is not required**, so an empty value lets the schema default (`true`) apply.
5. The update route uses `returnDocument: "after"` (the modern Mongoose option) so the client receives the updated car, not the old one.

**`server/routes/carRoute.js`**

```js
import express from "express";
import { isAdmin, userAuth } from "../middleware/authMiddleware.js";
import {
  addCar, deleteCar, getAllCars, getCarDetails, updateCar,
} from "../controllers/carController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/add-car", userAuth, isAdmin, upload.single("image"), addCar);
router.get("/get-all", getAllCars);
router.get("/:id", getCarDetails);
router.patch("/update-car/:id", userAuth, isAdmin, upload.single("image"), updateCar);
router.delete("/delete-car/:id", userAuth, isAdmin, deleteCar);

export default router;
```

Route order matters: `/get-all` must be declared before `/:id`, otherwise Express treats `"get-all"` as an id. Middleware runs left to right: authenticate → authorise → parse the file → controller.

### 3.9 Backend: bookings

**`server/controllers/bookingController.js`** — the flows that matter:

```js
import bookingModel from "../models/bookingModel.js";
import carModel from "../models/carModel.js";
import userModel from "../models/userModel.js";

// Create
export const createBooking = async (req, res) => {
  try {
    const { user, car, startDate, returnDate, price, totalPrice } = req.body;

    if (!car || !user || !startDate || !returnDate || !price || !totalPrice) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const booking = new bookingModel({
      user, car, startDate, returnDate, price, totalPrice,
    });

    await booking.save();

    res.status(201).send({
      success: true,
      message: "Booking created",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create booking API",
      error,
    });
  }
};
```

**Get details** performs manual joins because it needs a flat shape for the admin UI:

```js
export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({ success: false, message: "Please provide booking id" });
    }

    const booking = await bookingModel.findById({ _id: id });
    if (!booking) {
      return res.status(404).send({ success: false, message: "No booking found with this id" });
    }

    const user = await userModel.findById({ _id: booking.user });
    const car = await carModel.findById({ _id: booking.car });

    res.status(200).send({
      success: true,
      message: "Booking details fetched successfully",
      booking: {
        id: booking._id,
        customerName: user.uname,
        phone: user.phone,
        startDate: booking.startDate,
        returnDate: booking.returnDate,
        price: car.price,
        totalPrice: booking.totalPrice,
        status: booking.status,
        bookingTime: booking.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in booking details API",
      error,
    });
  }
};
```

**Update status**:

```js
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await bookingModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { returnOrignal: false } // typo: Mongoose ignores this
    );

    res.status(200).send({
      success: true,
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in booking update API",
      error,
    });
  }
};
```

`findByIdAndUpdate` returns the **old** document by default. The admin slice compensates by trusting the status it just submitted. The correct option is `{ returnDocument: "after" }`.

**User changes dates** — validates order, then adds a flat ₹200 penalty:

```js
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, returnDate } = req.body;

    if (!startDate || !returnDate) {
      return res.status(400).send({
        success: false,
        message: "Please provide startDate and returnDate",
      });
    }

    if (new Date(returnDate) < new Date(startDate)) {
      return res.status(400).send({
        success: false,
        message: "Return date cannot be before start date",
      });
    }

    const existing = await bookingModel.findById(id);
    if (!existing) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
      });
    }

    const PENALTY = 200;
    const updatedTotalPrice = existing.totalPrice + PENALTY;

    const booking = await bookingModel.findByIdAndUpdate(
      id,
      { $set: { startDate, returnDate, totalPrice: updatedTotalPrice } },
      { returnDocument: "after" }
    );

    res.status(200).send({
      success: true,
      message: "Booking updated successfully. ₹200 penalty applied.",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update booking API",
      error,
    });
  }
};
```

**User bookings** uses `populate` so the customer UI gets the car name/image/price in one request:

```js
export const getUserBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    const booking = await bookingModel
      .find({ user: user._id })
      .populate("car", "name image price");

    res.status(200).send({
      success: true,
      message: "Your Bookings",
      totalBooking: booking.length,
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get user bookings API",
      error,
    });
  }
};
```

> [!danger] Trust boundaries in bookings
> `createBooking` trusts `user`, `price`, and `totalPrice` from the browser. A caller can book on behalf of another user or send ₹1 as the total. `updateBooking` and `getUserBooking` never check that the booking belongs to `req.user.id`.
>
> Production fix: derive `user` from `req.user.id`, load the car server-side, recompute `totalPrice`, and verify ownership (or admin role) before reading/updating a booking.

**`server/routes/bookingRoute.js`**

```js
import express from "express";
import { isAdmin, userAuth } from "../middleware/authMiddleware.js";
import {
  createBooking, getAllBookings, getBookingDetails,
  updateBookingStatus, getUserBooking, updateBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create", userAuth, createBooking);
router.get("/get-all", getAllBookings);
router.get("/get-details/:id", userAuth, isAdmin, getBookingDetails);
router.patch("/update-status/:id", userAuth, isAdmin, updateBookingStatus);
router.get("/user-booking/:id", userAuth, getUserBooking);
router.patch("/update/:id", userAuth, updateBooking);

export default router;
```

Notice: `get-all` is public, and the user-specific routes only require a valid token — not ownership.

### 3.10 Backend: wire the server

**`server/server.js`**

```js
import express from "express";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import "./config/env.js";
import { connectDb } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import carRoute from "./routes/carRoute.js";
import bookingRoute from "./routes/bookingRoute.js";

connectDb().catch(() => {
  console.error(
    "The API is running without a database connection. Check MONGO_URI in server/.env.".red
  );
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/car", carRoute);
app.use("/api/v1/booking", bookingRoute);

app.get("/", (req, res) => {
  res.status(200).send("<h1> Welcome to car server </h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server Running on Port ${PORT} in ${process.env.DEV_MODE} Mode`.bgBlue
  );
});
```

Middleware order is important:

1. `cors()` — add cross-origin headers before anything rejects the request.
2. `express.json()` — parse JSON bodies into `req.body`.
3. `morgan("dev")` — log requests.
4. Routes — resource-specific middleware and controllers.
5. `app.listen` — start accepting connections.

The API deliberately boots even if MongoDB is down (`connectDb().catch(...)`) so you can see the server log. Requests that need the DB will hang or fail until the connection returns.

**`server/routes/userRoutes.js`**

```js
import express from "express";
import { getUser, login, register, updateUser } from "../controllers/userController.js";
import { userAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get-user", userAuth, getUser);
router.patch("/update/:id", userAuth, updateUser);

export default router;
```

### 3.11 Backend: test with curl before building any UI

Start the server:

```bash
cd server
npm start
```

**Health check**

```bash
curl http://localhost:8080/
```

**Register**

```bash
curl -X POST http://localhost:8080/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "uname": "Test User",
    "email": "test@example.com",
    "password": "secret123",
    "phone": "9876543210"
  }'
```

**Login** (copy the token from the response)

```bash
curl -X POST http://localhost:8080/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}'
```

**Promote to admin**

```bash
mongosh "mongodb://127.0.0.1:27017/virtuacarz" \
  --eval 'db.users.updateOne({email:"test@example.com"},{$set:{isAdmin:true}})'
```

Log in again to get a fresh response that includes `"isAdmin": true` (the JWT itself only contains the id; the admin check reads the DB).

**Add a car** (multipart; the field must be named `image`)

```bash
curl -X POST http://localhost:8080/api/v1/car/add-car \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Honda City" \
  -F "model=ZX CVT" \
  -F "year=2024" \
  -F "category=Sedan" \
  -F "fuel=Petrol" \
  -F "seats=5" \
  -F "milage=18" \
  -F "price=2000" \
  -F "about=A comfortable sedan for city and highway drives." \
  -F "transmission=Automatic" \
  -F "image=@/absolute/path/to/car.jpg"
```

**List cars**

```bash
curl http://localhost:8080/api/v1/car/get-all
```

**Create a booking** (use real ids from the previous responses)

```bash
curl -X POST http://localhost:8080/api/v1/booking/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "user": "USER_OBJECT_ID",
    "car": "CAR_OBJECT_ID",
    "startDate": "2026-11-10",
    "returnDate": "2026-11-12",
    "price": 2000,
    "totalPrice": 6000
  }'
```

**Read the user’s bookings**

```bash
curl http://localhost:8080/api/v1/booking/user-booking/USER_OBJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

> [!success] Checkpoint
> Before moving on, you should be able to register, log in, add a car with an image, list cars, create a booking, and read that booking back. If any of these fail, fix the API first — the UI cannot compensate for a broken contract.

### 3.12 Customer app: scaffold with Vite

From the repo root:

```bash
npm create vite@latest client -- --template react
cd client
npm install
npm install react-router @reduxjs/toolkit react-redux axios framer-motion react-hot-toast
npm install -D tailwindcss @tailwindcss/vite
```

> [!note] Folder already exists?
> `npm create vite` asks what to do when the target directory exists. Choose “Ignore files and continue” if you already created an empty `client/` folder. If you are rebuilding from scratch, delete or rename the old folder first.

**`client/vite.config.js`**

```js
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
});
```

**`client/src/index.css`** — Tailwind 4 uses CSS for configuration:

```css
@import "tailwindcss";

@theme {
  --color-cream: #fbfbf8;
  --color-cream-dark: #f5f4ef;
  --color-cream-deep: #f0eee6;
  --color-ink: #18181b;
  --color-ink-soft: #737373;
  --color-accent: #fa520f;
  --color-accent-deep: #d94400;
  --color-line: #e5e5e5;
  --color-ink-inverse: #fafafa;

  --font-sans: "Figtree", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-display: "Figtree", ui-sans-serif, system-ui, sans-serif;
  --ease-editorial: cubic-bezier(0.22, 1, 0.36, 1);
}

body {
  margin: 0;
  background-color: #fbfbf8;
  color: #18181b;
  font-family: "Figtree", ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

Tailwind reads those tokens and generates classes such as `bg-cream`, `text-ink`, `border-line`, `text-accent`, and `ease-editorial`.

**`client/index.html`** — add the font and icon CDNs inside `<head>`:

```html
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.1/css/all.min.css"
/>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800;900&display=swap"
  rel="stylesheet"
/>
```

**`client/.env.local`**

```dotenv
VITE_BASEURL=http://localhost:8080/api/v1
```

**Folder structure**

```text
client/src/
├── api/API.jsx
├── components/
│   ├── Header.jsx, Footer.jsx
│   ├── CarCard.jsx
│   ├── BookingModal.jsx
│   ├── BookingDetailsModal.jsx
│   ├── EditBookingModal.jsx
│   ├── EditModal.jsx
│   └── ui/Button.jsx, Eyebrow.jsx, PageHeader.jsx, Reveal.jsx, SectionHeading.jsx
├── pages/
│   ├── Home.jsx, About.jsx, Contact.jsx
│   ├── Auth/Login.jsx, Auth/Register.jsx
│   ├── Car/Cars.jsx, Car/CarDetails.jsx
│   └── user/Profile.jsx
├── store/
│   ├── store.js
│   └── features/authSlice.js, carSlice.js
├── utils/image.js
├── Data/carsData.json
├── App.jsx
└── main.jsx
```

### 3.13 Customer app: API layer and Redux

**`client/src/api/API.jsx`** — one Axios instance for the whole app:

```js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
});

API.interceptors.request.use(
  async (config) => {
    try {
      const localData = localStorage.getItem("appData");
      const appData = JSON.parse(localData);

      if (appData) {
        config.headers.Authorization = `${appData?.token}`;
      }
    } catch (error) {
      console.log(error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
```

Why an instance + interceptor: every request automatically gets the current token, so thunks do not repeat auth logic. The token is stored raw in `appData`; the server accepts raw or `Bearer`.

**`client/src/store/store.js`**

```js
import { configureStore } from "@reduxjs/toolkit";
import carReducer from "./features/carSlice";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    cars: carReducer,
    auth: authReducer,
  },
});
```

The store shape is:

```text
state.cars  → { loading, success, cars, carDetail, error }
state.auth  → { loading, success, user, token, error, bookings }
```

**`client/src/store/features/authSlice.js`** — the key pattern:

```js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/API";

export const login = createAsyncThunk(
  "auth/userLogin",
  async ({ email, password }, thunkApi) => {
    try {
      const res = await API.post("/user/login", { email, password });
      localStorage.setItem("appData", JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error logging in";
      return thunkApi.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    success: false,
    user: null,
    token: null,
    error: null,
    bookings: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("appData");
    },
    reset: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout, reset } = authSlice.actions;
export default authSlice.reducer;
```

The same file also defines:

- `register` — POST `/user/register`.
- `updateUser` — PATCH `/user/update/:id`, then updates Redux **and** localStorage so the header/profile re-render immediately.
- `getUserBookings` — GET `/booking/user-booking/:id`, stores `action.payload.booking`.
- `updateBooking` — PATCH `/booking/update/:id`, replaces the matching booking in `state.bookings`.
- `loadToken` — reads the token from localStorage on app start.

The initial state also hydrates from localStorage synchronously:

```js
const getInitialAuthData = () => {
  try {
    const raw = localStorage.getItem("appData");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
```

**`client/src/store/features/carSlice.js`** — two thunks:

```js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/API";

export const getAllCars = createAsyncThunk(
  "car/getAllCars",
  async (_, thunkApi) => {
    try {
      const res = await API.get("/car/get-all");
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || error.message || "Error fetching cars"
      );
    }
  }
);

export const getCarDetails = createAsyncThunk(
  "car/getCarDetails",
  async (id, thunkApi) => {
    try {
      const res = await API.get(`/car/${id}`);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || error.message || "Error fetching car"
      );
    }
  }
);

const carSlice = createSlice({
  name: "car",
  initialState: {
    loading: false,
    success: false,
    cars: [],
    carDetail: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload.car;
      })
      .addCase(getAllCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCarDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCarDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.carDetail = action.payload.car;
      })
      .addCase(getCarDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default carSlice.reducer;
```

> [!tip] Why `unwrap()` in components
> `dispatch(login(...))` returns a promise, but it **resolves even when the thunk rejects**. Calling `.unwrap()` turns rejection into a thrown error, which is what lets a component’s `try/catch` show a toast.

### 3.14 Customer app: routing and shell

**`client/src/main.jsx`**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";
import App from "./App.jsx";
import { store } from "./store/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <StrictMode>
        <App />
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </StrictMode>
    </BrowserRouter>
  </Provider>
);
```

The customer app actually shows notifications with **react-hot-toast** (`<Toaster />` in `App.jsx`), so the `ToastContainer` above is effectively unused. Keep one library in a cleanup.

**`client/src/App.jsx`** (simplified but structurally accurate):

```jsx
import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadToken } from "./store/features/authSlice";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Cars from "./pages/Car/Cars";
import CarDetails from "./pages/Car/CarDetails";
import Profile from "./pages/user/Profile";
import Header from "./components/Header";
import Footer from "./components/Footer";

const MotionPage = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  const pageVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.25 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1, y: 0,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
        exit: {
          opacity: 0, y: -10,
          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit">
      {children}
    </motion.div>
  );
};

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <Toaster />
      {!isAuthRoute && <Header />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <MotionPage key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </MotionPage>
        </AnimatePresence>
      </main>
      {!isAuthRoute && <Footer />}
    </div>
  );
}

export default App;
```

`useParams()` reads `:id`; `useNavigate()` changes routes programmatically; `NavLink` adds an active class. There is no catch-all 404 route in the customer app — a nice small addition.

### 3.15 Customer app: auth pages

**`Login.jsx`** — controlled inputs, a thunk, a redirect:

```jsx
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const { loading, token } = useSelector((state) => state.auth);
const dispatch = useDispatch();
const navigate = useNavigate();

useEffect(() => {
  if (token) navigate("/");
}, [token, navigate]);

const handleSubmit = async (event) => {
  event.preventDefault();

  if (!email.trim() || !password.trim()) {
    toast.error("Please provide your email and password");
    return;
  }

  try {
    await dispatch(login({ email: email.trim(), password })).unwrap();
    toast.success("Login successful!");
    navigate("/cars");
  } catch (error) {
    toast.error(error || "Login failed. Please check your credentials.");
  }
};
```

**`Register.jsx`** is the same pattern with `uname`, `email`, `phone`, `password`, a terms checkbox, and `dispatch(register(...))` followed by `navigate("/login")`.

> [!note] The auth pages are full-screen two-column layouts
> The left panel is a dark editorial statement; the right panel is the form. On small screens the left panel is hidden. They intentionally do not show the normal `Header`/`Footer`, which is why `App.jsx` checks `isAuthRoute`.

### 3.16 Customer app: fleet, details, and booking

**`Cars.jsx`** dispatches `getAllCars()` on mount and renders one of four states: loading, error, empty, or a responsive grid of `<CarCard />`.

**`CarCard.jsx`** is a link to `/cars/:id` with:

- image (Base64 or URL via `getImageSrc`),
- availability pill (`car.status === false` → “Booked out”),
- name/year, two-line description, category/fuel/seats,
- price per day and a “View” affordance.

**`utils/image.js`**

```js
export const getImageSrc = (image) => {
  if (!image) return null;
  if (image.startsWith("http") || image.startsWith("data:")) return image;
  return `data:image/jpeg;base64,${image}`;
};
```

This is why the API can store a plain Base64 string while the `<img>` still works.

**`CarDetails.jsx`** — the booking handler is the most important logic:

```jsx
const { user } = useSelector((state) => state.auth);
const [pickupDate, setPickupDate] = useState(today);
const [returnDate, setReturnDate] = useState(today);

const handleBooking = async () => {
  if (!user?._id) {
    toast.error("Please log in to book a car");
    return;
  }

  if (!pickupDate || !returnDate) {
    toast.error("Please select pickup and return dates");
    return;
  }

  if (new Date(returnDate) < new Date(pickupDate)) {
    toast.error("Return date cannot be before pickup date");
    return;
  }

  const days =
    Math.ceil(
      (new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)
    ) + 1;

  const totalPrice = days * Number(carDetails.price || 0);

  try {
    await API.post("/booking/create", {
      user: user._id,
      car: carDetails._id,
      startDate: pickupDate,
      returnDate,
      price: carDetails.price,
      totalPrice,
    });

    toast.success(`${carDetails.name} booked successfully!`);
    setShow(false);
  } catch (bookingError) {
    toast.error(
      bookingError.response?.data?.message || "Failed to create booking"
    );
  }
};
```

The +1 makes the rental **inclusive** of both pickup and return day. The modal (`BookingModal.jsx`) repeats the calculation for the live summary:

```js
const difference = dropoff - pickup;
const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
const rentalDays = days >= 0 ? days + 1 : 0;
const totalPrice = rentalDays * Number(car?.price || 0);
```

> [!warning] Inconsistent pricing logic
> The home page uses `Math.max(1, Math.ceil(diff))` **without** +1, while car details and the modal use +1. The same dates can therefore show different totals depending on where the booking started. Centralise this in one utility and, ideally, recompute on the server.

### 3.17 Customer app: profile and bookings

`Profile.jsx` is the busiest page. On mount it fetches the user’s bookings:

```jsx
useEffect(() => {
  if (user?._id) {
    dispatch(getUserBookings({ id: user._id }))
      .unwrap()
      .catch(() => toast.error("Failed to load bookings"));
  }
}, [user?._id, dispatch]);
```

It then offers four actions:

1. **View booking** → opens `BookingDetailsModal` with car, dates, duration, and payment summary.
2. **Edit profile** → opens `EditModal`; dispatches `updateUser`, which syncs Redux + localStorage.
3. **Edit booking dates** → opens `EditBookingModal`; dispatches `updateBooking`; the server adds ₹200.
4. **Logout** → a Redux reducer clears state and localStorage (the JWT itself stays valid until expiry).

The profile page has a responsive strategy: a **card list below `lg`** and a **table from `lg` up**, rather than a horizontally squashed table on phones.

### 3.18 Customer app: design system

The visual language is documented in [[admin-panel-design-prompt|the design prompt]]. The minimum you need to rebuild it:

- **Tokens** — cream surfaces, ink text, one orange accent, hairline `#e5e5e5` rules. Defined in `@theme`.
- **Type** — Figtree; display headings with tight tracking (`tracking-[-0.04em]`) and short leading (`leading-[0.95]`), ending in an orange period.
- **Eyebrow** — a 40px orange rule + 10px uppercase label with wide tracking (`Eyebrow.jsx`).
- **PageHeader** — eyebrow, oversized title, description, optional right-side stat/aside, optional back link (`PageHeader.jsx`).
- **Button** — three variants: `primary` (ink), `accent` (orange), `outline` (hairline), three sizes (`Button.jsx`).
- **Reveal** — Framer Motion fade/rise on scroll, disabled when `prefers-reduced-motion` (`Reveal.jsx`).
- **SectionHeading** — animated heading block, left or centre (`SectionHeading.jsx`).
- **No cards everywhere** — sections use rules, spacing, and asymmetric grids. Radii stay at `0` or `rounded-md`; shadows are rare.
- **Responsive breakpoints** — `sm`, `lg`, and `xl`; mobile-first classes.
- **Accessibility** — semantic headings, `aria-label` on icon buttons, focus rings, `aria-modal` on dialogs, Escape closes the booking modal, reduced-motion support.

> [!success] Checkpoint
> The customer app should now load cars from the API, register/login, create a booking, and show it on the profile. If the page is blank, check the browser console and the Network tab before touching CSS.

### 3.19 Admin panel: scaffold

From the repo root:

```bash
npm create vite@latest admin-panel -- --template react
cd admin-panel
npm install
npm install react-router-dom @reduxjs/toolkit react-redux axios framer-motion react-toastify
npm install -D tailwindcss @tailwindcss/vite
```

Copy the same Tailwind setup as the customer app:

- `vite.config.js` with `tailwindcss()` + `react()`.
- `index.css` with `@import "tailwindcss";` and the same `@theme` tokens.
- `index.html` with Figtree + Font Awesome.
- `.env.local` with `VITE_BASEURL=http://localhost:8080/api/v1`.

Folder structure:

```text
admin-panel/src/
├── API/api.jsx
├── components/Layout.jsx, Menus.jsx
├── pages/
│   ├── Home.jsx                 # dashboard
│   ├── AllCars.jsx
│   ├── AddCar.jsx
│   ├── EditCar.jsx             # redirects to /car-details/:id
│   ├── AllBookings.jsx
│   └── auth/
│       ├── Login.jsx
│       ├── CarDetails.jsx      # view + edit + delete a car
│       └── BookingDetails.jsx  # view + update status
├── store/
│   ├── store.js
│   ├── authSlice.js
│   ├── carSlice.js
│   └── bookingSlice.js
├── App.jsx
└── main.jsx
```

### 3.20 Admin: API, store, and protected routes

The admin `API/api.jsx` is the same Axios instance + interceptor as the customer app.

**`admin-panel/src/store/store.js`**

```js
import { configureStore } from "@reduxjs/toolkit";
import carReducer from "./carSlice";
import authReducer from "./authSlice";
import bookingReducer from "./bookingSlice";

const store = configureStore({
  reducer: {
    cars: carReducer,
    auth: authReducer,
    bookings: bookingReducer,
  },
});

export default store;
```

**Admin auth differs from customer auth in one important way** — login rejects non-admins:

```js
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkApi) => {
    try {
      const res = await API.post("/user/login", { email, password });

      if (!res.data?.user?.isAdmin) {
        localStorage.removeItem("appData");
        return thunkApi.rejectWithValue(
          "This account does not have administrator access."
        );
      }

      localStorage.setItem("appData", JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      return thunkApi.rejectWithValue(message);
    }
  }
);
```

`getUserData` calls `GET /user/get-user` on every app load to refresh the stored user from the database. This matters because localStorage can be stale or tampered with.

**`admin-panel/src/App.jsx`** — route guard:

```jsx
const ProtectedRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token || !user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  useEffect(() => {
    if (token) dispatch(getUserData());
  }, [dispatch, token]);

  const isAdmin = Boolean(token && user?.isAdmin);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/login"
          element={isAdmin ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/all-cars" element={<ProtectedRoute><AllCars /></ProtectedRoute>} />
        <Route path="/car-details/:id" element={<ProtectedRoute><CarDetails /></ProtectedRoute>} />
        <Route path="/add-car" element={<ProtectedRoute><AddCar /></ProtectedRoute>} />
        <Route path="/edit-car/:id" element={<ProtectedRoute><EditCar /></ProtectedRoute>} />
        <Route path="/all-bookings" element={<ProtectedRoute><AllBookings /></ProtectedRoute>} />
        <Route path="/booking-details/:id" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={isAdmin ? "/" : "/login"} replace />} />
      </Routes>
    </>
  );
};
```

> [!important] Frontend guards are UX, not security
> Anyone can edit localStorage and make `user.isAdmin` true. The real protection is the server’s `userAuth` + `isAdmin` middleware. Never rely on a React route guard for authorization. Some admin data is still visible because `GET /booking/get-all` and `GET /car/get-all` are public; a production build should make booking data admin-only.

### 3.21 Admin: layout, dashboard, and fleet CRUD

**`Layout.jsx`** provides the fixed desktop sidebar, mobile drawer, sticky header, account dropdown, and logout. **`Menus.jsx`** defines the nav groups (Overview, Fleet, Reservations) with `NavLink` active states.

**Dashboard (`pages/Home.jsx`)** dispatches `getAllCars()` + `getAllBookings()` and derives:

```js
const fleetCount = cars.length;
const bookingCount = bookings.length;
const grossValue = bookings.reduce(
  (sum, b) => sum + Number(b?.totalPrice || 0),
  0
);
const categoryCounts = cars.reduce((counts, car) => {
  const category = car?.category || "Other";
  counts[category] = (counts[category] || 0) + 1;
  return counts;
}, {});
```

It shows three stats (fleet, bookings, gross booking value), quick actions, and a category breakdown. All values are computed client-side from the two lists.

**Fleet CRUD** lives in `carSlice.js`:

- `addCar(formData)` → POST `/car/add-car` with `Authorization: Bearer <token>`.
- `getAllCars()` → GET `/car/get-all`.
- `getCarDetails(id)` → GET `/car/:id`.
- `updateCar({ id, formData })` → PATCH `/car/update-car/:id`.
- `deleteCar(id)` → DELETE `/car/delete-car/:id`.

The add car form builds `FormData` — **do not set `Content-Type` manually**; the browser/Axios adds the multipart boundary:

```js
const formData = new FormData();
formData.append("name", name);
formData.append("model", model);
formData.append("year", year);
formData.append("category", category);
formData.append("fuel", fuel);
formData.append("seats", seats);
formData.append("milage", milage);
formData.append("price", price);
formData.append("about", about);
formData.append("transmission", transmission);
formData.append("image", image); // File object from <input type="file">

dispatch(addCar(formData));
```

The form includes:

- a **live image preview** via `URL.createObjectURL(file)`,
- validation for every required field,
- a success effect that resets the form and shows a toast,
- an editorial “Before publishing” checklist.

**Car details/edit page** does more than edit: it also has a **live listing preview** and a **danger zone** delete button. `handleUpdate` sends the same `FormData`, but only appends `image` if the user selected a new file, so the existing image is preserved.

### 3.22 Admin: bookings

**`AllBookings.jsx`**:

```jsx
const [statusFilter, setStatusFilter] = useState("all");

const filteredBookings = useMemo(
  () =>
    statusFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === statusFilter),
  [bookings, statusFilter]
);
```

The filter options are exactly the server enum values: `pending`, `confirm`, `cancel`. The page renders cards below `lg` and a table above `lg`, with loading, error, and empty states.

**`BookingDetails.jsx`**:

```jsx
const { bookingDetail, loading, updating, error } = useSelector(
  (state) => state.bookings
);

useEffect(() => {
  dispatch(getBookingDetails(id));
}, [dispatch, id]);

const handleStatusUpdate = async (event) => {
  event.preventDefault();
  try {
    await dispatch(updateBookingStatus({ id, status })).unwrap();
    toast.success("Booking status updated");
    navigate("/all-bookings");
  } catch (updateError) {
    toast.error(
      typeof updateError === "string"
        ? updateError
        : "Unable to update booking status"
    );
  }
};
```

The server returns a flattened object with `id` (not `_id`) from `getBookingDetails`, which is why the admin slice stores `payload.booking` and matches both `id` and `_id` in places.

`bookingSlice.js` keeps `bookings`, `bookingDetail`, `loading`, `updating`, `success`, and `error`. On a successful status update it trusts the submitted status rather than the returned document, because the server still returns the pre-update document due to the `returnOrignal` typo.

### 3.23 Run everything and create an admin

Three terminals:

```bash
# 1 — API
cd server
npm start

# 2 — customer
cd client
npm run dev

# 3 — admin
cd admin-panel
npm run dev
```

Open:

- API: [http://localhost:8080](http://localhost:8080)
- Customer: [http://localhost:5173](http://localhost:5173)
- Admin: usually [http://localhost:5174](http://localhost:5174)

**Create the first admin**

1. Register a normal account in the customer app.
2. Promote it in MongoDB:

```bash
mongosh "mongodb://127.0.0.1:27017/virtuacarz" \
  --eval 'db.users.updateOne({email:"you@example.com"},{$set:{isAdmin:true}})'
```

3. Log in to the admin panel with the same credentials.

> [!warning] The JWT does not contain `isAdmin`
> The token payload is only `{ id, iat, exp }`. Admin status is read from MongoDB on each admin request. That means promoting a user does not require a new token, but `getUserData`/login is what refreshes the frontend’s cached `user.isAdmin`.

### 3.24 Build and deploy

**Local production build**

```bash
cd client && npm run build && npm run preview
cd ../admin-panel && npm run build && npm run preview
```

Observed build output from this repo:

| App | JS | JS gzip | CSS | CSS gzip |
| --- | --- | --- | --- | --- |
| Customer | 627.83 kB | 186.18 kB | 60.99 kB | 11.41 kB |
| Admin | 584.54 kB | 178.12 kB | 39.16 kB | 7.86 kB |

Both builds emit Vite’s “chunks larger than 500 kB” warning. A production improvement is route-level code splitting with `React.lazy` + `Suspense`.

**Deployment shape**

```mermaid
flowchart LR
  V1[Vercel/Netlify<br/>client build] --> API[Render/Railway<br/>Express API]
  V2[Vercel/Netlify<br/>admin build] --> API
  API --> Atlas[(MongoDB Atlas)]
```

1. **Database** — create MongoDB Atlas M0, a DB user, allow the API host’s IP (or `0.0.0.0/0` during setup), copy the SRV URI.
2. **API** — deploy `server/` to Render/Railway/Fly. Set `MONGO_URI`, `JWT_SECRET`, `PORT` (the platform usually injects it), and `DEV_MODE=production`. Build command: `npm install`; start command: `npm start`.
3. **Frontends** — deploy `client/` and `admin-panel/` to Vercel/Netlify. Root directory = the app folder. Build command: `npm run build`. Output directory: `dist`. Set `VITE_BASEURL=https://your-api.onrender.com/api/v1` **before building**.
4. **SPA rewrites** — React Router uses client-side routes. On refresh, `/cars/123` must return `index.html`. Netlify: `/* /index.html 200`. Vercel: a rewrite from `/(.*)` to `/index.html`.
5. **CORS** — replace `app.use(cors())` with an allowlist of your deployed origins:

```js
app.use(cors({
  origin: [
    "https://virtuacarz.vercel.app",
    "https://virtuacarz-admin.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
}));
```

6. **Images** — Base64-in-Mongo works for a demo but not for scale. Move to Cloudinary/S3 and store only the URL.

> [!warning] Vite env vars are baked in at build time
> Changing `VITE_BASEURL` on the hosting dashboard after a build does nothing until you rebuild. This is the most common “works locally, fails in production” cause.

### 3.25 Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Missing required environment variables` | `server/.env` absent or keys empty | `cp server/.env.example server/.env`, fill it, restart |
| `MongoDB connection failed: ECONNREFUSED` | MongoDB is not running / wrong URI | Start `mongod` or use Atlas; check the host/port |
| API boots but requests hang | Mongoose buffering while disconnected | Fix `MONGO_URI`; wait for “Connected to MongoDB” |
| `Token not found` / 402 | No `Authorization` header | Log in again; check localStorage `appData.token` |
| `jwt malformed` | Token includes extra quotes/prefix incorrectly | Send raw token or exactly `Bearer <token>` |
| `Invalid Credentials` on login | Wrong password, or user not found | Re-register or reset the hash; check email case |
| CORS error in browser | API origin not allowed after deployment | Add the frontend origin to `cors({ origin: [...] })` |
| `EADDRINUSE :8080` | Another process owns the port | `lsof -i :8080`, kill it, or change `PORT` |
| Blank React page | Runtime error before render | Open DevTools Console; check the Network tab |
| `import.meta.env.VITE_BASEURL` is undefined | Env file not named `.env.local`, or dev server not restarted | Rename + restart `npm run dev` |
| Images broken | Stored string is not Base64/data URL | Prefix `data:image/jpeg;base64,`; check `getImageSrc` |
| 404 on refresh in production | Missing SPA rewrite | Add the `/* → /index.html` rule |
| Admin login says “no administrator access” | `isAdmin` is false in MongoDB | Promote the user, then log in again |
| Booking status does not change in UI | Old document returned (`returnOrignal` typo) | Slice already trusts submitted status; fix server to `returnDocument: "after"` |
| `Cannot read properties of null (reading 'password')` | `findByIdAndUpdate` returned null in `updateUser` | Check the id; return 404 before touching `user.password` |
| `Cast to ObjectId failed` | Invalid id in the URL | Validate ids with `mongoose.isValidObjectId` |
| Duplicate key error on register | Two requests raced past `findOne` | Handle error code 11000 and return 409 |
| `npm create vite` refuses the folder | Directory not empty | Choose “Ignore files and continue” or remove the folder |
| Tailwind classes do nothing | Tailwind v4 config not wired | Check `@import "tailwindcss";` + `tailwindcss()` plugin |

### 3.26 Rebuild checklist

Use this as a progress tracker. Each item is a checkpoint, not a race.

- [ ] Node, npm, MongoDB installed and verified.
- [ ] Root `.gitignore` created.
- [ ] `server/` initialised with `type: module` and dependencies.
- [ ] `.env` + `.env.example` created; server fails fast when keys are missing.
- [ ] Mongo connection logs “Connected to MongoDB”.
- [ ] User, Car, Booking models created.
- [ ] Register + login work; password is hashed; token is returned.
- [ ] `userAuth` protects routes; `isAdmin` blocks non-admins.
- [ ] Car CRUD works; image is stored as Base64.
- [ ] Booking create/read/status/date-change works.
- [ ] API tested with curl/Postman before UI work.
- [ ] Customer Vite app + Tailwind 4 + env configured.
- [ ] Axios instance injects the token.
- [ ] Redux store + auth/car slices work.
- [ ] Routes render; header/footer hide on auth pages.
- [ ] Register/login redirect correctly.
- [ ] Fleet loads; details page loads; booking creates.
- [ ] Profile loads bookings; profile edit syncs.
- [ ] Booking date edit applies the ₹200 penalty.
- [ ] Admin Vite app + Tailwind + env configured.
- [ ] Admin login rejects non-admins.
- [ ] Protected routes redirect unauthenticated users.
- [ ] Dashboard counts are correct.
- [ ] Add/edit/delete car works with image preview.
- [ ] Booking list filters; details page updates status.
- [ ] Both frontends build with `npm run build`.
- [ ] Deployment env vars + SPA rewrites + CORS set.
- [ ] Admin account promoted in the production database.

---

## Part IV — How the code works

This part is for revision and interviews. It explains the *why* behind the code and the flows you should be able to draw on a whiteboard.

### 4.1 Backend request lifecycle

Every request follows the same spine:

```text
HTTP request
  → Express app
  → global middleware (cors, json, morgan)
  → router match (/api/v1/<resource>)
  → route middleware (userAuth, isAdmin, upload.single)
  → controller
  → Mongoose model
  → MongoDB
  → controller response
  → JSON to the client
```

Example: `PATCH /api/v1/car/update-car/64f...`

1. `express.json()` parses the body (but this route is multipart, so Multer does it).
2. `userAuth` reads `Authorization`, strips `Bearer `, verifies the JWT, sets `req.user`.
3. `isAdmin` loads that user from MongoDB and checks `isAdmin === true`.
4. `upload.single("image")` parses the form and sets `req.file` if a file was sent.
5. `updateCar` merges `req.body`, converts `transmission`, converts a new image buffer to Base64, and calls `findByIdAndUpdate`.
6. The controller sends `{ success, message, car }`.

### 4.2 Authentication sequence

```mermaid
sequenceDiagram
  participant B as Browser
  participant R as React
  participant A as Express
  participant D as MongoDB

  B->>R: email + password
  R->>A: POST /user/login
  A->>D: findOne({ email })
  D-->>A: user document (password hash)
  A->>A: bcrypt.compare(password, hash)
  A->>A: JWT.sign({ id }, JWT_SECRET, 7d)
  A-->>R: { token, user }
  R->>R: localStorage.setItem("appData", ...)
  R->>R: Redux state.user/token
  R->>A: later request + Authorization
  A->>A: JWT.verify(token, JWT_SECRET)
  A->>D: isAdmin check if needed
  D-->>A: user
  A-->>R: protected data
```

What the token contains:

```json
{
  "id": "64f1c2...",
  "iat": 1762400000,
  "exp": 1763004800
}
```

It does **not** contain the password, email, or `isAdmin`. That is why the admin middleware must query the database. It also means a token remains valid for 7 days even after logout, because logout only deletes the client copy.

### 4.3 Booking sequence

```mermaid
sequenceDiagram
  participant U as User
  participant C as CarDetails
  participant A as API
  participant B as Booking controller
  participant DB as MongoDB

  U->>C: choose dates, click Book
  C->>C: validate dates
  C->>C: days = ceil(diff) + 1
  C->>C: total = days × price
  C->>A: POST /booking/create {user, car, dates, price, total}
  A->>A: userAuth
  A->>B: createBooking
  B->>DB: new Booking(...).save()
  DB-->>B: document with _id
  B-->>A: 201 { booking }
  A-->>C: response
  C-->>U: success toast, close modal
```

Admin status flow:

```text
Admin opens /booking-details/:id
  → GET /booking/get-details/:id (userAuth + isAdmin)
  → controller loads booking, then user, then car
  → returns flattened object { id, customerName, phone, dates, price, totalPrice, status }
  → admin selects pending/confirm/cancel
  → PATCH /booking/update-status/:id
  → slice updates local list with submitted status
  → navigate back to /all-bookings
```

### 4.4 Redux data flow

```mermaid
flowchart LR
  UI[Component] -->|dispatch| Thunk[createAsyncThunk]
  Thunk -->|Axios request| API[Express API]
  API -->|response| Thunk
  Thunk -->|pending / fulfilled / rejected| Slice[Slice extraReducers]
  Slice --> Store[Redux store]
  Store -->|useSelector| UI
```

In this project:

- **authSlice** owns `user`, `token`, `bookings`, and request status.
- **carSlice** (customer) owns the fleet list and the selected car detail.
- **admin carSlice** owns the fleet list, selected car, and CRUD status.
- **admin bookingSlice** owns all bookings, one booking detail, and status-update state.

Local state still matters:

- form fields (`email`, `password`, `name`, `price`, …),
- modal visibility,
- filter/search/sort values,
- date selections.

Rule of thumb: **server data → Redux; ephemeral UI state → `useState`**.

### 4.5 Image upload pipeline

```mermaid
flowchart LR
  F[File input] -->|FormData| M[Multer memoryStorage]
  M -->|req.file.buffer| C[Controller]
  C -->|toString base64| S[Base64 string]
  S -->|Mongoose| DB[(MongoDB document)]
  DB -->|JSON response| R[React]
  R -->|data:image/jpeg;base64,...| IMG[img src]
```

Why Base64?

- No separate file server or cloud account.
- The image travels with the car document.
- Easy to demo.

Why it is a trade-off:

- Base64 is ~33% larger than binary.
- MongoDB has a 16MB document limit. A 12MB image becomes ~16MB of text, plus other fields → failure.
- `GET /car/get-all` returns **every** car’s image string, so the list payload grows with the fleet.
- Memory storage means concurrent large uploads can exhaust server RAM.
- No cache headers, no CDN, no responsive image sizes.

Production alternative: upload to S3/Cloudinary, store `{ url, publicId }`, return a CDN URL. Keep only metadata in Mongo.

### 4.6 File-by-file map

**Backend**

| File | Responsibility | Interview note |
| --- | --- | --- |
| `server/server.js` | Express app, middleware, route mounting, listen | Entry point; env imported first |
| `server/config/env.js` | Absolute `.env` load + required-key check | Explains ESM + `__dirname` workaround |
| `server/config/db.js` | `mongoose.connect` | Connection error is rethrown and caught at boot |
| `server/models/userModel.js` | User schema | `unique` email, `isAdmin` default false |
| `server/models/carModel.js` | Car schema | `transmission`/`status` booleans, `milage` spelling |
| `server/models/bookingModel.js` | Booking schema | ObjectId refs, status enum, timestamps |
| `server/controllers/userController.js` | register/login/update/getUser | bcrypt + JWT; ownership bug in update |
| `server/controllers/carController.js` | Car CRUD + Base64 | `req.file.buffer` pipeline |
| `server/controllers/bookingController.js` | Booking CRUD | Manual joins + penalty logic |
| `server/middleware/authMiddleware.js` | `userAuth`, `isAdmin` | Bearer handling; 402 vs 401/403 |
| `server/middleware/multer.js` | memoryStorage upload | No size/type limits |
| `server/routes/*.js` | URL → middleware → controller | Route ordering matters |

**Customer app**

| File | Responsibility |
| --- | --- |
| `src/main.jsx` | Provider, BrowserRouter, global styles, toast container |
| `src/App.jsx` | Routes, page transitions, header/footer visibility |
| `src/api/API.jsx` | Axios base URL + token interceptor |
| `src/store/store.js` | Combine `cars` + `auth` reducers |
| `src/store/features/authSlice.js` | Auth, profile, bookings, date updates |
| `src/store/features/carSlice.js` | Fleet list + car detail |
| `src/pages/Home.jsx` | Marketing home + search + fleet preview + FAQ |
| `src/pages/Car/Cars.jsx` | Fleet grid + loading/error/empty |
| `src/pages/Car/CarDetails.jsx` | Specs, availability, booking modal |
| `src/pages/user/Profile.jsx` | Profile edit, bookings, booking modals |
| `src/components/Header.jsx` | Desktop/mobile nav, account menu, logout |
| `src/components/BookingModal.jsx` | Date pickers, live price summary |
| `src/components/ui/*` | Button, Eyebrow, PageHeader, Reveal, SectionHeading |
| `src/utils/image.js` | URL vs Base64 → `<img src>` |

**Admin app**

| File | Responsibility |
| --- | --- |
| `src/App.jsx` | Protected routes + admin redirects |
| `src/components/Layout.jsx` | Sidebar/drawer/header shell |
| `src/components/Menus.jsx` | Navigation + logout |
| `src/pages/Home.jsx` | Dashboard metrics |
| `src/pages/AllCars.jsx` | Fleet list + responsive table/cards |
| `src/pages/AddCar.jsx` | Create form + image preview |
| `src/pages/auth/CarDetails.jsx` | View/edit/delete + live preview |
| `src/pages/AllBookings.jsx` | Booking list + status filter |
| `src/pages/auth/BookingDetails.jsx` | Booking detail + status update |
| `src/store/authSlice.js` | Admin login guard + user refresh |
| `src/store/carSlice.js` | Fleet CRUD thunks |
| `src/store/bookingSlice.js` | Booking list/detail/status thunks |

### 4.7 API reference

Base URL: `http://localhost:8080/api/v1`

| Method | Endpoint | Access | Purpose | Notes |
| --- | --- | --- | --- | --- |
| POST | `/user/register` | Public | Create account | 400 missing fields, 409 duplicate |
| POST | `/user/login` | Public | Get JWT + user | 404 unknown email, 500 wrong password (should be 401) |
| GET | `/user/get-user` | Signed in | Current user | Reads `req.user.id`, excludes password |
| PATCH | `/user/update/:id` | Signed in | Update profile | **No ownership check** |
| GET | `/car/get-all` | Public | List cars | Returns all Base64 images |
| GET | `/car/:id` | Public | Car details | Invalid id → CastError → 500 |
| POST | `/car/add-car` | Admin | Create car | `multipart/form-data`, field `image` required |
| PATCH | `/car/update-car/:id` | Admin | Update car | Image optional; keeps old if omitted |
| DELETE | `/car/delete-car/:id` | Admin | Delete car | No booking cleanup |
| POST | `/booking/create` | Signed in | Create booking | Trusts client price/user |
| GET | `/booking/get-all` | Public | List all bookings | Leaks booking data |
| GET | `/booking/get-details/:id` | Admin | Flattened booking details | Manual user + car lookups |
| PATCH | `/booking/update-status/:id` | Admin | Set status | `pending` / `confirm` / `cancel` |
| GET | `/booking/user-booking/:id` | Signed in | User’s bookings | **No ownership check** |
| PATCH | `/booking/update/:id` | Signed in | Change dates | ₹200 penalty, **no ownership check** |

Auth header accepted in two forms:

```http
Authorization: <raw-jwt>
Authorization: Bearer <raw-jwt>
```

The second is the conventional form; use it for any new client.

### 4.8 Database reference

**Collections:** `users`, `cars`, `bookings` (Mongoose pluralises model names).

**Useful queries**

```js
// In mongosh after: use virtuacarz

// All users without passwords
db.users.find({}, { password: 0 }).pretty()

// Promote an admin
db.users.updateOne(
  { email: "you@example.com" },
  { $set: { isAdmin: true } }
)

// Check the change
db.users.findOne(
  { email: "you@example.com" },
  { uname: 1, email: 1, isAdmin: 1 }
)

// Newest bookings with car + user ids
db.bookings.find().sort({ createdAt: -1 }).limit(10).pretty()

// Count by status
db.bookings.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// Revenue by status
db.bookings.aggregate([
  { $group: { _id: "$status", revenue: { $sum: "$totalPrice" } } }
])

// Delete test data
db.bookings.deleteMany({})
db.cars.deleteMany({})
db.users.deleteMany({ email: "test@example.com" })
```

**Indexes to add in production**

```js
db.users.createIndex({ email: 1 }, { unique: true })
db.bookings.createIndex({ user: 1, createdAt: -1 })
db.bookings.createIndex({ car: 1, startDate: 1, returnDate: 1 })
db.cars.createIndex({ status: 1, category: 1, price: 1 })
```

The booking index is the foundation for an availability/overlap query:

```js
const overlapping = await bookingModel.exists({
  car: carId,
  status: { $in: ["pending", "confirm"] },
  startDate: { $lte: returnDate },
  returnDate: { $gte: startDate },
});
```

### 4.9 State ownership

| Data | Where it lives | Why |
| --- | --- | --- |
| JWT + user | Redux `auth` + localStorage `appData` | Survives refresh; needed by header/profile |
| Fleet list | Redux `cars.cars` | Shared by home, fleet, admin |
| Selected car | Redux `cars.carDetail` | Details page |
| User bookings | Redux `auth.bookings` | Profile list + edit modals |
| Admin bookings | Redux `bookings.bookings` | List + filter |
| Booking detail | Redux `bookings.bookingDetail` | Admin detail page |
| Form fields | Local `useState` | Ephemeral |
| Modal open/close | Local `useState` | Ephemeral |
| Search/filter/sort | Local `useState` | Page-specific |
| Toast state | Toast library | Ephemeral |

### 4.10 Design decisions worth explaining

1. **Three apps, one API.** Customer and admin have different users, routes, and risk profiles. Splitting them keeps the customer bundle free of admin code and allows separate deployment.
2. **Redux Toolkit over Context.** Auth state is read by the header, profile, booking modals, and route guards. Redux avoids prop drilling and gives async lifecycle states for free.
3. **Thunks over component-level Axios.** API logic lives in slices; components stay focused on UI. Error messages are normalised with `rejectWithValue`.
4. **JWT over sessions.** No server-side session store; the API is stateless and easy to host. The trade-off is revocation and localStorage risk.
5. **Base64 over file storage.** Zero external dependencies for a demo. The trade-off is document size and payload weight.
6. **Tailwind 4 over a component library.** Full control of the editorial design and no bundle-heavy UI kit. The trade-off is more markup per component.
7. **Framer Motion.** Page transitions and modal motion make the app feel considered; `useReducedMotion` keeps it accessible.
8. **Manual joins in booking details.** The admin needs a flat, display-ready object; doing it in the controller keeps the frontend simple. `populate` is used where the shape is naturally nested.
9. **Client-side price calculation.** Fast feedback for the user, but the server should be authoritative. This is the most important architectural correction to make.
10. **Environment-based API URL.** Same code runs against localhost, staging, or production by changing `VITE_BASEURL`.

### 4.11 Known issues and fixes

> [!warning] Be honest in interviews
> Do not claim these are solved. Naming them and describing the fix is stronger than pretending the app is production-perfect.

| # | Severity | Issue | Where | Fix |
| --- | --- | --- | --- | --- |
| 1 | **Critical** | Any signed-in user can update any user and set `isAdmin: true` | `userController.updateUser` | Verify `req.user.id === id`; whitelist fields; never accept `isAdmin` |
| 2 | **Critical** | Booking price and user id are trusted from the client | `bookingController.createBooking` | Derive user from token; load car; recompute total server-side |
| 3 | **High** | Any signed-in user can read another user’s bookings | `getUserBooking` | Check `req.user.id === id` or admin |
| 4 | **High** | Any signed-in user can edit any booking’s dates | `updateBooking` | Load booking, verify ownership/admin, then update |
| 5 | **High** | All bookings are public | `GET /booking/get-all` | Add `userAuth` + `isAdmin` |
| 6 | **High** | JWT in localStorage (XSS can steal it) | Both frontends | httpOnly, Secure, SameSite cookies + refresh token |
| 7 | **High** | No booking overlap check | `createBooking` | Availability query + index; optionally a transaction |
| 8 | **Medium** | Base64 images bloat Mongo and list responses | `carController`, `carModel` | S3/Cloudinary + URL; paginate the fleet |
| 9 | **Medium** | No upload size/type limits | `multer.js` | `limits.fileSize`, `fileFilter`, error handler |
| 10 | **Medium** | CORS allows every origin | `server.js` | Allowlist deployed origins |
| 11 | **Medium** | No rate limiting / helmet / sanitisation | `server.js` | `express-rate-limit`, `helmet`, `express-mongo-sanitize` |
| 12 | **Medium** | Client-side admin guard can be bypassed | `admin-panel/App.jsx` | Keep server authorization; don’t expose admin data publicly |
| 13 | **Low** | `returnOrignal` typo returns the old document | `updateBookingStatus` | `{ returnDocument: "after" }` |
| 14 | **Low** | Status vocab is inconsistent (`confirm` vs `confirmed`) | server enum + UI maps | Standardise on one set; migrate data |
| 15 | **Low** | Pricing off-by-one on the home page | `Home.jsx` | Shared `calculateRentalDays` + server recompute |
| 16 | **Low** | Two toast libraries; unused ToastContainer | client `main.jsx` | Keep `react-hot-toast`; remove react-toastify |
| 17 | **Low** | Two router packages | client/admin | Standardise on `react-router` v7+ |
| 18 | **Low** | `user.password = undefined` can crash if user is null | `updateUser` | Return 404 before dereferencing |
| 19 | **Low** | 402/500 used for auth/validation errors | controllers | 401/403/400/409 |
| 20 | **Low** | No 404 route in customer app | client `App.jsx` | Add a catch-all NotFound page |
| 21 | **Low** | Home falls back to demo JSON when DB has ≤ 2 cars | `Home.jsx` | Remove fallback or gate it to development |
| 22 | **Low** | No pagination/search endpoint | car/booking controllers | `?page=&limit=&q=` + indexes |
| 23 | **Low** | No tests or CI | repo | Vitest/RTL + Supertest + GitHub Actions |
| 24 | **Low** | Forgot password / SSO are UI placeholders | auth pages | Implement real flows or remove the buttons |

### 4.12 Security review checklist

Use this as a talking point — it shows you can audit your own work.

- [ ] Passwords hashed with bcrypt (yes).
- [ ] Password hash never returned (mostly yes; check null-user path).
- [ ] JWT secret is long, random, and not committed (yes, via `.env`).
- [ ] Token expiry set (7 days).
- [ ] Admin authorization on the server, not just the UI (yes for car and booking-detail routes).
- [ ] Object-level authorization (IDOR) on user/booking routes (**no**).
- [ ] Server-authoritative pricing (**no**).
- [ ] Input validation library / schema validation (**no**).
- [ ] Rate limiting on login/register (**no**).
- [ ] CORS allowlist (**no** — open).
- [ ] Security headers via helmet (**no**).
- [ ] Upload size/type limits (**no**).
- [ ] XSS-safe rendering — React escapes by default (yes); avoid `dangerouslySetInnerHTML`.
- [ ] Secrets in frontend bundle — none (only `VITE_BASEURL`).
- [ ] Error messages leak internals (controllers return `error.message` / full error objects — avoid in production).
- [ ] Logging of sensitive data (morgan logs URLs, not bodies; fine, but review).

---

## Part V — Interview playbook

### 5.1 The 30-second pitch

> “VirtuaCarz is a full-stack self-drive car rental platform built as three apps: a customer React app, an admin React app, and a shared Node/Express REST API backed by MongoDB. Customers can browse the fleet, register or log in with JWT auth, book a car for a date range, and manage their bookings and profile. Admins can add, edit, and delete cars with image uploads, review every reservation, and update booking status. The frontends use Redux Toolkit for async state, Axios for API calls, and Tailwind CSS 4 with Framer Motion for a responsive editorial interface. I built it to practise end-to-end ownership: schema design, auth and authorization, file uploads, error states, and a design system shared across two apps.”

### 5.2 The 2-minute walkthrough

Use this order — it mirrors the architecture:

1. **Problem** — renting a self-drive car involves a customer journey and an operations journey. One UI cannot serve both cleanly.
2. **Shape** — three apps: `client`, `admin-panel`, `server`. Two SPAs, one API, one database.
3. **Data** — three collections: `users`, `cars`, `bookings`. Booking holds ObjectId refs to user and car, plus date range, daily price snapshot, total, and status (`pending`/`confirm`/`cancel`).
4. **Auth** — register hashes with bcrypt; login compares and signs a 7-day JWT containing the user id; `userAuth` verifies it; `isAdmin` loads the user and checks the role. The admin app also guards routes for UX.
5. **Customer flow** — fleet list → details → dates → price = inclusive days × daily rate → POST booking → profile shows bookings via a populated query.
6. **Admin flow** — dashboard aggregates fleet/booking/GMV; fleet CRUD uses `FormData` + Multer; booking details manually join user + car; status update patches the booking.
7. **Frontend state** — Redux Toolkit slices with `createAsyncThunk`; pending/fulfilled/rejected drive loading, error, and toast states; local state handles forms and modals.
8. **Design** — Tailwind 4 `@theme` tokens, Figtree, cream/ink/orange, hairline rules, editorial headings, responsive card/table switch, reduced-motion support.
9. **Trade-offs** — JWT in localStorage, Base64 images, no overlap check, no tests/CI. Then describe the fixes you would make first.

### 5.3 Whiteboard sketch

Draw this in under a minute:

```text
[Customer React]  [Admin React]
        \            /
         \  HTTPS   /
          [Express API]
           |    |    |
        [Auth] [Cars] [Bookings]
              \    |    /
              [(MongoDB)]
```

Then add the request path:

```text
Component → Axios → route → middleware → controller → Mongoose → Mongo
```

If asked to go deeper, add the auth sequence from [[#4.2 Authentication sequence]] and the booking sequence from [[#4.3 Booking sequence]].

### 5.4 STAR stories

Use these as templates; fill in your own details and keep each under 90 seconds.

**Story 1 — Auth end to end**

- **Situation:** The app needed both customer and admin access with different permissions.
- **Task:** Implement register/login, password security, a stateless session, and role checks.
- **Action:** Hashed passwords with bcrypt (salt 10), signed JWTs with a 7-day expiry, wrote `userAuth` to accept raw/Bearer tokens, added `isAdmin` middleware, stored the session in Redux + localStorage, and guarded admin routes in React.
- **Result:** One login API serves both apps; admin endpoints reject non-admins server-side; refresh keeps the session.
- **Reflection:** I would move the token to httpOnly cookies and add refresh/revocation for production.

**Story 2 — Image upload and Base64**

- **Situation:** Admins needed to publish cars with photos, but the project had no file storage.
- **Task:** Accept an image from the browser and persist it with the car.
- **Action:** Used `FormData` on the client, Multer `memoryStorage()` on the server, converted `req.file.buffer` to Base64, stored it in the car document, and rebuilt a data URL in the UI with a shared `getImageSrc` helper.
- **Result:** A single API and database can create a complete listing with no external service.
- **Reflection:** Base64 is fine for a demo but bad at scale; I would move to S3/Cloudinary with size/type limits and store only URLs.

**Story 3 — Booking date changes with a penalty**

- **Situation:** Customers needed to reschedule, but unrestricted changes could be abused.
- **Task:** Allow date changes while applying a clear business rule.
- **Action:** Validated both dates and the order, loaded the existing booking, added a flat ₹200 penalty, recalculated the total, updated with `returnDocument: "after"`, replaced the booking in Redux, and showed the penalty in the edit modal.
- **Result:** Dates update immediately in the profile without a refetch; the rule is visible before saving.
- **Reflection:** The rule should live in a service and be covered by tests; the penalty should be configurable, not hard-coded.

**Story 4 — Admin redesign as a design system**

- **Situation:** The admin panel looked like a generic dashboard and diverged from the customer app.
- **Task:** Create a cohesive, responsive interface without adding a component library.
- **Action:** Defined tokens in Tailwind 4 (`cream`, `ink`, `accent`, `line`), built reusable `Button`, `Eyebrow`, `PageHeader`, and `Reveal` components, used asymmetric grids and hairline rules, made tables switch to cards on mobile, and respected `prefers-reduced-motion`.
- **Result:** Both apps share a recognisable editorial language; the admin feels like the same product.
- **Reflection:** A design token file plus a small primitive set scales better than page-by-page styling.

**Story 5 — Debugging a subtle state bug**

- **Situation:** After an admin changed a booking status, the list sometimes showed the old value.
- **Task:** Find out whether the API, the slice, or the UI was stale.
- **Action:** Inspected the network response, found `findByIdAndUpdate` returned the pre-update document because the option was misspelled (`returnOrignal`), then made the slice use the submitted status and noted the server fix (`returnDocument: "after"`).
- **Result:** The UI is correct now; the underlying API behaviour is documented.
- **Reflection:** Understand the default behaviour of ORM methods; don’t assume an update returns the new document.

### 5.5 Q&A bank

**Project and architecture**

**Q: Why did you build three separate apps?**
A: The customer and admin experiences have different users, navigation, bundles, and risk profiles. Splitting them keeps the customer app lean and lets each deploy independently. The shared API keeps the data model consistent.

**Q: Walk me through the architecture.**
A: Two React SPAs call an Express REST API under `/api/v1` via Axios. Express runs CORS/JSON/logging, then route middleware (`userAuth`, `isAdmin`, Multer), then controllers. Controllers use Mongoose models to read/write MongoDB. Auth is a 7-day JWT; passwords are bcrypt hashes.

**Q: What is the most important request flow?**
A: Booking creation. The client validates dates, computes inclusive days × daily price, and posts user/car/dates/price/total. The server authenticates, saves the booking, and returns it. In production I would move the price calculation and availability check entirely server-side.

**Q: How would you scale this?**
A: Paginate list endpoints, move images to object storage + CDN, add indexes for booking overlap, cache car lists, split the API into services if needed, add rate limiting, and run multiple stateless API instances behind a load balancer. MongoDB replica set for availability; Redis for sessions/cache if I move off JWT.

**React and frontend**

**Q: Why Redux Toolkit instead of Context?**
A: Auth, fleet, and bookings are shared across pages and modals. RTK gives a single store, async thunk lifecycle states, and devtools. Context is fine for a theme or a small auth object, but it would scatter async state and cause more re-renders here.

**Q: What is `createAsyncThunk` doing?**
A: It wraps an async API call and dispatches `pending`, `fulfilled`, or `rejected`. The slice’s `extraReducers` update loading/error/data accordingly. `rejectWithValue` lets the component show the server’s message.

**Q: Why `unwrap()`?**
A: `dispatch(thunk())` resolves even when the thunk rejects. `unwrap()` throws the rejected value so `try/catch` in the component can show a toast and avoid a false success path.

**Q: How do you handle loading and errors?**
A: Each slice has `loading`, `error`, and sometimes `success`. Pages render loading, error, empty, and success states. Toasts handle action feedback; inline alerts handle page-level failures.

**Q: How does the header know the user is logged in?**
A: `state.auth.token`/`user` come from Redux, hydrated from localStorage on load. Login updates both; logout clears both. The header switches between auth links and the account menu.

**Q: How do you handle protected UI?**
A: The customer app doesn’t have a hard guard; actions check for a user and redirect/toast. The admin app uses a `ProtectedRoute` that checks token + `user.isAdmin`. The server remains the source of truth.

**Q: What hooks did you use?**
A: `useState` for forms/modals, `useEffect` for fetching/syncing, `useSelector`/`useDispatch` for Redux, `useNavigate`/`useParams`/`useLocation` for routing, `useReducedMotion` for accessibility, and custom hooks weren’t necessary at this size.

**Q: Why Framer Motion?**
A: Page transitions, modal enter/exit, and scroll reveals. `AnimatePresence` handles unmount animations. `useReducedMotion` disables movement for users who request it.

**Backend and API**

**Q: Why Express?**
A: Minimal, well-known, and enough for a REST API. Middleware composition maps naturally to auth, uploads, and logging. Nest/Fastify would be reasonable for a larger team.

**Q: What does middleware do here?**
A: `cors` adds cross-origin headers, `express.json` parses JSON, `morgan` logs, `userAuth` verifies the JWT, `isAdmin` checks the role, and `multer` parses multipart files. Each calls `next()` or ends the response.

**Q: How do you return consistent responses?**
A: Controllers return `{ success, message, ...data }` and appropriate status codes. It is consistent but hand-rolled; a response helper or an error-handling middleware would remove repetition.

**Q: What status codes do you use?**
A: 200 OK, 201 Created, 400 bad input, 401/402 auth (402 is non-standard here), 403 forbidden (not used yet), 404 missing, 409 duplicate, 500 server error. I would normalise 401/403 and stop returning raw error objects.

**Q: How would you add pagination?**
A: Accept `page`/`limit`, validate and cap `limit`, use `.skip((page-1)*limit).limit(limit)`, return `total`, `page`, `pages`, and add a compound index that matches the sort/filter.

**Q: How would you add search?**
A: Add a `q` param, build a case-insensitive regex or a text index, filter by name/model/about, combine with category/price filters, and paginate. For large datasets, MongoDB Atlas Search is better than regex.

**MongoDB and data**

**Q: Why MongoDB?**
A: The data is document-shaped and the relationships are simple: a booking references a user and a car. The schema can evolve quickly, and Mongoose gives validation and defaults. A relational database would also fit — bookings have clear foreign keys — so the choice is mostly stack familiarity and flexibility.

**Q: SQL vs NoSQL for this?**
A: SQL would give strong constraints, joins, and transactions, which suit bookings and payments. MongoDB wins on flexible car attributes and fast iteration. For a production rental system with payments and availability, I would seriously consider Postgres; with MongoDB I would add schema validation and transactions.

**Q: References vs embedding?**
A: Reference user and car because they are independent entities reused across bookings. Embed only data that is owned by the parent and never queried alone. The booking stores `price` as a snapshot so a later car price change doesn’t rewrite history.

**Q: What is `populate()`?**
A: It replaces an ObjectId field with the referenced document(s), optionally selecting fields. `getUserBooking` uses `.populate("car", "name image price")`. It is a second query under the hood, not a SQL join.

**Q: What indexes would you add?**
A: Unique email, `bookings { user, createdAt }`, `bookings { car, startDate, returnDate }` for overlap checks, and `cars { status, category, price }` for filters. I would confirm with `explain()` rather than guessing.

**Q: How do you prevent double bookings?**
A: Currently I don’t — that’s a known gap. I would query for an overlapping booking with status `pending`/`confirm`, add a compound index, and use a transaction or a unique constraint on a derived slot if the model allowed it. Then return 409 Conflict.

**Q: What is the document size limit?**
A: 16MB. Base64 images inflate by ~33%, so large photos can hit the limit. That is one reason to move images out of Mongo.

**Auth and security**

**Q: How does JWT auth work?**
A: Login verifies the password and signs `{ id }` with a secret and 7-day expiry. The client stores the token and sends it in `Authorization`. `userAuth` verifies the signature and expiry, then sets `req.user`. Admin routes additionally load the user and check `isAdmin`.

**Q: Where do you store the token? Why?**
A: In localStorage under `appData`. It survives refresh and is easy to attach with Axios. The downside is XSS: any script can read it. httpOnly cookies with CSRF protection are safer.

**Q: How do you handle logout?**
A: The client clears Redux and localStorage. The JWT remains valid until expiry because there is no server-side revocation list. For real logout, use short-lived access tokens + refresh tokens with rotation/revocation.

**Q: What are the biggest security gaps?**
A: IDOR on user/booking routes, trusting client-supplied prices/user ids, public all-bookings, JWT in localStorage, open CORS, no rate limiting, and no upload limits. I can describe the fix for each.

**Q: How would you secure the API?**
A: Object-level authorization, server-side pricing, Zod/Joi validation, helmet, CORS allowlist, rate limiting, httpOnly cookies, short token lifetimes, audit logs, and tests for authorization rules.

**Styling and UX**

**Q: Why Tailwind?**
A: Fast iteration, consistent spacing/colour tokens, and no dead CSS. Tailwind 4’s CSS-first `@theme` keeps the design system in one file. The trade-off is long className strings; a `cn()` helper or component primitives help.

**Q: How did you make it responsive?**
A: Mobile-first utilities, grids that collapse to one column, tables that switch to cards below `lg`, a drawer nav, and `max-w-7xl` containers. I checked 375px, 768px, and 1440px.

**Q: How is accessibility handled?**
A: Semantic headings, labels tied to inputs, `aria-label` on icon buttons, `aria-modal`/`role="dialog"` on modals, Escape to close, focus styles, and reduced-motion support. Missing: full focus trapping and a skip link.

**Testing and deployment**

**Q: How is it tested?**
A: Currently manually: API calls with curl, then the main user/admin flows in the browser. There are no automated tests. I would add Vitest + React Testing Library for components/slices, Supertest for API routes, and a MongoDB memory server or a test database.

**Q: How would you deploy?**
A: Atlas for MongoDB; Render/Railway for the API with env vars; Vercel/Netlify for both Vite apps with `VITE_BASEURL` set at build time and SPA rewrites. Restrict CORS to the deployed origins. For images, S3/Cloudinary.

**Q: What would you monitor?**
A: API latency/error rate, Mongo connection pool and slow queries, auth failures, upload failures, frontend Sentry errors, and Core Web Vitals. Add structured logs with request ids.

**Behavioral**

**Q: Biggest challenge?**
A: Connecting three apps while keeping the contract consistent — especially uploads (`FormData` + Multer) and auth headers (raw vs Bearer). I solved it by testing the API first and centralising Axios/token logic.

**Q: A mistake you made?**
A: Trusting the client for booking totals and not checking ownership on user routes. I found them during a self-review and now treat the server as the authority. I can show exactly where the fixes go.

**Q: What did you learn?**
A: How to design a REST contract, structure Redux async state, handle multipart uploads, think about object-level authorization, and build a reusable design system across two apps. I also learned to separate “demo works” from “production ready.”

**Q: Why did you build this?**
A: To practise a complete product slice — UI, API, database, auth, uploads, admin operations — rather than another todo app. Car rental has real state transitions and two distinct user roles, which makes the design decisions meaningful.

### 5.6 “What would you improve?” — prioritised answer

Say this in order; it shows judgement:

1. **Security first** — fix IDOR/ownership checks, stop trusting client prices/user ids, make booking lists admin-only, move JWTs to httpOnly cookies.
2. **Correctness** — booking overlap/availability check, server-side price and status validation, consistent status enum, fix `returnOrignal`, standardise the rental-day calculation.
3. **Scale** — object storage for images, pagination/search, indexes, response shaping (don’t send Base64 in lists).
4. **Quality** — TypeScript or Zod, error-handling middleware, tests, CI, linting on both apps.
5. **Product** — payments, email verification, password reset, cancellation rules, real SSO, availability calendar, notifications.
6. **Ops** — Docker, staging environment, structured logs, monitoring, backups.

### 5.7 Debugging stories you can tell

- **“The status didn’t update.”** Network response showed the old document; `findByIdAndUpdate` returns the pre-update doc by default, and the option was misspelled. I made the slice trust the submitted status and documented the server fix.
- **“Images worked locally but not after upload.”** The DB stored raw Base64, but `<img>` needs a data URL. I added `getImageSrc` to detect `http`, `data:`, and raw Base64.
- **“The API worked from curl but not the browser.”** CORS. The browser preflights cross-origin requests; the server needed the right `Access-Control-Allow-*` headers. `cors()` solved it locally; production needs an allowlist.
- **“The page was blank after deployment.”** A direct visit to `/cars/123` returned 404 because the host looked for a file. Added the SPA rewrite to `index.html`.
- **“Vite ignored my env change.”** Vite bakes `VITE_*` at build/dev start; restart the dev server or rebuild.

### 5.8 Demo script

**Before the demo**

- [ ] MongoDB running / Atlas reachable.
- [ ] Server on 8080; `GET /` returns the welcome HTML.
- [ ] Customer app on 5173; admin on 5174.
- [ ] One admin account promoted.
- [ ] At least 3 cars with images.
- [ ] At least 2 bookings in different statuses.
- [ ] Browser zoom 100%, clean profile, notifications off.
- [ ] Tabs pre-opened: customer, admin, Mongo Compass (users/cars/bookings), API health.
- [ ] Fallback: screenshots or a recorded walkthrough if the network fails.

**Click path (5–7 minutes)**

1. **Customer home** — point out the editorial hero, live fleet, and trust content. Search/scroll to fleet.
2. **Register** a new user → **login** → header shows the account.
3. **Open a car** → choose dates → show the live total → confirm.
4. **Profile** → show the booking, open details, edit dates → show the ₹200 penalty → save.
5. **Admin login** → dashboard (fleet/bookings/GMV).
6. **All cars** → add a car with an image preview → save → show it in the customer fleet.
7. **All bookings** → filter by status → open details → change status → show it reflected in the customer profile.
8. **Compass** — show the actual documents and the Base64 image field.
9. Close with the architecture diagram and one improvement.

### 5.9 Resume bullets

Pick 3–5; adjust numbers to what you can defend.

- Built a **three-app MERN car-rental platform** (customer React app, admin React app, Express API) with **15 REST endpoints** and **3 Mongoose models**.
- Implemented **JWT authentication** with bcrypt password hashing, role-based admin middleware, protected React routes, and persisted sessions.
- Designed a **responsive editorial UI** with React 19, Tailwind CSS 4, and Framer Motion, including reusable primitives, loading/error/empty states, and reduced-motion support.
- Built **fleet CRUD with image upload** using Multer memory storage and Base64 persistence, plus live previews and validation.
- Implemented **booking lifecycle** flows: creation with date validation, customer booking history, admin status transitions, and date changes with a configurable penalty.
- Centralised API access with **Axios interceptors and Redux Toolkit async thunks**, reducing duplicated auth/error logic across both apps.
- Identified and documented **authorization and pricing vulnerabilities** (IDOR, client-trusted totals) and designed server-authoritative fixes.

### 5.10 Questions to ask the interviewer

- What does the team’s deployment and on-call look like?
- How do you review code and handle design review?
- What is the balance between shipping features and paying down technical debt?
- Which parts of the stack are you standardising on, and why?
- How do you measure success for this role in the first 90 days?
- What is the most interesting technical problem the team is working on?
- How do you support engineers learning unfamiliar parts of the stack?

### 5.11 Things not to claim

Be precise. Interviewers probe.

- Don’t say “production-ready” — it isn’t (no tests, open CORS, IDOR, Base64 images).
- Don’t say “real payments” or “real-time availability” — they don’t exist.
- Don’t say “SSO works” — it’s a preview toast.
- Don’t say “fully tested” — testing is manual.
- Don’t say “secure JWT storage” — localStorage is a known trade-off.
- Don’t say “scalable image pipeline” — it is a demo pipeline.
- Don’t say “I used TypeScript” — the repo is JavaScript.

### 5.12 Live-coding extensions (practise these)

1. **Add `GET /car/search?q=&minPrice=&maxPrice=`** with validation, regex/text search, and pagination.
2. **Add booking overlap prevention** to `createBooking` and return 409 on conflict.
3. **Add ownership checks** to `updateUser`, `getUserBooking`, and `updateBooking`.
4. **Move price calculation server-side** — load the car, compute inclusive days, ignore client totals.
5. **Add an error-handling middleware** and standardise `{ success, message, errors }`.
6. **Add a `NotFound` route** to the customer app.
7. **Add a `useCarFilters` hook** that keeps filter state in the URL search params.
8. **Add tests** for `calculateRentalDays`, the auth slice, and the booking controller.

---

## Part VI — Reference & other notes

> [!abstract] What this part is for
> Look things up here. It collects the commands, environment variables, status codes, design tokens, revision facts, learning links, a rebuild plan, and the full file inventory. The tutorial is in [[#Part III — Build from scratch]]; the architecture is in [[#Part IV — How the code works]].

### 6.1 Command cheat sheet

All commands assume the repo root unless the **Where** column says otherwise.

#### Install, run, build

| Where | Command | What it does |
| --- | --- | --- |
| root | `git clone <repo> && cd VirtuaCarz` | Get the code |
| `server/` | `npm install` | Install API dependencies |
| `client/` | `npm install` | Install customer-app dependencies |
| `admin-panel/` | `npm install` | Install admin dependencies |
| `server/` | `npm start` | Start Express with `node server.js` (no watch mode) |
| `server/` | `node --watch server.js` | Start with auto-restart on file changes |
| `client/` | `npm run dev` | Customer app → `http://localhost:5173` |
| `admin-panel/` | `npm run dev` | Admin app → `http://localhost:5174` |
| `client/` | `npm run build` | Production build → `client/dist/` |
| `admin-panel/` | `npm run build` | Production build → `admin-panel/dist/` |
| `client/` | `npm run preview` | Serve the built customer app locally |
| `admin-panel/` | `npm run preview` | Serve the built admin app locally |
| either app | `npm run lint` | ESLint over the frontend |
| `server/` | `npm test` | Placeholder — exits with an error; there are no tests |

> [!tip] Run the API first
> The frontends can start without the API, but every data view will show an error state. Start Mongo → server → client/admin.

#### Health checks and debugging

```bash
# Is the API alive?
curl http://localhost:8080/

# Is anything listening on the three ports?
lsof -i :8080
lsof -i :5173
lsof -i :5174

# Kill a stuck dev server (macOS/Linux)
kill $(lsof -t -i:5173)

# Show the Node version used by each app
node -v && npm -v

# Check installed vs declared versions
npm ls --depth=0

# See outdated packages without changing anything
npm outdated
```

#### API calls with curl

```bash
API=http://localhost:8080/api/v1

# Register
curl -X POST $API/user/register \
  -H "Content-Type: application/json" \
  -d '{"uname":"Asha","email":"asha@example.com","password":"secret123","phone":"9876543210"}'

# Login and keep the token in a shell variable
TOKEN=$(curl -s -X POST $API/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"asha@example.com","password":"secret123"}' \
  | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

echo "$TOKEN"

# Current user
curl $API/user/get-user -H "Authorization: Bearer $TOKEN"

# Public fleet
curl $API/car/get-all

# One car
curl $API/car/<carId>

# Create a booking (server currently trusts these values)
curl -X POST $API/booking/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"user":"<userId>","car":"<carId>","startDate":"2026-11-10","returnDate":"2026-11-13","price":2500,"totalPrice":7500}'

# My bookings
curl $API/booking/user-booking/<userId> -H "Authorization: Bearer $TOKEN"

# Admin: add a car (multipart, image field must be named "image")
curl -X POST $API/car/add-car \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "name=Honda City" -F "model=ZX" -F "year=2024" \
  -F "category=sedan" -F "fuel=petrol" -F "seats=5" \
  -F "milage=18" -F "price=2500" -F "about=Comfortable city sedan" \
  -F "transmission=false" -F "status=true" \
  -F "image=@/path/to/car.jpg"

# Admin: list every booking
curl $API/booking/get-all

# Admin: change status
curl -X PATCH $API/booking/update-status/<bookingId> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"status":"confirm"}'
```

> [!warning] Curl and PowerShell
> The `\` line continuation works in bash/zsh. In PowerShell use backticks, or put each request on one line. Quote JSON with double quotes on Windows and escape inner quotes.

#### MongoDB

```bash
# Local shell
mongosh "mongodb://127.0.0.1:27017/virtuacarz"

# Atlas
mongosh "mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/virtuacarz"

# Inside mongosh
show dbs
use virtuacarz
show collections
db.users.countDocuments()
db.cars.find().pretty()
db.bookings.find().sort({ createdAt: -1 }).limit(5).pretty()
```

Docker alternative if MongoDB is not installed:

```bash
docker run --name virtuacarz-mongo -p 27017:27017 -d mongo:7
```

#### Git and cleanup

```bash
git status
git diff
git log --oneline --graph --decorate -10
git switch -c feature/booking-overlap
git add <files> && git commit -m "feat: prevent overlapping bookings"
git restore <file>              # discard unstaged changes
git clean -nd                    # preview untracked files
```

> [!danger] Never commit secrets
> `server/.env` contains `MONGO_URI` and `JWT_SECRET`. Confirm `.gitignore` covers `.env`, `node_modules`, and `dist` before pushing.

---

### 6.2 Environment variable reference

| Variable | Where | Required | Example | Notes |
| --- | --- | --- | --- | --- |
| `PORT` | `server/.env` | No (defaults to 8080) | `8080` | Must match the port in both `VITE_BASEURL`s |
| `MONGO_URI` | `server/.env` | **Yes** | `mongodb://127.0.0.1:27017/virtuacarz` | `server/config/env.js` exits if missing |
| `JWT_SECRET` | `server/.env` | **Yes** | long random hex | Changing it invalidates every existing token |
| `DEV_MODE` | `server/.env` | No | `development` | Only used in the startup log |
| `VITE_BASEURL` | `client/.env.local` | Yes for the customer app | `http://localhost:8080/api/v1` | Baked in at build time |
| `VITE_BASEURL` | `admin-panel/.env.local` | Yes for the admin app | `http://localhost:8080/api/v1` | Same value; separate file |

**How the server loads env:** `server/config/env.js` resolves the repo path and calls `dotenv.config({ path: server/.env })`, so it works even if you launch Node from the repo root. It checks `MONGO_URI` and `JWT_SECRET` and exits with a helpful message when either is missing.

**How Vite loads env:** only variables prefixed with `VITE_` are exposed to browser code. Values are embedded when the dev server starts or the build runs — editing `.env.local` while the app is running does not update the bundle until a restart/rebuild.

**Production shape**

```dotenv
# API host (Render/Railway/Fly)
PORT=8080
MONGO_URI=mongodb+srv://...
JWT_SECRET=<generated in the host's secret manager>
DEV_MODE=production
```

```dotenv
# Static host build settings (Vercel/Netlify)
VITE_BASEURL=https://your-api.example.com/api/v1
```

> [!caution] `VITE_*` is public
> Never put a database password, JWT secret, or private API key in a Vite variable. Anything prefixed `VITE_` ships to the browser.

---

### 6.3 Ports, URLs, and accounts

| Service | URL | Started with |
| --- | --- | --- |
| API | `http://localhost:8080` | `cd server && npm start` |
| API base | `http://localhost:8080/api/v1` | — |
| Customer app | `http://localhost:5173` (Vite prints the actual URL) | `cd client && npm run dev` |
| Admin app | `http://localhost:5174` if the client already has 5173; otherwise Vite picks the next free port | `cd admin-panel && npm run dev` |
| MongoDB | `mongodb://127.0.0.1:27017/virtuacarz` | `mongod`, Docker, or Atlas |

**Demo accounts**

There are no seeded accounts. Create one through the UI, then promote it:

```js
// mongosh
use virtuacarz
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

Log out and back in so the frontend receives a user object with `isAdmin: true`. If the admin app still rejects the login, clear `localStorage.appData` and sign in again.

---

### 6.4 MongoDB recipes

#### Connect and inspect

```js
use virtuacarz

// Shape of each collection
db.users.findOne()
db.cars.findOne()
db.bookings.findOne()

// Users, without password hashes
db.users.find({}, { uname: 1, email: 1, isAdmin: 1 }).pretty()

// Newest bookings
db.bookings.find().sort({ createdAt: -1 }).limit(10).pretty()

// Bookings for one user (paste an id)
db.bookings.find({ user: ObjectId("PASTE_ID") }).pretty()

// Cars currently marked available
db.cars.find({ status: true }, { name: 1, price: 1, category: 1 }).pretty()
```

#### Promote and demote an admin

```js
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)

db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: false } }
)
```

#### Dashboard-style aggregates

```js
// Count by booking status
db.bookings.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// Gross booking value by status
db.bookings.aggregate([
  { $group: { _id: "$status", revenue: { $sum: "$totalPrice" } } }
])

// Fleet count by category
db.cars.aggregate([
  { $group: { _id: "$category", cars: { $sum: 1 }, avgPrice: { $avg: "$price" } } }
])

// Bookings per car (top 5)
db.bookings.aggregate([
  { $group: { _id: "$car", bookings: { $sum: 1 } } },
  { $sort: { bookings: -1 } },
  { $limit: 5 }
])
```

These are the queries the admin dashboard should eventually use instead of counting in the browser.

#### Fix data

```js
// Normalise an old status value
db.bookings.updateMany({ status: "confirmed" }, { $set: { status: "confirm" } })

// Trim whitespace from emails
db.users.find().forEach((u) => {
  db.users.updateOne(
    { _id: u._id },
    { $set: { email: u.email.trim().toLowerCase() } }
  )
})

// Delete one user's test bookings
db.bookings.deleteMany({ user: ObjectId("PASTE_ID") })

// Reset everything (development only)
db.bookings.deleteMany({})
db.cars.deleteMany({})
db.users.deleteMany({})
```

> [!danger] Destructive commands
> `deleteMany({})` and `dropDatabase()` cannot be undone. Run `countDocuments()` first, and never point a local shell at production.

#### Indexes

Mongoose creates a unique index for `email` because of `unique: true`, but the app does not define the query indexes it needs:

```js
db.users.createIndex({ email: 1 }, { unique: true })
db.bookings.createIndex({ user: 1, createdAt: -1 })
db.bookings.createIndex({ car: 1, startDate: 1, returnDate: 1 })
db.bookings.createIndex({ status: 1, createdAt: -1 })
db.cars.createIndex({ status: 1, category: 1, price: 1 })

// Confirm usage instead of guessing
db.bookings.find({ car: ObjectId("PASTE_ID") }).explain("executionStats")
```

The compound booking index is what makes an overlap query practical:

```js
db.bookings.find({
  car: ObjectId("PASTE_ID"),
  status: { $in: ["pending", "confirm"] },
  startDate: { $lte: ISODate("2026-11-13") },
  returnDate: { $gte: ISODate("2026-11-10") }
})
```

If this returns documents, the car is already booked in that window. The API should return **409 Conflict**.

#### Backup and restore

```bash
# Whole database to a folder
mongodump --uri="mongodb://127.0.0.1:27017/virtuacarz" --out=./backup

# Restore
mongorestore --uri="mongodb://127.0.0.1:27017/virtuacarz" ./backup/virtuacarz

# Single collection
mongodump --uri="mongodb://127.0.0.1:27017/virtuacarz" --collection=bookings --out=./backup
```

Atlas has its own snapshot/export tools; use those in production rather than running `mongodump` against a live cluster.

---

### 6.5 HTTP status codes

The API uses a mix of correct and improvised codes. Learn both columns — the right code and what this repo actually returns.

| Code | Meaning | Used here | Correctness |
| --- | --- | --- | --- |
| 200 | OK | Most reads, updates, login | ✅ |
| 201 | Created | Register, create booking, add car | ✅ |
| 400 | Bad Request | Register with missing fields; some car validation | ✅ |
| 401 | Unauthorized | — | Should be used for missing/invalid tokens |
| 402 | Payment Required | `userAuth` for missing/invalid token | ❌ non-standard |
| 403 | Forbidden | — | Should be used when a non-admin calls an admin route |
| 404 | Not Found | Unknown email, missing car/booking | ✅ |
| 409 | Conflict | Duplicate email | ✅ |
| 500 | Server Error | Wrong password, missing login fields, most catch blocks | ❌ wrong for client errors |

**What the client sees**

| Situation | Current response | Should be |
| --- | --- | --- |
| No `Authorization` header | `402 { success:false, message:"Token not found" }` | `401` |
| Malformed/expired token | `402 { success:false, message:"Error in User Auth", error }` | `401` |
| Signed in but not admin | `402 { success:false, message:"Unauthorized user" }` | `403` |
| Wrong password | `500 { ..., message:"Invalid Credentials" }` | `401` |
| Login missing fields | `500 { ..., message:"Please add email or password" }` | `400` |
| Booking missing fields | `500 { ..., message:"Please provide all fields" }` | `400` |
| Invalid ObjectId | `500` (CastError) | `400` or `404` |

> [!tip] Interview framing
> “The API returns a consistent `{ success, message }` envelope, but the status codes are not fully standardised — notably 402 for auth and 500 for validation. I documented the mapping and would normalise it with an error-handling middleware.”

**Rule of thumb**

- **400** — the request is malformed or fails validation.
- **401** — we do not know who you are (missing/bad token, bad password).
- **403** — we know who you are, but you may not do this (non-admin, not the owner).
- **404** — the resource does not exist.
- **409** — the request conflicts with current state (duplicate email, overlapping booking).
- **422** — syntactically valid but semantically invalid (optional; pick 400 or 422 and stay consistent).
- **500** — an unexpected server fault; log it, do not leak stack traces.

---

### 6.6 Troubleshooting index

The detailed walkthrough is in [[#3.25 Troubleshooting]]. Use this table as the quick lookup.

| Symptom | Most likely cause | First thing to try |
| --- | --- | --- |
| `Missing required environment variables` on boot | No `server/.env` | `cp server/.env.example server/.env`, fill it in |
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB not running | Start `mongod`, Docker container, or Atlas; check `MONGO_URI` |
| API starts but every query fails | Wrong database/cluster or IP not allowed | Test the URI in Compass/mongosh; add your IP in Atlas |
| `EADDRINUSE :8080` | Old server still running | `lsof -i :8080`, then kill the PID |
| Browser shows CORS error | Origin not allowed / API not running | Check the server log; local `cors()` allows all, so suspect the URL/port |
| `401`/`402` on every protected call | Missing/expired token, or header format | Log in again; confirm `Authorization: Bearer <token>` |
| Admin login says not authorised | `isAdmin` is false in the DB | Promote the user in mongosh; log out/in |
| Admin routes redirect to login | Token missing or user object not persisted | Check `localStorage.appData`; clear and log in |
| `Cannot read properties of null` in profile | Stale token points at a deleted user | Clear storage; register/login again |
| Car form fails with 500 | Missing required text field or image | Check `name`, `model`, `year`, `about`, `image` |
| Image broken after upload | Raw Base64 rendered without a data URL | Use `getImageSrc()`; confirm the `image` field is non-empty |
| `413 Payload Too Large` | Image/JSON too big for the default limit | Compress the image; raise `express.json({ limit })` deliberately |
| Fleet shows demo cars | DB has ≤ 2 cars and `Home.jsx` falls back to JSON | Add real cars; remove the fallback in production |
| Booking total looks wrong | Off-by-one rental-day calculation | Use one shared `calculateRentalDays`; recompute server-side |
| Status change looks stale | `returnOrignal` typo returns the old doc | UI uses the submitted status; fix to `returnDocument: "after"` |
| Blank page on a deployed route | SPA rewrite missing | Rewrite all paths to `index.html` |
| Env change ignored | Vite baked the old value | Restart `npm run dev` or rebuild |
| `npm install` peer dependency error | Node/npm too old | Use Node 20+ (22/24 recommended) |
| Build passes but page is blank | Wrong `base`/asset path or API URL | Check the browser console and Network tab |
| Two toasts appear | Both toast libraries mounted | Remove one (`react-hot-toast` is used by the customer app) |

---

### 6.7 The design system on one page

The full design note is [[admin-panel-design-prompt|VirtuaCarz Editorial Design System]]. This is the revision summary.

**Intent:** editorial, warm, restrained. Cream paper, near-black ink, one orange accent, hairline rules, generous whitespace, strong typographic hierarchy. Closer to a print magazine than a SaaS dashboard.

**Tokens** (defined with Tailwind 4 `@theme` in both `index.css` files):

| Token | Value | Use |
| --- | --- | --- |
| `cream` | `#fbfbf8` | Page background |
| `cream-dark` | `#f5f4ef` | Alternate section background |
| `cream-deep` | `#f0eee6` | Cards, inset surfaces |
| `ink` | `#18181b` | Primary text, dark buttons |
| `ink-soft` | `#737373` | Secondary text, metadata |
| `accent` | `#fa520f` | Primary action, emphasis |
| `accent-deep` | `#d94400` | Hover/pressed accent |
| `line` | `#e5e5e5` | Hairline borders |
| `ink-inverse` | `#fafafa` | Text on dark surfaces |

**Type:** Figtree for both body and display, loaded from Google Fonts in `index.html`. Headings are bold with tight tracking (`-0.02em`); body text is regular with comfortable leading. Eyebrow labels are uppercase, small, and letter-spaced.

**Shape and space:** mostly square or lightly rounded corners; thin 1px rules instead of heavy shadows; section padding in the `py-16`–`py-24` range; content capped at `max-w-7xl`.

**Components:** `Button`, `Eyebrow`, `PageHeader`, `SectionHeading`, `Reveal` in the customer app; `Layout`, `Menus` plus shared page patterns in admin. Cards use an image, a category/model line, a name, and a price row. Tables become stacked cards below `lg`.

**Motion:** Framer Motion for page fade/slide, modal enter/exit, and scroll reveals. Duration is roughly 0.3–0.6s with the custom `ease-editorial` curve. `useReducedMotion` plus a global `prefers-reduced-motion` rule disable movement.

**Responsive breakpoints:** mobile-first; single column by default, two columns at `md`, asymmetric grids at `lg`. Check 375px, 768px, 1024px, and 1440px.

**Accessibility:** semantic landmarks, labelled inputs, `aria-label` on icon-only buttons, `role="dialog"` + `aria-modal` on modals, Escape to close, visible focus rings. Missing: focus trap, skip link, and a full audit.

**Do / don’t**

- Do use one accent per screen and let whitespace do the work.
- Do prefer a rule and a type-size jump over a shadow.
- Do keep copy short and concrete.
- Don’t mix in a second accent, gradient, or heavy drop shadow.
- Don’t use all-caps for long copy.
- Don’t animate something the user did not initiate, unless it is a subtle reveal.

---

### 6.8 One-page revision sheet

Read this the morning of an interview.

**Numbers**

| Fact | Value |
| --- | --- |
| Apps | 3 (customer, admin, API) |
| REST endpoints | 15 |
| Mongoose models | 3 (`User`, `Car`, `Booking`) |
| Collections | `users`, `cars`, `bookings` |
| Auth | JWT, 7-day expiry, payload `{ id }` |
| Password hashing | bcryptjs, salt rounds 10 |
| Booking statuses | `pending`, `confirm`, `cancel` |
| Booking price rule | Intended: inclusive days × daily price; ₹200 date-change penalty (three implementations differ — see 4.11 #15) |
| Image storage | Base64 string in `cars.image`; Multer memory storage |
| Frontend state | Redux Toolkit + `createAsyncThunk` |
| Styling | Tailwind CSS 4 `@theme`, Figtree, cream/ink/orange |
| API prefix | `/api/v1` |
| Default API port | 8080 |
| Default Vite ports | 5173 (client), 5174 (admin) |

**Names to remember**

- `server/server.js` — Express entry; CORS, JSON, Morgan, routes.
- `server/config/env.js` — loads and validates env.
- `server/config/db.js` — `connectDb()`.
- `server/middleware/authMiddleware.js` — `userAuth`, `isAdmin`.
- `server/middleware/multer.js` — memory storage upload.
- `client/src/store/features/authSlice.js` — `login`, `register`, `loadToken`, `logout`, bookings.
- `client/src/store/features/carSlice.js` — fleet + detail.
- `admin-panel/src/store/*` — admin auth/cars/bookings.
- `getImageSrc()` — normalises URL/data-URL/raw Base64.
- `ProtectedRoute` — admin-only UI guard.
- `calculateRentalDays()` — the shared day-count helper you should add.

**The 60-second explanation**

> “Two React SPAs share one Express API and one MongoDB database. The customer app browses cars, registers/logs in, books a car, and manages bookings. The admin app does fleet CRUD with image upload and manages every booking. Auth is a 7-day JWT; passwords are bcrypt hashes. Redux Toolkit handles async state. Tailwind 4 provides the design tokens. The main gaps are server-side pricing, ownership checks, and booking overlap prevention — I can walk through the fixes.”

**Five decisions to defend**

1. Three apps instead of one — separate users, bundles, and deploy targets.
2. Redux Toolkit instead of Context — shared async state and lifecycle flags.
3. JWT instead of server sessions — stateless and simple; trade-off is revocation.
4. Base64 instead of object storage — zero setup for a demo; trade-off is size.
5. Client-side price preview — fast UX; server must recompute.

**Five gaps to admit**

1. IDOR on user and booking routes.
2. Client-trusted booking price and user id.
3. Public `GET /booking/get-all`.
4. No overlap/availability check.
5. No automated tests or CI.

---

### 6.9 Learning resources

**Official documentation — start here**

- React: <https://react.dev/learn>
- Vite: <https://vite.dev/guide/>
- Redux Toolkit: <https://redux-toolkit.js.org/tutorials/quick-start>
- React Redux: <https://react-redux.js.org/>
- React Router: <https://reactrouter.com/>
- Tailwind CSS 4: <https://tailwindcss.com/docs/installation/using-vite>
- Framer Motion: <https://motion.dev/docs/react>
- Express: <https://expressjs.com/en/guide/routing.html>
- Mongoose: <https://mongoosejs.com/docs/guide.html>
- MongoDB manual: <https://www.mongodb.com/docs/manual/>
- JWT introduction: <https://jwt.io/introduction>
- MDN HTTP status codes: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Status>
- OWASP Top 10: <https://owasp.org/www-project-top-ten/>

**Concepts to study next**

- Object-level authorization (BOLA/IDOR) — OWASP API Security Top 10, API1.
- MongoDB schema design and indexing — compound indexes, `explain()`.
- Idempotency and transactions for bookings/payments.
- httpOnly cookies, CSRF, refresh-token rotation.
- Testing: Vitest, React Testing Library, Supertest, `mongodb-memory-server`.
- Deployment: environment variables, SPA rewrites, CORS allowlists.
- Accessibility: WCAG 2.2 quick reference, focus management in dialogs.

**Books and longer reads**

- *Designing Data-Intensive Applications* — Kleppmann (chapters on storage, replication, transactions).
- *Refactoring UI* — Wathan & Schoger (visual hierarchy, spacing, colour).
- *Web Accessibility* — pick the WCAG quick reference first; a full book is optional.

---

### 6.10 Seven-day rebuild plan

If you have one week and want to be able to rebuild the project from memory:

| Day | Goal | Deliverable |
| --- | --- | --- |
| 1 | Backend skeleton | Express boots, Mongo connects, `/` responds, env validation |
| 2 | Models + auth | `User`, `Car`, `Booking`; register/login; `userAuth`/`isAdmin`; curl tests |
| 3 | Cars + uploads | CRUD, Multer memory storage, Base64, curl multipart test |
| 4 | Bookings | Create/list/details/status/update; ownership and overlap checks (add them now) |
| 5 | Customer app | Vite, Tailwind, router, Axios, Redux, auth pages, fleet, details, booking, profile |
| 6 | Admin app | Layout, protected routes, dashboard, fleet CRUD, booking table/details/status |
| 7 | Polish + deploy | Loading/error/empty states, responsive pass, builds, Atlas + API host + static hosts, README |

**Daily rhythm:** 25 minutes reading the docs → 90 minutes building → 20 minutes testing with curl/browser → 10 minutes writing down what broke and why. Keep a `NOTES.md`; future-you will forget the CORS/upload details.

**Definition of done for each day:** it works from a clean terminal, the happy path and one failure path are tested, and the code is committed.

---

### 6.11 Roadmap

Ordered by risk reduction, not novelty.

**Now — correctness and security**

- [ ] Add ownership checks to `updateUser`, `getUserBooking`, `updateBooking`.
- [ ] Derive `user` from `req.user.id`; never accept it from the booking body.
- [ ] Load the car and recompute `totalPrice` server-side.
- [ ] Protect `GET /booking/get-all` with `userAuth` + `isAdmin`.
- [ ] Add booking overlap detection and return 409.
- [ ] Fix `returnOrignal` → `returnDocument: "after"`.
- [ ] Standardise status values and status codes.
- [ ] Add upload size/type limits and an error handler.
- [ ] Restrict CORS to known origins.

**Next — quality**

- [ ] Extract `calculateRentalDays` and use it in both apps and the API.
- [ ] Add Zod/Joi request validation.
- [ ] Add an error-handling middleware and a response helper.
- [ ] Add Vitest + RTL for slices/components; Supertest for routes.
- [ ] Add GitHub Actions: install, lint, build, test.
- [ ] Add a `NotFound` route and an ErrorBoundary.
- [ ] Remove the demo-data fallback from `Home.jsx`.
- [ ] Remove the unused toast library and duplicate router package.

**Later — scale and product**

- [ ] Move images to S3/Cloudinary; store URLs only.
- [ ] Pagination, search, and filters with indexes.
- [ ] Availability calendar and date-range picker.
- [ ] Payments (Razorpay/Stripe) with webhooks and idempotency.
- [ ] Email verification, password reset, notifications.
- [ ] Admin analytics from aggregation pipelines.
- [ ] Refresh tokens, httpOnly cookies, revocation.
- [ ] Docker Compose for local dev; staging environment.
- [ ] Structured logging, monitoring, backups.

> [!tip] How to talk about the roadmap
> Lead with the security fixes, then correctness, then scale, then product. That order signals judgement: you are not chasing features while the foundation leaks.

---

### 6.12 Project journal prompts

Use these after each work session. They turn “I built a thing” into stories you can tell.

1. What did I try to do today, in one sentence?
2. What was the first error I saw, and what did it actually mean?
3. Which layer was at fault — UI, network, route, controller, model, database, or environment?
4. What did I assume that turned out to be false?
5. What is the smallest change that fixed it?
6. How did I verify the fix (curl, browser, DB query)?
7. What would I do differently if I rebuilt this tomorrow?
8. Which decision am I least confident about, and why?
9. What did I learn that I could explain to a beginner in two minutes?
10. What is the next smallest useful step?

**Turn a journal entry into a STAR story:** Situation = the bug/feature in context; Task = what needed to change; Action = the steps and tools; Result = the observable outcome; Reflection = the trade-off or next fix.

---

### 6.13 Note conventions

- **Blue callout** (`info`, `note`, `abstract`, `tip`) — context or guidance.
- **Yellow/orange callout** (`warning`, `caution`) — a trap that costs time.
- **Red callout** (`danger`, `error`) — data loss or security issue.
- **Green callout** (`success`, `check`) — verified behaviour.
- **Wikilinks** — `[[#Contents]]` for a section in this note; `[[admin-panel-design-prompt]]` for the design note.
- **Code blocks** — `bash` for shell, `js` for JavaScript, `dotenv` for env files, `text` for trees/diagrams.
- **Tables** — use for comparisons and lookups, not for long prose.

If you add a section, update [[#Contents]] and keep the part numbering consistent.

---

## Appendix — file inventory

Trees exclude `node_modules`, `dist`, and lockfiles. Annotations describe the file’s job, not every line.

### A.1 Root

```text
VirtuaCarz/
├── .gitignore
├── README.md
├── admin-panel/        # Admin SPA
├── client/             # Customer SPA
├── docs/               # Obsidian notes (this handbook + design system)
└── server/             # Express API
```

| File | Purpose |
| --- | --- |
| `.gitignore` | Ignores dependencies, builds, env files, editor files |
| `README.md` | Setup, scripts, API overview, project description |
| `docs/virtuacarz-handbook.md` | This note |
| `docs/admin-panel-design-prompt.md` | Editorial design system and UI prompt |

### A.2 Server

```text
server/
├── .env.example
├── package.json
├── server.js
├── config/
│   ├── db.js
│   └── env.js
├── controllers/
│   ├── bookingController.js
│   ├── carController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js
│   └── multer.js
├── models/
│   ├── bookingModel.js
│   ├── carModel.js
│   └── userModel.js
└── routes/
    ├── bookingRoute.js
    ├── carRoute.js
    └── userRoutes.js
```

| File | Responsibility |
| --- | --- |
| `server.js` | Creates the app, mounts CORS/JSON/Morgan, mounts the three routers, health route, listens on `PORT` |
| `config/env.js` | Loads `server/.env`, validates `MONGO_URI` + `JWT_SECRET`, exits on missing values |
| `config/db.js` | `connectDb()` — Mongoose connection and startup log |
| `models/userModel.js` | `uname`, `email` (unique), `password`, `phone`, `isAdmin`; timestamps |
| `models/carModel.js` | Name, model, year, category, fuel, seats, `milage`, price, about, Base64 `image`, `transmission` boolean, `status` boolean; timestamps |
| `models/bookingModel.js` | `user`/`car` ObjectId refs, dates, daily `price`, `totalPrice`, status enum; timestamps |
| `controllers/userController.js` | Register, login, get current user, update user |
| `controllers/carController.js` | List, detail, add, update, delete; image handling |
| `controllers/bookingController.js` | Create, list all, details (manual join), status update, user bookings, date update with penalty |
| `middleware/authMiddleware.js` | `userAuth` verifies JWT (raw or Bearer); `isAdmin` loads user and checks role |
| `middleware/multer.js` | Multer memory storage; single `image` field |
| `routes/userRoutes.js` | `/register`, `/login`, `/get-user`, `/update/:id` |
| `routes/carRoute.js` | `/add-car`, `/get-all`, `/:id`, `/update-car/:id`, `/delete-car/:id` |
| `routes/bookingRoute.js` | `/create`, `/get-all`, `/get-details/:id`, `/update-status/:id`, `/user-booking/:id`, `/update/:id` |
| `.env.example` | Template for local configuration |
| `package.json` | Dependencies and the `start` script; no test suite |

### A.3 Customer app

```text
client/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── api/
    │   └── API.jsx
    ├── assets/
    ├── components/
    │   ├── BookingDetailsModal.jsx
    │   ├── BookingModal.jsx
    │   ├── CarCard.jsx
    │   ├── EditBookingModal.jsx
    │   ├── EditModal.jsx
    │   ├── Footer.jsx
    │   ├── Header.jsx
    │   └── ui/
    │       ├── Button.jsx
    │       ├── Eyebrow.jsx
    │       ├── PageHeader.jsx
    │       ├── Reveal.jsx
    │       └── SectionHeading.jsx
    ├── Data/
    │   └── carsData.json
    ├── pages/
    │   ├── About.jsx
    │   ├── Contact.jsx
    │   ├── Home.jsx
    │   ├── Auth/
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── Car/
    │   │   ├── CarDetails.jsx
    │   │   └── Cars.jsx
    │   └── user/
    │       └── Profile.jsx
    ├── store/
    │   ├── store.js
    │   └── features/
    │       ├── authSlice.js
    │       └── carSlice.js
    └── utils/
        └── image.js
```

| File | Responsibility |
| --- | --- |
| `main.jsx` | React root, Redux `Provider`, router, CSS import |
| `App.jsx` | Route table, page transitions, header/footer visibility, token hydration |
| `api/API.jsx` | Axios instance with `VITE_BASEURL` and auth interceptor |
| `store/store.js` | `configureStore` with auth and cars reducers |
| `store/features/authSlice.js` | Register/login/load/logout, current-user bookings, thunks |
| `store/features/carSlice.js` | Fleet list and selected car detail thunks |
| `Header.jsx` | Brand, nav, auth-aware account menu, mobile drawer |
| `Footer.jsx` | Sitemap, contact, legal copy |
| `CarCard.jsx` | Fleet card with image, name, specs, price, link |
| `BookingModal.jsx` | Date selection, day count, live total, create booking |
| `BookingDetailsModal.jsx` | Customer view of one booking |
| `EditBookingModal.jsx` | Date change with ₹200 penalty and new total |
| `EditModal.jsx` | Profile editing |
| `Home.jsx` | Hero, featured fleet, trust/process sections, fallback demo data |
| `Cars.jsx` | Full fleet, search/filter/sort |
| `CarDetails.jsx` | Gallery/specs, booking entry point |
| `Login.jsx` / `Register.jsx` | Auth forms and validation |
| `Profile.jsx` | Account details + booking list with modals |
| `About.jsx` / `Contact.jsx` | Static marketing pages |
| `ui/*` | Button, eyebrow, page header, section heading, scroll reveal |
| `utils/image.js` | `getImageSrc()` — URL, data URL, or raw Base64 → `<img src>` |
| `Data/carsData.json` | Fallback demo fleet used when the API returns ≤ 2 cars |
| `index.css` | Tailwind import, `@theme` tokens, base styles, reduced motion |
| `vite.config.js` | React + Tailwind plugins |

### A.4 Admin panel

```text
admin-panel/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── API/
    │   └── api.jsx
    ├── assets/
    ├── components/
    │   ├── Layout.jsx
    │   └── Menus.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── AllCars.jsx
    │   ├── AddCar.jsx
    │   ├── EditCar.jsx
    │   ├── AllBookings.jsx
    │   └── auth/
    │       ├── Login.jsx
    │       ├── CarDetails.jsx
    │       └── BookingDetails.jsx
    └── store/
        ├── store.js
        ├── authSlice.js
        ├── carSlice.js
        └── bookingSlice.js
```

| File | Responsibility |
| --- | --- |
| `App.jsx` | Admin route table and `ProtectedRoute` guard |
| `API/api.jsx` | Shared Axios instance + token interceptor |
| `components/Layout.jsx` | Sidebar/topbar shell, responsive navigation |
| `components/Menus.jsx` | Navigation items |
| `pages/Home.jsx` | Dashboard: fleet count, booking count, GMV, recent activity |
| `pages/AllCars.jsx` | Fleet table/cards with edit/delete actions |
| `pages/AddCar.jsx` | Car form with image preview → `FormData` |
| `pages/EditCar.jsx` | Route shim that redirects to car details |
| `pages/auth/CarDetails.jsx` | Single-car view, edit form, delete |
| `pages/AllBookings.jsx` | All bookings with status filter and detail link |
| `pages/auth/BookingDetails.jsx` | Booking detail and status transition |
| `pages/auth/Login.jsx` | Admin login |
| `store/authSlice.js` | Login, token hydration, logout, admin user |
| `store/carSlice.js` | Fleet list/detail, add/update/delete thunks |
| `store/bookingSlice.js` | All bookings, detail, status update |
| `index.css` | Same tokens and base styles as the customer app |

### A.5 Documentation

| File | Purpose |
| --- | --- |
| `docs/virtuacarz-handbook.md` | This build guide, code walkthrough, interview pack, and reference |
| `docs/admin-panel-design-prompt.md` | Design language, tokens, layout rules, and UI prompt |

### A.6 What is deliberately missing

| Missing | Why it matters | Where it would go |
| --- | --- | --- |
| Tests | Regressions are invisible; no confidence to refactor | `server/tests`, `client/src/**/*.test.jsx` |
| CI | Nothing blocks a broken build | `.github/workflows/ci.yml` |
| TypeScript / runtime validation | API contract drift and `undefined` bugs | request schemas, shared types |
| Object storage | Base64 bloats documents and responses | `carController` + S3/Cloudinary |
| Pagination/search | Fleet and booking lists grow unbounded | controllers + indexes |
| Availability check | Double bookings are possible | `createBooking` + compound index |
| Error middleware | Catch blocks repeat and leak raw errors | `server/middleware/errorHandler.js` |
| Rate limiting/helmet | Basic abuse protection | `server.js` |
| Seed script | Every fresh clone starts empty | `server/seed.js` |
| Docker Compose | Local setup differs across machines | root `docker-compose.yml` |

---

> [!success] You reached the end
> If you can explain the three-app shape, the booking flow, the auth flow, and the five gaps without notes, you are ready. Rehearse the [[#5.1 The 30-second pitch]] and the [[#5.8 Demo script]], then build one item from [[#6.11 Roadmap]] to have a “since then” story.

*Last verified: 2026-11-06 · Node v24.22.1 · npm 11.19.1 · both frontend production builds passed.*
