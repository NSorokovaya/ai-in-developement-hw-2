# JSONPlaceholder API Clone

A NestJS-based REST API that provides endpoints for managing users, posts, and comments, similar to JSONPlaceholder.

## Features

- User management (CRUD operations)
- Post management with user association
- Comment management with user and post association
- JWT-based authentication
- Swagger API documentation
- Prisma ORM for database operations
- Docker support for easy deployment

## Prerequisites

- Docker
- Docker Compose

## Running the app

```bash
# Start the application
$ docker-compose up -d

# View logs
$ docker-compose logs -f

# Stop the application
$ docker-compose down
```

The application will be available at:
- **API Base URL**: `http://localhost:3000`
- **Swagger Documentation**: `http://localhost:3000/api`

The root endpoint `/` returns a "Hello World" message. All API endpoints listed below are relative to the base URL.

## Seeding the Database

To populate the database with initial data for development (users, posts, and comments), you can run the seed script.

**Important:** Your application and database containers must be running before executing this command. Use `docker-compose up -d` to start them.

```bash
$ yarn prisma:seed
```

## Running Tests

### Unit Tests
Unit tests do not require a database connection and can be run directly. They test individual components in isolation.

```bash
# Run unit tests
$ yarn test
```

### Integration Tests
Integration tests check how different parts of the application work together and require a running database.

First, start the database container:
```bash
# Start the database container
$ docker-compose up -d db
```

Now you can run the integration tests:
```bash
# Run integration tests
$ yarn test:integration
```

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/:id/posts` - Get user's posts

### Posts
- `POST /posts` - Create a new post
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get post by ID
- `PATCH /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `GET /posts/:id/comments` - Get post's comments

### Comments
- `POST /comments` - Create a new comment
- `GET /comments` - Get all comments
- `GET /comments/:id` - Get comment by ID
- `PATCH /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

## Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # Users module
├── posts/          # Posts module
├── comments/       # Comments module
├── prisma/         # Prisma configuration
└── main.ts         # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

