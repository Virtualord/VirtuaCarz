# syntax=docker/dockerfile:1

# ---- Frontend build ----
FROM node:24-alpine AS frontend-build
WORKDIR /app

COPY client/package.json client/package-lock.json ./client/
COPY admin-panel/package.json admin-panel/package-lock.json ./admin-panel/
RUN npm ci --include=dev --prefix client \
    && npm ci --include=dev --prefix admin-panel

COPY client ./client
COPY admin-panel ./admin-panel
# VITE_BASEURL is intentionally unset: both builds use the same-origin
# /api/v1 fallback, and the admin build is based at /admin/.
RUN npm run build --prefix client \
    && npm run build --prefix admin-panel

# ---- Server production dependencies ----
FROM node:24-alpine AS server-deps
WORKDIR /app/server

COPY server/package.json server/package-lock.json ./
# Retry transient registry/DNS failures during image builds.
RUN npm ci --omit=dev --no-audit --no-fund \
    --fetch-retries=5 \
    --fetch-retry-mintimeout=20000 \
    --fetch-retry-maxtimeout=120000

# ---- Runtime ----
FROM node:24-alpine AS runtime

ENV NODE_ENV=production
ENV HOST=0.0.0.0
# Render injects PORT at runtime (10000 by default); 8080 is the local default.
ENV PORT=8080

WORKDIR /app

COPY --chown=node:node --from=server-deps /app/server/node_modules ./server/node_modules
COPY --chown=node:node server ./server
COPY --chown=node:node --from=frontend-build /app/client/dist ./client/dist
COPY --chown=node:node --from=frontend-build /app/admin-panel/dist ./admin-panel/dist

# The node user in node:24-alpine is UID/GID 1000.
USER 1000:1000
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD ["sh", "-c", "wget -qO- \"http://127.0.0.1:${PORT}/api/health\" >/dev/null || exit 1"]

CMD ["node", "server/server.js"]
