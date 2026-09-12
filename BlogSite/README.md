# BlogSite

A full-stack blog application built with **React and Appwrite**.

This project is being rebuilt from scratch to understand the complete application flow rather than simply following a tutorial. The main goal is to understand how React communicates with a backend service, how authentication works, how articles are stored, how images are managed, and how different parts of the application are connected.

---

## Project Goal

The goal of this project is to build a blog platform where users can:

* Create an account
* Log in and log out
* Create articles
* Edit articles
* Delete articles
* Upload featured images
* View published articles
* Manage their own articles

The project also focuses on understanding the architecture and concepts behind the implementation.

---

# Technology Stack

## Frontend

* React
* Vite
* React Router
* React Hook Form
* Redux Toolkit
* Tailwind CSS

## Backend / Backend Services

* Appwrite Authentication
* Appwrite TablesDB
* Appwrite Storage

## Editor

* TinyMCE / Rich Text Editor

---

# Overall Architecture

The application follows this general flow:

```text
                         BlogSite

                            |

                            v

                    +---------------+
                    |     React     |
                    |   Frontend   |
                    +---------------+

                            |

                            v

                    +---------------+
                    |    Service    |
                    |     Layer     |
                    +---------------+

                            |

                            v

                    +---------------+
                    |   Appwrite    |
                    +---------------+

                     /       |       \

                    /        |        \

                   v         v         v

            Authentication Database  Storage

                 |           |          |

                 v           v          v

               Users      Articles    Images
```

The React application does not directly manage the database or storage itself.

Instead:

```text
React Component

       ↓

Service / Configuration

       ↓

Appwrite SDK

       ↓

Appwrite Backend
```

This separation makes the application easier to understand, maintain, and modify.

---

# Appwrite Setup

The Appwrite project is the backend foundation of the application.

The Appwrite project currently contains:

```text
Appwrite Project

│

├── Authentication
│   └── Users
│
├── Database
│   └── articles
│
└── Storage
    └── article-images
```

---

# 1. Authentication

Appwrite Authentication is responsible for managing users.

It handles:

```text
Signup

   ↓

User account created

   ↓

Login

   ↓

Authenticated user

   ↓

Access protected functionality
```

Authentication answers the question:

> "Who is the user?"

Later, the authenticated user's ID will be associated with articles through the `userId` column.

---

# 2. Database

A database was created in Appwrite to store article information.

```text
Database

└── articles
```

The `articles` table stores information about each blog article.

Important distinction:

> The database stores information **about** an article, while Appwrite Storage stores the actual image/file.

---

# Articles Table Structure

The current `articles` table contains the following columns:

| Column          | Type       | Required | Purpose                                       |
| --------------- | ---------- | -------- | --------------------------------------------- |
| `title`         | varchar    | Yes      | Stores article title                          |
| `slug`          | varchar    | Yes      | URL-friendly identifier                       |
| `content`       | mediumtext | Yes      | Stores article content                        |
| `featuredImage` | varchar    | No       | Stores the ID/reference of the featured image |
| `status`        | boolean    | Yes      | Determines whether article is active          |
| `userId`        | varchar    | Yes      | Identifies the user who created the article   |

Appwrite also provides system fields such as:

```text
$id

$createdAt

$updatedAt
```

These are managed by Appwrite.

---

# Article Fields Explained

## title

```text
Type: varchar
Size: 255
```

Stores the title of the article.

Example:

```text
Learning React Hooks
```

`varchar` is used because the title is relatively short.

---

## slug

```text
Type: varchar
Size: 255
```

The slug is a URL-friendly version of the article title.

Example:

```text
learning-react-hooks
```

It can be used to identify an article through its URL.

For example:

```text
/articles/learning-react-hooks
```

The slug is also indexed because articles may be searched using the slug.

---

## content

```text
Type: mediumtext
```

Stores the main article content.

Since the article content can be much larger than a title, `mediumtext` is more appropriate than `varchar`.

The content will eventually come from the Rich Text Editor.

---

## featuredImage

```text
Type: varchar
Size: 255
```

This stores the ID/reference of the image stored in Appwrite Storage.

The actual image is **not stored inside the database**.

The relationship is:

```text
Appwrite Storage

       |

       | actual image

       v

   image.jpg

       |

       | file ID

       v

articles table

       |

       └── featuredImage
```

---

## status

```text
Type: boolean
```

The status represents whether an article is active.

```text
true  → active/published

false → inactive
```

This makes it possible to retrieve only active articles.

Conceptually:

```js
Query.equal("status", true)
```

---

## userId

