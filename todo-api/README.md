# Todo API

A RESTful API for managing todo items built with Node.js, Express, TypeScript, and MongoDB. This project is containerized with Docker for easy deployment and learning.

## Features

- Create, read, update, and delete todos
- Mark todos as completed/incomplete
- Priority levels (low, medium, high)
- Automatic timestamps (create, update, complete dates)
- MongoDB for data persistence
- Docker containerization
- Health checks for monitoring

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: MongoDB 7.0
- **ODM**: Mongoose
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker and Docker Compose installed
- (Optional) Node.js 20+ for local development
- (Optional) MongoDB if running without Docker

## Quick Start with Docker

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd todo-api
```

### 2. Create environment file

```bash
cp .env.example .env
```

Edit `.env` if you want to customize the configuration.

### 3. Start the application

```bash
docker-compose up -d
```

This will:
- Pull the MongoDB 7.0 image
- Build the API Docker image
- Start both services with networking and volumes

### 4. Verify it's running

```bash
# Check container status
docker-compose ps

# Check API health
curl http://localhost:3000/

# View logs
docker-compose logs -f api
```

### 5. Stop the application

```bash
docker-compose down
```

To also remove volumes:
```bash
docker-compose down -v
```

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints

#### Get all todos
```http
GET /api/todos
```

#### Get a single todo
```http
GET /api/todos/:id
```

#### Create a new todo
```http
POST /api/todos
Content-Type: application/json

{
  "title": "Buy groceries",
  "body": "Milk, bread, eggs",
  "priority": "high"
}
```

#### Update a todo
```http
PUT /api/todos/:id
Content-Type: application/json

{
  "title": "Updated title",
  "body": "Updated description",
  "isCompleted": true,
  "priority": "low"
}
```

#### Delete a todo
```http
DELETE /api/todos/:id
```

## Docker Commands

### Build the Docker image

```bash
docker build -t your-username/todo-api:latest .
```

### Run the API container alone

```bash
docker run -d \
  -p 3000:3000 \
  -e MONGO_URI=your-mongodb-connection-string \
  --name todo-api \
  your-username/todo-api:latest
```

### Push to Docker Hub

1. **Login to Docker Hub**
```bash
docker login
```

2. **Tag your image**
```bash
docker tag todo-api:latest your-dockerhub-username/todo-api:latest
docker tag todo-api:latest your-dockerhub-username/todo-api:1.0.0
```

3. **Push to Docker Hub**
```bash
docker push your-dockerhub-username/todo-api:latest
docker push your-dockerhub-username/todo-api:1.0.0
```

4. **Pull from Docker Hub (on any machine)**
```bash
docker pull your-dockerhub-username/todo-api:latest
```

## Local Development (Without Docker)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Update `MONGO_URI` to point to your local MongoDB instance.

### 3. Run in development mode

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
npm start
```

## Project Structure

```
todo-api/
├── src/
│   ├── config/
│   │   └── database.ts       # MongoDB connection
│   ├── controllers/
│   │   └── todoController.ts # Route handlers
│   ├── models/
│   │   └── Todo.ts           # Mongoose schema
│   ├── routes/
│   │   └── todoRoutes.ts     # API routes
│   └── server.ts             # App entry point
├── dist/                     # Compiled JavaScript (generated)
├── node_modules/             # Dependencies
├── .dockerignore             # Docker ignore rules
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── docker-compose.yml        # Multi-container setup
├── Dockerfile                # Container definition
├── package.json              # Project metadata
├── tsconfig.json             # TypeScript config
└── README.md                 # This file
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | API server port | `3000` |
| `MONGO_URI` | MongoDB connection string | See .env.example |
| `MONGO_ROOT_USERNAME` | MongoDB root username | `admin` |
| `MONGO_ROOT_PASSWORD` | MongoDB root password | `password` |
| `MONGO_DB` | Database name | `todo-db` |
| `MONGO_PORT` | MongoDB port | `27017` |

## Docker Image Details

- **Base Image**: node:20-alpine (lightweight, ~120MB)
- **Multi-stage build**: Separates build and runtime
- **Security**: Runs as non-root user
- **Health Check**: HTTP check on port 3000
- **Production ready**: Only production dependencies included

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs api
docker-compose logs mongodb

# Restart services
docker-compose restart
```

### MongoDB connection issues
```bash
# Ensure MongoDB is healthy
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Wait for MongoDB to be ready (takes ~40s on first start)
```

### Port already in use
```bash
# Change the port in .env file
PORT=3001
MONGO_PORT=27018

# Or stop the conflicting service
```

## Learning Docker - Key Concepts

This project demonstrates:

1. **Dockerfile**: Multi-stage builds for optimization
2. **docker-compose.yml**: Service orchestration
3. **Networking**: Services communicate via Docker network
4. **Volumes**: Data persistence for MongoDB
5. **Health Checks**: Monitoring container status
6. **Environment Variables**: Configuration management
7. **Image Building**: Creating distributable containers
8. **Docker Hub**: Sharing images publicly

## License

ISC

## Author

Your Name
