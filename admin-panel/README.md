# Admin panel

The administration dashboard for VirtuaCarz. Admins can manage the car fleet, inspect bookings, and update booking status.

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

Sign in with an account whose `isAdmin` field is `true`. See the root README for local admin setup. Other available scripts: `npm run build`, `npm run lint`, and `npm run preview`.
