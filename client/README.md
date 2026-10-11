# Customer app

The customer-facing React app for VirtuaCarz. It provides car browsing, vehicle details, account access, profile management, and booking flows.

For full project setup, environment variables, API routes, and architecture, see the [repository README](../README.md).

## Local development

Create `.env.local` in this directory:

```dotenv
VITE_BASEURL=http://localhost:8080/api/v1
```

Then install dependencies and start Vite:

```bash
npm install
npm run dev
```

Other available scripts: `npm run build`, `npm run lint`, and `npm run preview`.
