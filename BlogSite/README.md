# BlogSite

A full-stack blog application built with **React and Appwrite**.
The project allows users to create accounts, authenticate, create and manage blog posts, upload featured images, and view published articles.

The project was rebuilt from scratch to understand the complete flow between the **React frontend, service layer, Redux state, and Appwrite backend** rather than simply following a tutorial.

---

## Features

* User Signup and Login
* User Logout
* Persistent authentication state
* Protected routes
* Create blog posts
* Edit blog posts
* Delete blog posts
* View all published posts
* View individual blog posts
* Upload featured images
* Update featured images
* User-based post ownership
* Rich text editor for blog content
* Slug generation for posts
* Form validation
* Global state management using Redux Toolkit
* Responsive UI using Tailwind CSS

---

## Tech Stack

### Frontend

* React
* Vite
* React Router
* React Hook Form
* Redux Toolkit
* Tailwind CSS
* TinyMCE

### Backend / BaaS

* Appwrite Authentication
* Appwrite TablesDB
* Appwrite Storage

---

## Architecture

The application follows a service-based architecture.

```text
React Components
       ↓
Service Layer
       ↓
Appwrite SDK
       ↓
Appwrite Backend
```

The main backend responsibilities are separated into services:

```text
AuthService
    ↓
Authentication

DatabaseService
    ↓
Articles / Posts

BucketService
    ↓
Featured Images
```

This keeps Appwrite-specific code outside most React components.

---

## Project Structure

```text
src/
│
├── appwrite/
│   ├── Auth.js
│   ├── Database.js
│   └── Bucket.js
│
├── components/
│   ├── Container/
│   ├── Header/
│   ├── Footer/
│   ├── Button/
│   ├── Input/
│   ├── Select/
│   ├── RTE/
│   ├── PostCard/
│   └── PostForm/
│
├── conf/
│   └── Conf.js
│
├── hooks/
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── AllPosts.jsx
│   ├── AddPost.jsx
│   └── Post.jsx
│
├── store/
│   ├── Store.js
│   ├── AuthSlice.js
│   └── PostSlice.js
│
├── App.jsx
└── main.jsx
```

---

## Appwrite Setup

The project uses three main Appwrite services:

### 1. Authentication

Appwrite Authentication is responsible for:

* Creating users
* Logging users in
* Getting the current user
* Logging users out

```text
User
 ↓
Appwrite Authentication
 ↓
Authenticated Session
 ↓
Current User
```

---

### 2. Database

An Appwrite table named:

```text
articles
```

is used to store blog post information.

### Article Fields

| Field           | Type       | Required | Purpose                 |
| --------------- | ---------- | -------- | ----------------------- |
| `title`         | varchar    | Yes      | Blog title              |
| `slug`          | varchar    | Yes      | URL-friendly identifier |
| `content`       | mediumtext | Yes      | Blog content            |
| `featuredImage` | varchar    | No       | Storage file ID         |
| `status`        | boolean    | Yes      | Published/unpublished   |
| `userId`        | varchar    | Yes      | ID of post creator      |

Appwrite also provides system fields such as:

```text
$id
$createdAt
$updatedAt
```

---

### 3. Storage

A storage bucket named:

```text
article-images
```

stores the actual featured image files.

The database does **not** store the image itself.

Instead:

```text
Image
 ↓
Appwrite Storage
 ↓
File ID
 ↓
articles.featuredImage
```

This keeps the article table lightweight while allowing the image to be retrieved when required.

---

## Image Flow

The complete image flow is:

```text
User selects image
       ↓
PostForm
       ↓
BucketService.uploadFile()
       ↓
Appwrite Storage
       ↓
File ID returned
       ↓
File ID saved in article
       ↓
PostCard receives featuredImage
       ↓
BucketService.getFileView()
       ↓
Image URL
       ↓
<img src={imageUrl} />
```

The project uses `getFileView()` to display the original stored file.

