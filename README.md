# Bankuish Challenge

## Description
This project is a backend application developed as part of a challenge. It is designed to handle user and course data, utilizing a database with Prisma and Firebase for authentication. The project follows a modular architecture with well-defined controllers, services, and models.

## Requirements

- Node.js (recommended version: 16.x or higher)
- Prisma
- Firebase
- Docker (for containerized execution)

## Installation

Follow these steps to install and run the project locally.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your_username/bankuish-challenge.git
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Configure Firebase:**
   To connect your project with Firebase, make sure you have the `firebaseServiceAccountKey.json` file with your Firebase service account credentials in the `config` folder.

   **Steps:**
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a project (if you don't have one).
   - Access the project settings and download the service account key file.
   - Place the file in the `config/firebaseServiceAccountKey.json` folder.

4. **Configure the Prisma database:**
   Make sure the database is correctly configured in the `prisma/schema.prisma` file.

5. **Run the migrations:**
   ```bash
   npx prisma migrate dev
   ```

6. **Configure environment variables:**
   Ensure that the `.env` file contains the necessary configurations, such as database keys, Firebase credentials, etc.

   **Example variables in `.env`:**
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DBNAME"
   JWT_SECRET="your_secret_password"
   ```

## Running the Application

1. **Run the server locally:**
   ```bash
   yarn start
   ```

   The server should be running at `http://localhost:3000`.

## Testing

The project includes integration (e2e) tests that you can run with Jest.

1. **Run the tests:**
   ```bash
   yarn test:e2e
   ```

   This will run the tests defined in the `user.e2e-spec.ts` and `courses.e2e-spec.ts` files.

   ```bash
   yarn test:e2e
   ```

   This will run the unit tests.

## Project Structure

The project is organized as follows:

```bash
├── config
│   └── firebaseServiceAccountKey.json  # Firebase configuration file
├── prisma
│   ├── migrations  # Database migrations
│   └── schema.prisma  # Prisma schema for the database
├── src
│   ├── courses  # Logic, controllers, and unit tests for courses
│   ├── user  # Logic, controllers, and unit tests for users
│   ├── app.module.ts  # Main application module
│   └── main.ts  # Entry point of the application
├── test
│   ├── user.e2e-spec.ts  # Integration tests for the user module
│   ├── courses.e2e-spec.ts  # Integration tests for the courses module
│   └── jest-e2e.json  # Jest configuration for e2e tests
├── .env  # Environment variables
├── package.json  # Dependencies and scripts
└── README.md  # This file
```

## License

This project is licensed under the MIT license. For more details, see the LICENSE file.