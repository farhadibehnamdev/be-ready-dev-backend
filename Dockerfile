FROM node:20.11.0-alpine3.19

RUN addgroup app && adduser -S -G app app

WORKDIR /app
COPY --chown=app:app package*.json .
RUN npm install -g pnpm 
RUN pnpm install
RUN pnpm add sharp 
COPY --chown=app:app . .
USER app
EXPOSE 8080

CMD [ "pnpm" , "start:dev" ]