```text
Type: varchar
Size: 255
```

Stores the ID of the user who created the article.

The relationship is:

```text
Authenticated User

       |

       | user ID

       v

     userId

       |

       v

    Article
```

This allows the application to determine which user owns an article.

---

# 3. Database Indexing

Indexes were created for fields that will commonly be used in queries.

Current indexes:

```text
status_index

    ↓

status

slug_index

    ↓

slug

userId_index

    ↓

userId
```

## Why indexing?

An index helps the database find matching records more efficiently.

For example:

```js
Query.equal("status", true)
```

uses the `status` field to find active articles.

Similarly:

```js
Query.equal("userId", userId)
```

can be used to find articles created by a particular user.

And:

```text
slug
```

can be used to find a specific article.

Indexes should not be created for every column unnecessarily. They should be created for fields that are commonly queried or sorted.

---

# 4. Appwrite Storage

A storage bucket was created for article images.

```text
Storage

└── article-images
```

The bucket stores the actual image files used by articles.

For example:

```text
article-images

│

├── image1.jpg

├── image2.png

└── image3.webp
```

The database only stores the corresponding file ID.

---

# Storage Permission Concept

The storage permissions are configured so that:

```text
Anyone

   ↓

Can read/view images

Authenticated users

   ↓

Can create images

   ↓

Can update images

   ↓

Can delete images
```

This allows visitors to see article images while preventing unauthenticated users from managing files.

This demonstrates an important backend concept:

> Authentication determines who the user is, while permissions/authorization determine what the user is allowed to do.

---

# Environment Variables

The project uses environment variables instead of hardcoding Appwrite configuration values.

The configuration flow is:

```text
.env

 ↓

import.meta.env

 ↓

Conf.js

 ↓

Application Services

 ↓

Appwrite
```

---

# `.env`

The `.env` file contains the actual environment values.

Example:

```env
VITE_APPWRITE_ENDPOINT=your_endpoint

VITE_APPWRITE_PROJECT_ID=your_project_id

VITE_APPWRITE_DATABASE_ID=your_database_id

VITE_APPWRITE_TABLE_ID=your_articles_table_id

VITE_APPWRITE_BUCKET_ID=your_article_images_bucket_id
```

The actual values should not be committed to Git when they contain private configuration.

The `.env` file should therefore be added to `.gitignore`.

---

# `.env.sample`

The `.env.sample` file shows other developers which environment variables are required without exposing the actual values.

Example:

```env
VITE_APPWRITE_ENDPOINT=

VITE_APPWRITE_PROJECT_ID=

VITE_APPWRITE_DATABASE_ID=

VITE_APPWRITE_TABLE_ID=

VITE_APPWRITE_BUCKET_ID=
```

The sample file is safe to commit to GitHub.

It acts as a template for setting up the project on another machine.

---

# Configuration File

A configuration file is created inside:

```text
src/

└── conf/

    └── Conf.js
```

Its responsibility is to collect the environment variables in one place.

Conceptually:

```text
.env

 |

 | environment values

 v

Conf.js

 |

 | centralized configuration

 v

Appwrite Services
```

Example structure:

```js
const conf = {

    appwriteEndpoint: String(import.meta.env.VITE_APPWRITE_ENDPOINT),

    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),

    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),

    appwriteTableId: String(import.meta.env.VITE_APPWRITE_TABLE_ID),

    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),

};

export default conf;
```

---

# Why Use `Conf.js`?

Instead of accessing environment variables throughout the application:

```js
import.meta.env.VITE_APPWRITE_PROJECT_ID
```

everywhere, the configuration is centralized.

The application can instead use:

```js
conf.appwriteProjectId
```

This provides a single place for application configuration.

If a configuration variable changes, the service layer does not need to know where the original environment variable came from.

---

# Appwrite Authentication Service

The authentication logic is separated into its own service class.

File:

```text
src/

└── appwrite/

    └── Auth.js
```

The purpose of `AuthService` is to keep authentication-related Appwrite operations separate from React components.

The basic architecture is:

```text
React Component

       ↓

AuthService

       ↓

Appwrite SDK

       ↓

Appwrite Authentication
```

Instead of writing Appwrite authentication code directly inside every React component, the component can call methods provided by `AuthService`.

---

# AuthService Class

The service uses a class to group related authentication operations together.

```text
AuthService

├── createAccount()
│
├── login()
│
├── getCurrentUser()
│
└── logout()
```

This follows the principle of **separation of concerns**.

The React component handles UI and user interaction, while `AuthService` handles communication with Appwrite Authentication.

---

# Appwrite Client Setup

