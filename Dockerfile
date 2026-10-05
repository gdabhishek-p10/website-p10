FROM node:22-slim

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

# Build-time placeholders only; real values come from the runtime environment.
RUN PAYLOAD_SECRET=build-placeholder DATABASE_URL=file:/tmp/build.db npm run build

ENV NODE_ENV=production
ENV NODE_OPTIONS=--no-deprecation
EXPOSE 3000

CMD ["sh", "scripts/start.sh"]