`getFilePreview()` was avoided because image transformations can be restricted depending on the Appwrite plan.

---

## Authentication Flow

When the application starts:

```text
App starts
   ↓
getCurrentUser()
   ↓
Is user authenticated?
   ├── Yes
   │    ↓
   │  Redux login()
   │    ↓
   │  Store user data
   │
   └── No
        ↓
      Redux logout()
```

A local loading state prevents the application from rendering protected content before authentication has been checked.

---

## Signup Flow

```text
Signup Form
    ↓
AuthService.createAccount()
    ↓
Appwrite creates user
    ↓
AuthService.login()
    ↓
Session created
    ↓
Redux authentication state
    ↓
Application
```

---

## Login Flow

```text
Login Form
    ↓
AuthService.login()
    ↓
createEmailPasswordSession()
    ↓
Appwrite session
    ↓
Redux login()
    ↓
Authenticated application
```

---

## Logout Flow

```text
Logout Button
    ↓
AuthService.logout()
    ↓
deleteSessions()
    ↓
Redux logout()
    ↓
User becomes unauthenticated
```

---

## Redux State Management

Redux Toolkit is used for client-side application state.

The store contains separate slices:

```text
Redux Store
│
├── auth
│   ├── status
│   └── userData
│
└── post
    └── posts
```

Example:

```js
{
    auth: {
        status: true,
        userData: {...}
    },

    post: {
        posts: [...]
    }
}
```

### Important

Redux is **not the permanent database**.

```text
Appwrite
   ↓
Source of Truth

Redux
   ↓
Client-side State / Cache
```

If the page is refreshed, data can be fetched again from Appwrite.

---

## Route Protection

The application uses an `AuthLayout` component to protect routes.

Two types of routes are handled:

### Authentication Required

Example:

```text
/add-post
```

Only authenticated users can access it.

```text
User
 ↓
AuthLayout
 ↓
Is authenticated?
 ├── Yes → Page
 └── No  → /login
```

### Guest Only

Example:

```text
/login
/signup
```

Authenticated users can be redirected away from these pages.

---

## Post Creation Flow

```text
PostForm
    ↓
React Hook Form
    ↓
Validate form
    ↓
Upload featured image
    ↓
Receive file ID
    ↓
Create article row
    ↓
Appwrite TablesDB
    ↓
Article created
    ↓
Redux updated
    ↓
Navigate to post
```

The article stores:

```text
featuredImage = file ID
userId = current user's ID
```

This connects the post with both its image and creator.

---

## Post Update Flow

```text
Edit Post
    ↓
PostForm
    ↓
Update form data
    ↓
Upload new image if required
    ↓
Update article row
    ↓
Redux updatePost()
    ↓
Navigate to updated post
```

---

## Post Ownership

Each article contains:

```text
userId
```

The value is taken from the authenticated user's Appwrite ID:

```js
userId: userData.$id
```

This allows the application to identify who created the article.

Conceptually:

```text
Authenticated User
       ↓
      $id
       ↓
Article.userId
```

---

## Slug Generation

A slug converts a title into a URL-friendly value.

Example:

```text
My First Blog Post
        ↓
my-first-blog-post
```

The slug is useful for identifying posts through URLs and can be indexed for efficient lookup.

---

## Rich Text Editor

TinyMCE is used for writing blog content.

Because TinyMCE is a third-party controlled component, React Hook Form's `Controller` is used to connect it with the form.

```text
TinyMCE
   ↓
onEditorChange
   ↓
Controller
   ↓
React Hook Form
   ↓
Form Data
```

---

## Database Indexes

The following indexes are used:

```text
status_index
slug_index
userId_index
```

They improve query performance for common operations such as:

* Finding published posts
* Finding a post by slug
* Finding posts belonging to a user

