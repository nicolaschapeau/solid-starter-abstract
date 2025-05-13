FROM node:lts-bookworm-slim AS base
WORKDIR /app
RUN apt update &\
    apt install -y curl wget fontconfig &\
    rm -rf /var/lib/apt/lists/*

# Base installer
FROM base AS installer
RUN corepack enable
COPY . .

# All deps stage
FROM installer AS deps
RUN yarn workspaces focus

# Build stage
FROM installer AS build
COPY --from=deps /app/node_modules /app/node_modules
WORKDIR /app
RUN yarn build

# Production stage
FROM nginx:alpine AS production
ENV NODE_ENV=production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]