The Appwrite client is created inside the service:

```js
client = new Client();
```

The client is then configured inside the constructor:

```js
constructor() {

    this.client
        .setProject(Conf.appwriteProjectId)
        .setEndpoint(Conf.appwriteEndpoint);

    this.account = new Account(this.client);
}
```

The flow is:

```text
new AuthService()

       ↓

constructor runs

       ↓

Client is configured

       ↓

Project ID + Endpoint added

       ↓

Account service created

       ↓

Authentication methods can be used
```

The `Account` service receives the configured `Client`:

```js
this.account = new Account(this.client);
```

Therefore, all authentication operations performed through `this.account` use the configured Appwrite project and endpoint.

---

# Why Use a Constructor?

The constructor runs automatically when an object of the class is created.

For example:

```js
const authService = new AuthService();
```

When this line executes:

```text
new AuthService()

       ↓

constructor()

       ↓

configure Appwrite Client

       ↓

create Account service
```

This means the Appwrite setup happens automatically.

React components do not need to configure the Appwrite client every time they need authentication.

---

# Creating the AuthService Object

At the end of the service:

```js
const authService = new AuthService();

export default authService;
```

This creates one configured instance of the authentication service.

Other files can then import this instance:

```js
import authService from "../appwrite/Auth";
```

and use:

```js
authService.login(email, password);
```

without creating and configuring another Appwrite client.

---

# Account Creation Flow

The `createAccount()` method is responsible for creating a new Appwrite user.

The flow is:

```text
User enters:

Email
Password
Name

       ↓

createAccount()

       ↓

Id.unique()

       ↓

Appwrite creates user

       ↓

Account created successfully

       ↓

login()

       ↓

User gets logged in
```

The method uses:

```js
await this.account.create({
    userId: Id.unique(),
    email: email,
    password: password,
    name: name
});
```

`Id.unique()` generates a unique ID for the new user.

After successful account creation, the service automatically calls:

```js
return this.login(email, password);
```

This means the user does not need to separately log in immediately after signing up.

---

# Login Flow

The `login()` method creates an email/password session.

Conceptually:

```text
Email + Password

       ↓

login()

       ↓

Appwrite Authentication

       ↓

Email/password session

       ↓

Authenticated user
```

The Appwrite call is:

```js
const session =
    await this.account.createEmailPasswordSession({
        email: email,
        password: password
    });
```

The returned session represents the authenticated login session.

---

# Get Current User

The `getCurrentUser()` method retrieves the currently authenticated user.

```js
const user = await this.account.get();

return user;
```

The difference between login and getting the current user is:

```text
login()

→ creates an authentication session


getCurrentUser()

→ retrieves the user associated with the current session
```

This method will later be useful when the application starts and needs to determine whether a user is already logged in.

The application can then use the returned user's ID for operations such as article ownership.

---

# Logout Flow

The `logout()` method removes the user's active sessions:

```js
return await this.account.deleteSessions();
```

The flow is:

```text
Logged-in user

      ↓

logout()

      ↓

deleteSessions()

      ↓

Sessions removed

      ↓

User logged out
```

`deleteSessions()` removes the user's active sessions rather than only handling the UI state.

---

# Error Handling in AuthService

Authentication methods use `try/catch` because Appwrite requests can fail.

Example:

```js
try {

    const session =
        await this.account.createEmailPasswordSession({
            email: email,
            password: password
        });

    return session;

}
catch (error) {

    console.log(
        "error while login :: ",
        error.message
    );

    throw error;
}
```

The service logs the error and then uses:

```js
throw error;
```

to send the error back to the calling component.

This is important because the service should not decide how the UI handles every error.

The flow becomes:

```text
Appwrite error

      ↓

AuthService catch

      ↓

log error

      ↓

throw error

      ↓

React Component

      ↓

decide how to show the error
```

For example, the React component may later display an error message or toast.

This makes the authentication service more reusable across different projects.

---

# Why Throw the Error?

If the service only does:

```js
catch (error) {
    console.log(error.message);
}
```

the calling component does not receive the error.

The method would effectively return `undefined`.

Instead:

```js
catch (error) {
    console.log(error.message);
    throw error;
}
```

allows the error to travel back to the caller.

Therefore:

```text
Service Layer

→ handles/logs backend error


React Component

→ decides what user should see
```

This keeps responsibilities separated.

---

# Authentication Service Architecture

The complete authentication architecture is currently:

```text
                         React

                           |

                           v

                    AuthService

                           |

                           v

                     Appwrite SDK

                           |

                           v

                 Appwrite Authentication

                           |

                           v

                         User
```

