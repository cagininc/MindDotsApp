# MindDotsApp

## Overview

## Overview

**MindDotsApp** is a creative journaling web application that allows users to securely manage their accounts and capture their thoughts in a seamless and engaging way. Built on **Node.js** and powered by **MongoDB**, this application utilizes  security features such as JWT for authentication and bcrypt for password hashing, ensuring that users' data is safe and protected. While MindDotsApp currently focuses on backend functionality, with a basic HTML frontend,for this project, I focused on using only HTML for the frontend, which helped me see things from a different perspective. While it's simple right now, I plan to improve the frontend experience in the future.



## Key Features

*   **User Authentication & Authorization:** Users can securely sign up and log in using JSON Web Tokens (JWT) for session management.
*   **Password Security:** User passwords are encrypted using bcrypt for secure storage.
*   **Email Notifications:** Notifications like account verification and password recovery are handled through MailerSend and Nodemailer to provide a smooth communication flow.
*   **Note-Taking Functionality:** Users can create, edit, and delete personal notes. This allows users to track important tasks or information directly within the app.
*   **Session Management:** Secure session handling using JWT ensures user data protection and safe access to protected routes.
*   **MongoDB Integration:** MongoDB Atlas is used as the database for storing user information and notes, allowing for efficient data management in the cloud.

## Technologies Used

*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB Atlas (integrated using Mongoose)
*   **Authentication:** JWT (JSON Web Token) for secure user sessions
*   **Security:** Bcrypt for hashing passwords
*   **Email Services:** MailerSend and Nodemailer for sending email notifications
*   **Environment Configuration:** dotenv for managing environment variables

## Application Flow

### User Registration:

New users can register by providing their email and password. The password is hashed before being stored in the database to ensure data security.

### User Login:

Registered users can log in with their credentials, and upon successful login, a JWT token is generated and sent back to the user, allowing them to access protected routes.

### Note Management:

Once authenticated, users can create, edit, and delete notes. These notes are stored in the MongoDB database under their respective user accounts.

### Email Notifications:

When users sign up or request a password reset, automated email notifications are sent using MailerSend and Nodemailer, ensuring timely communication with users.

### Session Security:

JWT tokens are used to validate user sessions, ensuring that only authenticated users can access and manage their notes.

## Deployment

MindDotsApp was deployed using Vercel, a cloud platform that enables fast and reliable deployment for modern web applications. Here's how the deployment process was handled:

### Why Vercel?

*   **Ease of Use:** Vercel provides a seamless integration with GitHub, allowing continuous deployment every time code is pushed or merged into the main branch.
*   **Serverless Functions:** With Vercel, we leverage serverless functions for handling backend logic, such as user authentication and note management, eliminating the need for traditional server management.
*   **Scalability:** Vercel's global edge network ensures that the app is fast and reliable, with the ability to scale based on user traffic.

### Deployment Process

*   **GitHub Integration:** The source code for MindDotsApp was hosted on a GitHub repository. Vercel connects directly to the repository, making it easy to deploy the app from the latest commits.
*   **Continuous Deployment:** Every time a new feature or update was pushed to the main branch, Vercel automatically detected the changes and deployed the updated version of the application.
*   **Serverless API Handling:** The backend of MindDotsApp is built using Node.js and Express. When deployed on Vercel, these backend APIs were automatically converted into serverless functions. Vercel’s serverless environment scales dynamically based on the number of incoming requests, ensuring efficient resource usage.
*   **Environment Variables:** Using Vercel’s environment settings, sensitive data such as the MongoDB connection string and email API keys were securely added. These environment variables were automatically injected during the build process, ensuring that the app works securely and effectively in the cloud environment.
*   **Domain & URL:** Once the deployment was completed, Vercel provided a custom URL for accessing the app. The live version of MindDotsApp can be accessed via the following link: [https://minddotsapp.vercel.app/](https://minddotsapp.vercel.app/)
