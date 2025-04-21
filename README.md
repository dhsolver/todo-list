# Todo List App

This is a simple Todo List application built with Next.js, Prisma, and Dockerized for easy deployment.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered and static web applications.
- **Prisma**: A modern ORM for database management, used with SQLite for simplicity.
- **SQLite**: A lightweight, file-based database.
- **Docker**: Used to containerize the application for consistent and portable deployment.
- **Docker Compose**: Simplifies multi-container Docker applications.
- **Jest**: Used for unit testing.

## How to Build and Run the Application

To build and run the application using Docker Compose, follow these steps:

1. Make sure you have Docker and Docker Compose installed on your system.
2. Clone this repository to your local machine.
3. Open a terminal and navigate to the project directory.
4. Run the following command to build and start the application:

   ```bash
   docker-compose up --build
   ```

5. Once the application is running, open your browser and go to [http://localhost:3000](http://localhost:3000).

### Running Locally Without Docker

If you prefer to run the application locally without Docker:

1. Make sure you have Node.js (version 18 or higher) and npm installed.
2. Clone this repository to your local machine.
3. Open a terminal and navigate to the project directory.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Set up the database:

   ```bash
   npm run setup:db
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open your browser and go to [http://localhost:3000](http://localhost:3000).

## Running Unit Tests

This project includes unit tests written with Jest. To run the tests, use the following command:

```bash
npm run test
```

## Design Choices

### Backend Architecture

- **Prisma ORM**: Prisma was chosen for its simplicity and developer-friendly features, making it easy to interact with the SQLite database.
- **SQLite**: A lightweight, file-based database was used for simplicity and ease of setup, especially for a small-scale application like this.
- **API Routes**: Next.js API routes were used to handle backend logic, providing a seamless integration between the frontend and backend.

### Testing Strategy

- **Jest**: Jest was chosen for its robust testing capabilities and ease of integration with React and Next.js.
- **Testing Library**: `@testing-library/react` was used to test React components, ensuring the application behaves as expected from a user's perspective.
- **Mocking**: API calls and navigation were mocked to isolate and test individual components and functions.

## Assumptions

- The application is designed for a single-user environment and does not include authentication or multi-user support.
- The SQLite database is sufficient for the scope of this project and does not require scaling.

## Trade-offs

- **Time Constraints**: Due to time constraints, advanced features like user authentication, real-time updates, and detailed error handling were not implemented.
- **Database Choice**: SQLite was chosen for simplicity, but it may not be suitable for production use in a multi-user environment.
- **Testing Coverage**: While unit tests cover most critical components and API routes, end-to-end tests were not included due to time limitations.

## Notes

- The application runs on port 3000 by default.
- Ensure that port 3000 is not being used by another application on your system.
- If you need to reset the database, delete the SQLite database file and re-run the application.