The important idea is that React does not need to know the internal details of Appwrite authentication.

For example, the component can simply call:

```js
authService.login(email, password);
```

instead of directly handling:

```js
new Client()

setProject()

setEndpoint()

new Account()

createEmailPasswordSession()
```

This makes the service reusable and keeps the UI code cleaner.

---

# Current Project Structure

The project is currently moving toward a structure similar to:

```text
src/

│

├── conf/

│   └── Conf.js

│

├── appwrite/

│   ├── Auth.js

│   └── Config.js

│

├── components/

│

├── pages/

│

├── store/

│

├── hooks/

│

├── App.jsx

│

└── main.jsx
```

The exact structure can evolve as the project grows.

The important principle is **separation of responsibility**.

---

# Complete Backend Flow

The current backend setup can be visualized as:

```text
                       APPWRITE

                          |

        +-----------------+-----------------+

        |                 |                 |

        v                 v                 v

 Authentication      Database          Storage

        |                 |                 |

        v                 v                 v

      Users            articles        article-images

                          |

             +------------+-------------+

             |            |             |

             v            v             v

           title        content       status

             |

             +--------+

                      |

                      v

                featuredImage

                      |

                      v

                 Storage File ID
```

---

# Article Creation Flow

Eventually, when a logged-in user creates an article, the flow will be:

```text
User fills article form

          ↓

React Hook Form

          ↓

Validate form data

          ↓

Upload featured image

          ↓

Receive image/file ID

          ↓

Create article row

          ↓

Store featuredImage ID

          ↓

Store userId

          ↓

Article saved in Appwrite
```

---

# Article Reading Flow

When a visitor opens the blog:

```text
React application

       ↓

Article service

       ↓

Appwrite Database

       ↓

Query active articles

       ↓

status = true

       ↓

Article rows returned

       ↓

React renders articles
```

---

# Article Ownership Flow

When a user creates an article:

```text
Logged-in user

      ↓

Get user's Appwrite ID

      ↓

Store ID in userId

      ↓

Create article
```

Later, the application can use:

```text
userId

   ↓

identify article owner
```

This is useful for editing and deleting only the user's own articles.

---

# Important Concepts to Understand

This project is not only about building a working blog. The following concepts are important to understand:

### Frontend

* React components
* Props
* State
* Hooks
* Forms
* React Hook Form
* React Router
* Redux
* Protected routes

### Backend

* Authentication
* Authorization
* Database
* Tables
* Rows
* Columns
* Indexes
* Storage
* File IDs
* Permissions
* API requests

### JavaScript

* Promises
* `async/await`
* `try/catch`
* Objects
* Classes
* Constructors
* `this`
* Modules
* Environment variables
* Error handling
* `throw`

### Architecture

* Separation of concerns
* Service layer
* Configuration management
* Global state management
* Protected routes
* Client-server communication
* Reusable services

---

# Interview Perspective

The project should eventually be explainable as:

> "I built a blog application using React on the frontend and Appwrite as the backend service. Appwrite handles authentication, database operations, and file storage. I separated configuration from the application using environment variables and a centralized configuration file. For authentication, I created a reusable class-based service that encapsulates Appwrite's Account operations such as account creation, login, retrieving the current user, and logout. This keeps authentication logic separate from React components. Articles are stored in an Appwrite table, while featured images are stored in an Appwrite Storage bucket. Each article contains the user ID of its creator, allowing the application to associate articles with their owners. I also added indexes to fields that are frequently queried, such as status, slug, and userId."

The goal of rebuilding this project is to be able to explain **why each part exists**, not just how to write the code.

---

# Development Flow

The project will be developed in the following stages:

```text
1. Appwrite Setup

       ↓

2. Environment Configuration

       ↓

3. Appwrite Services

       ↓

4. Authentication

       ↓

5. Redux Authentication State

       ↓

6. React Router

       ↓

7. Protected Routes

       ↓

8. Article Creation

       ↓

9. Article Listing

       ↓

10. Article Editing

       ↓

11. Article Deletion

       ↓

12. Image Upload

       ↓

13. Rich Text Editor

       ↓

14. Final UI

       ↓

15. Deployment
```

---

# Learning Strategy

This project is being rebuilt instead of simply copied from a tutorial.

For each feature, the focus is:

```text
What are we doing?

        ↓

Why are we doing it?

        ↓

How does it work?

        ↓

How does data flow?

        ↓

What can go wrong?

        ↓

How would I explain it in an interview?
```

This approach is intended to build both **project experience and conceptual understanding**.
