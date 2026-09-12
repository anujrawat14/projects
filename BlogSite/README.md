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
                    |   Frontend    |
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
                    |    Appwrite   |
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
 Authentication       Database          Storage
        |                 |                 |
        v                 v                 v
      Users            articles       article-images
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
* Destructuring
* Modules
* Environment variables

### Architecture

* Separation of concerns
* Service layer
* Configuration management
* Global state management
* Protected routes
* Client-server communication

---

# Interview Perspective

The project should eventually be explainable as:

> "I built a blog application using React on the frontend and Appwrite as the backend service. Appwrite handles authentication, database operations, and file storage. I separated configuration from the application using environment variables and a centralized configuration file. Articles are stored in an Appwrite table, while featured images are stored in an Appwrite Storage bucket. Each article contains the user ID of its creator, allowing the application to associate articles with their owners. I also added indexes to fields that are frequently queried, such as status, slug, and userId."

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