---

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
VITE_APPWRITE_ENDPOINT=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=
VITE_APPWRITE_TABLE_ID=
VITE_APPWRITE_BUCKET_ID=
VITE_TINYMCE_API_KEY=
```

These values are loaded through Vite and centralized in:

```text
src/conf/Conf.js
```

### Important

Variables beginning with `VITE_` are exposed to the frontend bundle.

Therefore, **do not put private server-side secrets in `VITE_*` variables**.

Use them for client-side configuration such as Appwrite IDs and endpoints.

---

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Move into the project:

```bash
cd BlogSite
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```text
.env
```

Add the required Appwrite configuration.

Start the development server:

```bash
npm run dev
```

---

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates the production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs the project's linting checks.

---

## Debugging Lessons

During development, several real-world issues were encountered and fixed.

### 1. Boolean Status Error

Appwrite expected:

```js
true
```

but the form initially produced a string:

```js
"true"
```

The value was converted using React Hook Form:

```js
setValueAs: (value) => value === "true"
```

Therefore:

```text
"true"  → true
"false" → false
```

---

### 2. PostCard Props

When the component expects individual properties:

```js
const PostCard = ({ $id, title, featuredImage }) => {}
```

the post object should be spread:

```jsx
<PostCard {...post} />
```

rather than:

```jsx
<PostCard post={post} />
```

unless the component is specifically written to receive a `post` prop.

---

### 3. Appwrite Method Mismatch

Calling:

```js
bucket.getFilePreview()
```

when the service exposed:

```js
getFileView()
```

caused:

```text
TypeError:
bucket.getFilePreview is not a function
```

This was a JavaScript method mismatch, not a routing problem.

---

### 4. Image Transformation Restriction

`getFilePreview()` returned an Appwrite error because image transformations were restricted on the current plan.

For displaying the original image:

```js
getFileView()
```

was used instead.

---

### 5. Storage Permission Error

An image request returned a `401` because the current role did not have the required read permission.

This demonstrated that:

```text
Image URL exists
        ≠
Image is accessible
```

The Storage bucket permissions must also allow the required user/guest role to read the file.

---

### 6. Browser ORB Error

The browser displayed:

```text
net::ERR_BLOCKED_BY_ORB
```

This can occur when the browser expects an image but the server returns another response, such as a JSON error.

Therefore, when debugging image loading:

```text
Don't immediately blame React/CSS.
        ↓
Open Network
        ↓
Check status code
        ↓
Check response body
        ↓
Find actual Appwrite error
```

---

### 7. Route Mismatch

These are different routes:

```text
/all-post
/all-posts
```

If navigation uses:

```js
navigate("/all-posts")
```

the router must contain:

```js
path: "/all-posts"
```

A route path and navigation URL must match exactly.

---

### 8. Authentication Redirect Bug

A protected page can briefly appear and then disappear if the authentication condition is incorrect.

The correct debugging approach was:

```text
Page appears
    ↓
Page disappears
    ↓
Check whether component unmounted
    ↓
Check parent/AuthLayout
    ↓
Check authentication state
    ↓
Check redirect condition
```

This showed that the problem was the authentication redirect, not the page component itself.

---

## General Debugging Approach

When something breaks, follow this order:

```text
1. Identify the symptom
        ↓
2. Find exactly where it fails
        ↓
3. Check whether the component renders
        ↓
4. Check whether it mounts/unmounts
        ↓
5. Check props
        ↓
6. Check state
        ↓
7. Check route
        ↓
8. Check service/API call
        ↓
9. Check Network response
        ↓
10. Fix the smallest actual problem
        ↓
11. Retest the complete flow
```

For image-related problems:

```text
File selected?
    ↓
Upload successful?
    ↓
File ID returned?
    ↓
File ID stored in database?
    ↓
PostCard receives File ID?
    ↓
getFileView() returns URL?
    ↓
Browser requests URL?
    ↓
Appwrite returns image?
    ↓
Image displayed?
```

---

## HTTP / Network Debugging

