# ToDo Full Stack Application

A full-stack todo application built with React, Node.js, and MongoDB.

## Architecture

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Deployment**: Docker + GitHub Actions

## Services

### MongoDB
- Container: `todo-mongodb`
- Port: 27017
- Database: `todo-db`

### API
- Container: `todo-api`
- Port: 3000
- Image: `pimientaglez/todo-api:1.0.0`

### Frontend
- Container: `todo-frontend`
- Port: 5173
- Image: `pimientaglez/todo-app:1.0.0`

## Environment Variables

Create a `.env` file with the following variables:

```env
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password
MONGO_DB=todo-db
MONGO_PORT=27017
PORT=3000
FRONTEND_PORT=5173
NODE_ENV=production
```

## Running Locally

```bash
docker compose up -d
```

## CI/CD

The project uses GitHub Actions for automated building and deployment:

- Builds and pushes Docker images when changes are detected in `todo-api/` or `todo-frontend/`
- Automatically deploys to self-hosted runner
- Runs on push to `main` branch

## Development

### API Development
```bash
cd todo-api
npm install
npm run dev
```

### Frontend Development
```bash
cd todo-frontend
npm install
npm run dev
```

## License

MIT
