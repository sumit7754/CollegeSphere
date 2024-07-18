Absolutely, let's dive into a detailed documentation for each feature of your project. We can break down the flow of each feature, provide diagrams, and include explanations that make the documentation comprehensive and easy to understand.

### CollegeSphere

**CollegeSphere** is a social media platform designed for college students to enhance engagement and interaction through real-time features and multimedia sharing. The platform offers personalized user experiences and ensures efficient performance and scalability.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Detailed Feature Documentation](#detailed-feature-documentation)
  - [Authentication System](#authentication-system)
  - [Real-time Feed and Notifications](#real-time-feed-and-notifications)
  - [Multimedia Post Creation](#multimedia-post-creation)
  - [User Profiles](#user-profiles)
  - [Performance Optimization](#performance-optimization)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

1. **Authentication System**
2. **Real-time Feed and Notifications**
3. **Multimedia Post Creation**
4. **Personalized User Profiles**
5. **Performance Optimization**

## Technologies Used

- **Frontend:** Next.js, React
- **Backend:** GraphQL, PostgreSQL, Prisma ORM
- **State Management:** React Query
- **Caching:** Redis
- **Storage:** S3
- **Authentication:** Secure token-based authentication


## Setup and Installation

### Prerequisites

- Node.js (>=14.x)
- PostgreSQL
- Redis
- AWS S3

### Installation Steps

1. **Clone the repository:**

    ```sh
    git clone https://github.com/sumit7754/CollegeSphere.git
    cd CollegeSphere
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Setup environment variables:**

    Create a `.env` file in the root directory and add the necessary environment variables:

    ```plaintext
    DATABASE_URL=your_postgresql_database_url
    REDIS_URL=your_redis_url
    S3_BUCKET_NAME=your_s3_bucket_name
    S3_ACCESS_KEY_ID=your_s3_access_key_id
    S3_SECRET_ACCESS_KEY=your_s3_secret_access_key
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

4. **Run the development server:**

    ```sh
    npm run dev
    ```

5. **Build for production:**

    ```sh
    npm run build
    ```

## Detailed Feature Documentation

Thank you for the clarification. Let's update the authentication flow diagram and description to accurately reflect your process.

### Authentication System

#### Process Flow

1. **Frontend (Google OAuth):**
   - User initiates sign-up via Google OAuth.
   - Google credentials are generated upon successful sign-in.

2. **Send Credentials to Backend:**
   - The Google OAuth credentials are sent to the backend using a GraphQL query.

3. **Verify Token:**
   - Backend verifies the Google token by sending a request to Google's tokeninfo endpoint: `https://oauth2.googleapis.com/tokeninfo?id_token=<googleToken>`.

4. **User Data Handling:**
   - If the user data exists in the database, generate a JWT token.
   - If the user data does not exist, create a new user account in the database, then generate a JWT token.

5. **Return JWT Token:**
   - The JWT token is sent back to the frontend and stored in local storage.

6. **Subsequent Requests:**
   - For any subsequent requests to the backend, the JWT token is included in the request header as `Authorization: Bearer <token>`.

7. **Backend Middleware:**
   - The middleware decodes the JWT to extract user information.
   - The decoded user information is used to perform the requested backend tasks.

### Detailed Documentation for College Sphere Project

Below is a structured documentation for your College Sphere project, focusing on the authentication system and the `getCurrentUser` feature. The documentation includes a process flow, diagrams, and a detailed explanation of the technology choices.

---

## College Sphere Project

### Overview

College Sphere is a social media platform designed for college students. The platform includes features such as user authentication, real-time feeds, notifications, multimedia post creation, and user profiles. This documentation focuses on two key features: the authentication system and the `getCurrentUser` feature.

---

### 1. Authentication System

#### Process Flow

1. **Frontend (Google OAuth):**
   - User initiates sign-up or sign-in via Google OAuth.
   - Google credentials are generated upon successful sign-in.

2. **Send Credentials to Backend:**
   - The Google OAuth credentials are sent to the backend using a GraphQL query.

3. **Verify Token:**
   - Backend verifies the Google token by sending a request to Google's tokeninfo endpoint: `https://oauth2.googleapis.com/tokeninfo?id_token=<googleToken>`.

4. **User Data Handling:**
   - If the user data exists in the database, generate a JWT token.
   - If the user data does not exist, create a new user account in the database, then generate a JWT token.

5. **Return JWT Token:**
   - The JWT token is sent back to the frontend and stored in local storage.

6. **Subsequent Requests:**
   - For any subsequent requests to the backend, the JWT token is included in the request header as `Authorization: Bearer <token>`.

7. **Backend Middleware:**
   - The middleware decodes the JWT to extract user information.
   - The decoded user information is used to perform the requested backend tasks.


### 2. Get Current User

#### Process Flow

1. **GraphQL Query (Backend):**
   - A GraphQL query `getCurrentUser` is defined on the backend to fetch the current user's details.

2. **Frontend Query Hook:**
   - On the frontend, the `useGetCurrentUser` hook is created using `react-query`. This hook calls the backend to fetch the current user's details whenever required.

3. **React Query:**
   - `react-query` is used to manage the state of the data fetching. It provides a query key, and when the user changes, `invalidateQuery` is called to re-fetch and re-render the data.

4. **GraphQL Request:**
   - The `graphql-request` library is used to send the GraphQL query to the backend. The request includes the JWT token in the header.

5. **Backend Processing:**
   - On the backend, the request context (`ctx`) includes the JWT token.
   - If `ctx?.id` exists (decoded from the token), it means the user is authenticated.
   - The user data is then fetched from the database using Prisma ORM.

6. **Response Handling:**
   - The user data is returned to the frontend and stored in the `react-query` cache, allowing for efficient state management and re-rendering when necessary.