When debugging API or storage requests, check the HTTP status.

| Status | Meaning                           |
| ------ | --------------------------------- |
| `200`  | Request succeeded                 |
| `401`  | Authentication / permission issue |
| `403`  | Request/feature forbidden         |
| `404`  | Resource not found                |
| `500`  | Server-side error                 |

Always inspect the **response body** because it often explains the actual Appwrite problem.

---

## Why Use a Service Layer?

Instead of directly writing Appwrite SDK code inside every React component:

```text
React Component
      ↓
AuthService
      ↓
Appwrite
```

For example:

```js
authService.login(email, password)
```

The component does not need to know the internal Appwrite implementation.

Benefits:

* Separation of concerns
* Reusable backend operations
* Cleaner components
* Easier debugging
* Easier maintenance
* Easier replacement of backend logic

---

## Why Use Redux?

Redux is useful for application-wide client state.

For example, authentication information may be needed by:

```text
Header
Protected Routes
Profile
PostForm
Other Components
```

Instead of passing user information through many components:

```text
Parent
 ↓
Child
 ↓
Grandchild
```

Redux provides a central state:

```text
             Redux Store
            /     |      \
         Header  Router  PostForm
```

---

## Why Use Appwrite Storage?

Images are binary files and should not be stored directly inside the article record.

Instead:

```text
Database
    ↓
Stores metadata + file ID

Storage
    ↓
Stores actual file
```

This separates structured data from file storage.

---

## Security Model

The application has two separate concepts:

### Authentication

Answers:

> Who is the user?

Handled by:

```text
Appwrite Authentication
```

### Authorization

Answers:

> What is the user allowed to do?

Handled through:

```text
Appwrite Permissions
```

These are different concepts.

A user can be authenticated but still not have permission to access a particular resource.

---

## Important Concepts Learned

This project helped demonstrate:

* Component-based architecture
* Service-layer architecture
* React state management
* Redux Toolkit
* Authentication
* Authorization
* Protected routes
* Form handling
* Controlled components
* Third-party component integration
* File uploads
* Database relationships through IDs
* Storage permissions
* Environment configuration
* API debugging
* Network debugging
* Error propagation
* CRUD operations
* Client-side state vs backend persistence

---

## Complete Application Flow

```text
                    Appwrite
                       ↑
                       |
                Appwrite SDK
                       ↑
                       |
                Service Layer
                 /     |      \
              Auth   Database  Storage
                ↑       ↑        ↑
                |       |        |
                +-------+--------+
                        |
                     React
                        |
        +---------------+---------------+
        |               |               |
      Router          Redux          Components
        |               |               |
   AuthLayout       Auth/Post       PostForm
        |                               |
     Pages                              |
        |                               |
        +-------------------------------+
```

### Article Flow

```text
User
 ↓
PostForm
 ↓
React Hook Form
 ↓
Upload Image
 ↓
Storage
 ↓
File ID
 ↓
Database
 ↓
Article Row
 ↓
Redux
 ↓
AllPosts
 ↓
PostCard
 ↓
getFileView()
 ↓
Image
```

---

## Future Improvements

Possible improvements for a larger production application could include:

* Better error UI
* Toast notifications
* Pagination
* Search
* Comments
* Categories/tags
* Richer user profiles
* Server-side validation
* Automated testing
* More granular permissions

These are intentionally outside the current project scope.

---

## Project Purpose

This project was built not only to create a blog application but also to understand how a modern React application communicates with a backend service.

The main learning flow was:

```text
React
 ↓
Service Layer
 ↓
Appwrite SDK
 ↓
Authentication / Database / Storage
```

The project also provided practical experience with debugging issues involving:

* React rendering
* Props
* Routing
* Authentication
* Redux state
* Appwrite permissions
* Storage
* Network requests
* Form data types
* Third-party components

---

## Author

**Anuj Rawat**

B.Tech CSE Student

GitHub: `@anujrawat14`
