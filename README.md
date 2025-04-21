# Todo List App

This is a simple Todo List application built with Next.js, Prisma, and Dockerized for easy deployment.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered and static web applications.
- **Prisma**: A modern ORM for database management, used with SQLite for simplicity.
- **SQLite**: A lightweight, file-based database.
- **Docker**: Used to containerize the application for consistent and portable deployment.
- **Docker Compose**: Simplifies multi-container Docker applications.
- **Jest**: Used for unit testing.

## How to Run the Application

To run the application using Docker Compose, follow these steps:

1. Make sure you have Docker and Docker Compose installed on your system.
2. Clone this repository to your local machine.
3. Open a terminal and navigate to the project directory.
4. Run the following command to build and start the application:

   ```bash
   docker-compose up --build
   ```

5. Once the application is running, open your browser and go to http://localhost:3000.

## Running Unit Tests

This project includes unit tests written with Jest. To run the tests, use the following command:

```bash
 npm run test
```

## Database Setup

This application uses Prisma with SQLite as the database. The SQLite database file is stored locally in the project directory. Prisma migrations are automatically applied when the container starts.

## Notes

- The application runs on port 3000 by default.
- Ensure that port 3000 is not being used by another application on your system.
- If you need to reset the database, delete the SQLite database file and re-run the application.
