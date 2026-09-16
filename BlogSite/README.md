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
# Redux Store

The **Store** is the central place where Redux keeps the application's global state.

In this project, the Store combines the different slices of the application.

## Store Structure

```text
Store
  │
  ├── auth
  │     ├── status
  │     └── userData
  │
  └── post
        └── posts
```

## Creating the Store

The Store is created using `configureStore()` from Redux Toolkit.

```js
import { configureStore } from "@reduxjs/toolkit";

import AuthSlice from "./AuthSlice";
import PostSlice from "./PostSlice";

const Store = configureStore({

    reducer: {
        auth: AuthSlice,
        post: PostSlice
    }

});

export default Store;
```

## What is happening here?

`AuthSlice` manages the authentication state:

```text
AuthSlice
    ↓
auth
```

`PostSlice` manages the posts state:

```text
PostSlice
    ↓
post
```

Both are combined inside the Store:

```text
AuthSlice ──┐
            ├──> Store
PostSlice ──┘
```

## State inside the Store

The current Redux state will look conceptually like:

```js
{
    auth: {
        status: false,
        userData: null
    },

    post: {
        posts: []
    }
}
```

Here:

* `auth` → state managed by `AuthSlice`
* `post` → state managed by `PostSlice`

## Store vs Slice

A **Slice** manages one specific part of the application state.

A **Store** combines all those slices into one central Redux state.

```text
Slice
  ↓
Manages a particular state

Store
  ↓
Combines all slices
  ↓
Contains the complete Redux state
```

## Accessing Store Data

React components can read data from the Store using:

```js
useSelector()
```

For example:

```js
const auth = useSelector((state) => state.auth);
```

Components can send actions to modify the Store using:

```js
useDispatch()
```

For example:

```js
dispatch(login({ userData }));
```

## Complete Flow

```text
React Component
      │
      ├── useSelector()
      │       ↓
      │     Store
      │
      └── useDispatch()
              ↓
           Action
              ↓
           Slice
              ↓
        Updated State
              ↓
            Store
```

### Important Concept

> **Slice manages a particular part of the state, while Store combines all the slices into one central Redux state.**

# Redux Store in App.jsx

Redux is used to manage shared application state.

In this project, the store contains two main parts:

```text
Redux Store
    |
    +── auth
    |     └── AuthSlice
    |
    └── post
          └── PostSlice
```

The store is created using `configureStore()`:

```js
const Store = configureStore({
    reducer: {
        auth: AuthSlice,
        post: PostSlice
    }
});
```

The `auth` state is managed by `AuthSlice`, while the `post` state is managed by `PostSlice`.

---

## Connecting Redux Store to React

The Redux store needs to be connected to the React application using `Provider`.

This is usually done in `main.jsx`:

```js
import { Provider } from "react-redux";
import Store from "./store/Store";

<Provider store={Store}>
    <App />
</Provider>
```

`Provider` makes the Redux store available to all React components inside it.

Conceptually:

```text
main.jsx
    |
    v
Provider
    |
    |── Redux Store
    |
    v
App.jsx
    |
    +── Header
    +── Outlet
    +── Footer
```

Because `App` is inside the `Provider`, it can use Redux hooks such as:

```js
useDispatch()
useSelector()
```

---

## Using Redux in App.jsx

`App.jsx` uses `useDispatch()` to send authentication actions to Redux.

```js
const dispatch = useDispatch();
```

When the application starts, `App.jsx` checks whether a user is already logged in:

```js
authService.getCurrentUser()
    .then((userData) => {

        if (userData) {
            dispatch(login({ userData }));
        }
        else {
            dispatch(logout());
        }

    })
    .finally(() => setLoading(false));
```

The flow is:

```text
App.jsx
   |
   v
getCurrentUser()
   |
   v
Does user exist?
   |
   +──── YES ────> dispatch(login())
   |
   +──── NO ─────> dispatch(logout())
                         |
                         v
                    Redux Store
```

The important concept is that `App.jsx` does not directly change the Redux state.

It sends an **action** using `dispatch()`.

```text
Component
    |
    | dispatch(login(...))
    v
AuthSlice reducer
    |
    v
Redux Store
    |
    v
Updated auth state
```

---

## Why App.jsx Checks the User

When the application starts, Redux initially contains:

```js
{
    auth: {
        status: false,
        userData: null
    }
}
```

But this does not automatically tell us whether an existing Appwrite session exists.

Therefore, `App.jsx` asks Appwrite:

```js
authService.getCurrentUser()
```

If Appwrite returns a user:

```text
App starts
   ↓
Check Appwrite session
   ↓
User found
   ↓
dispatch(login())
   ↓
Redux auth.status = true
```

If Appwrite does not return a user:

```text
App starts
   ↓
Check Appwrite session
   ↓
No user found
   ↓
dispatch(logout())
   ↓
Redux auth.status = false
```

This connects the **real authentication state from Appwrite** with the **application state stored in Redux**.

---

## Role of Loading State

`loading` is local React state:

```js
const [loading, setLoading] = useState(true);
```

It is not necessary to put this in Redux because it is only being used by `App.jsx`.

The flow is:

```text
loading = true
      ↓
Check current Appwrite user
      ↓
Dispatch login/logout
      ↓
setLoading(false)
      ↓
Render application
```

This prevents the application from rendering its normal content before the initial authentication check has completed.

---

## Important Difference

```text
Appwrite
   ↓
Actual authentication/session
```

while:

```text
Redux
   ↓
Application's shared authentication state
```

So Appwrite is the source for checking the user's actual session, while Redux keeps the user information available to React components throughout the application.


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

|   ├── Bucket.js 

│   └── Config.js

│

├── components/

│

├── pages/

│

├── store/
│   ├── Store.js

│   └── AuthSlice.js

│   └── PostSlice.js

├── hooks/

│

├── App.jsx

│

└── main.jsx
```

The exact structure can evolve as the project grows.

The important principle is **separation of responsibility**.

---
# Reusable Components

Since the application is component-based, common UI elements are created as reusable components. This avoids repeating the same code and styling throughout the application.

## Container Component

The `Container` component provides a common wrapper for controlling width, spacing, and alignment of page content.

```jsx
const Container = ({ children }) => {
    return (
        <div className="w-full mx-auto px-4">
            {children}
        </div>
    )
}
```

### Why use it?

Instead of repeating the same layout classes throughout the application, we can reuse:

```jsx
<Container>
    <h1>Blog Posts</h1>
</Container>
```

`children` represents whatever content is placed inside the `Container`.

---

## Button Component

The `Button` component is a reusable button with common Tailwind CSS styling.

```jsx
const Button = ({
    text,
    type = "button",
    bgColor = "bg-blue-400",
    textColor = "text-white",
    className = "",
    ...props
}) => {
    return (
        <button
            type={type}
            {...props}
            className={`px-4 py-2 rounded-lg ${className} ${bgColor} ${textColor}`}
        >
            {text}
        </button>
    )
}
```

### Why use it?

```jsx
<Button text="Login" />
```

It can also be customized using props:

```jsx
<Button
    text="Delete"
    bgColor="bg-red-500"
/>
```

`...props` allows other button properties such as `onClick` and `disabled` to be passed to the actual button.

---

## Input Component

The `Input` component is a reusable input field with common styling and an optional label.

```jsx
const Input = ({
    ref,
    label,
    type = "text",
    className = "",
    ...props
}) => {
    const id = useId();

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id}>
                    {label}
                </label>
            )}

            <input
                ref={ref}
                id={id}
                type={type}
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
                {...props}
            />
        </div>
    )
}
```

### Why use it?

Forms such as Login, Signup, and Create Article require multiple input fields. Instead of repeating the same styling and structure, we can reuse:

```jsx
<Input
    label="Email"
    type="email"
    placeholder="Enter your email"
/>
```

Important props:

* `label` → displays the input label
* `type` → defines the input type
* `className` → allows additional styling
* `ref` → allows access to the input element
* `...props` → passes other HTML input properties

## Select Component

The `Select` component is a reusable dropdown with common styling, an optional label, and dynamic options.

```jsx
import React, { useId } from 'react'

const Select = ({
    ref,
    options,
    label,
    className = "",
    ...props
}) => {

    const id = useId();

    return (
        <div className="w-full">

            {label && (
                <label htmlFor={id}>
                    {label}
                </label>
            )}

            <select
                ref={ref}
                id={id}
                {...props}
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
            >
                {options?.map((option) => (
                    <option value={option} key={option}>
                        {option}
                    </option>
                ))}
            </select>

        </div>
    )
}

export default Select
```

### Why use it?

Instead of creating the same `<select>` styling repeatedly, we can reuse:

```jsx
<Select
    label="Category"
    options={["Technology", "Travel", "Education"]}
/>
```

Important props:

* `options` → provides the dropdown options
* `label` → displays the select label
* `className` → allows additional styling
* `ref` → allows access to the select element
* `...props` → passes other HTML select properties

## Login and Signup Components

### Login Component

The `Login` component handles user login using React Hook Form, Appwrite Auth, and Redux.

### Flow

```text
User submits Login form
        ↓
React Hook Form validates data
        ↓
authService.login(data)
        ↓
authService.getCurrentUser()
        ↓
dispatch(authLogin(userData))
        ↓
navigate("/")
```

* `useForm()` handles form data and validation.
* `authService.login()` creates the login session using Appwrite.
* `getCurrentUser()` gets the logged-in user's data.
* `authLogin()` stores the user in Redux.
* `navigate("/")` redirects the user to the home page.
* Appwrite errors are stored in `error` state and displayed to the user.

---

### Signup Component

The `Signup` component handles new user registration using React Hook Form, Appwrite Auth, and Redux.

### Flow

```text
User submits Signup form
        ↓
React Hook Form validates data
        ↓
authService.createAccount(data)
        ↓
authService.getCurrentUser()
        ↓
dispatch(authLogin(currentUser))
        ↓
navigate("/")
```

* `useForm()` handles form data and validation.
* `authService.createAccount()` creates the user account and logs the user in.
* `getCurrentUser()` gets the newly created user's data.
* `authLogin()` stores the user in Redux.
* `navigate("/")` redirects the user to the home page.
* Appwrite errors are handled using the `error` state.


## AuthLayout Component

The `AuthLayout` component handles authentication-based route protection in one place. It checks the user's authentication status from Redux and redirects the user based on the route requirements.

### Flow

```text id="f3m8q2"
Check authentication status from Redux
        ↓
Is authentication required?
        ↓
   ┌────┴────┐
  Yes       No
   ↓         ↓
Not logged  Already logged
   ↓         ↓
 /login       /
```

* `authentication = true` → page requires the user to be logged in.
* `authentication = false` → page is for unauthenticated users, such as Login and Signup.
* `authStatus` is obtained from the Redux store.
* `navigate()` redirects the user when the authentication condition is not satisfied.
* `loader` prevents the page from rendering until the authentication check is completed.

### Example

```jsx
<Protected authentication={true}>
    <Home />
</Protected>
```

Protected page → unauthenticated user is redirected to `/login`.

```jsx
<Protected authentication={false}>
    <Login />
</Protected>
```

Guest-only page → authenticated user is redirected to `/`.


# PostForm, PostSlice and RTE

## PostForm Component

The `PostForm` component is used for both **creating and updating blog posts**.

It handles:

* Post title
* Slug generation
* Content using TinyMCE RTE
* Featured image upload
* Post status
* Creating posts
* Updating posts
* Updating Redux state after successful operations

---

## PostForm Flow

### Create Post

```text
User fills PostForm
        ↓
React Hook Form
        ↓
Upload featured image
        ↓
database.createPost()
        ↓
Appwrite creates post
        ↓
dispatch(addPost(dbPost))
        ↓
navigate to post
```

### Update Post

```text
User edits PostForm
        ↓
React Hook Form
        ↓
Upload new image if selected
        ↓
Delete old image
        ↓
database.updatePost()
        ↓
Appwrite updates post
        ↓
dispatch(updatePost(dbPost))
        ↓
navigate to post
```

---

# PostSlice

`PostSlice` manages the posts on the client side using Redux Toolkit.

```jsx
const initialState = {
    posts: []
};
```

It contains three main reducers:

### addPost

Used after successfully creating a post.

```jsx
addPost: (state, action) => {
    state.posts.push(action.payload);
}
```

### updatePost

Used after successfully updating a post.

```jsx
updatePost: (state, action) => {

    const index = state.posts.findIndex(
        (post) => post.$id === action.payload.$id
    );

    if (index !== -1) {
        state.posts[index] = action.payload;
    }
}
```

### removePost

Used after successfully deleting a post.

```jsx
removePost: (state, action) => {

    state.posts = state.posts.filter(
        (post) => post.$id !== action.payload
    );

}
```

---

## PostSlice in PostForm

Import the actions:

```jsx
import {
    addPost,
    updatePost
} from "../../store/PostSlice";
```

Get `dispatch`:

```jsx
const dispatch = useDispatch();
```

After creating a post:

```jsx
const dbPost = await database.createPost({
    ...data,
    userId: userData.$id
});

if (dbPost) {

    dispatch(addPost(dbPost));

    navigate(`/post/${dbPost.$id}`);
}
```

After updating a post:

```jsx
const dbPost = await database.updatePost(post.$id, {
    ...data,
    featuredImage: file
        ? file.$id
        : post.featuredImage
});

if (dbPost) {

    dispatch(updatePost(dbPost));

    navigate(`/post/${dbPost.$id}`);
}
```

### Important Concept

Redux is **not the permanent database**.

```text
Appwrite
   ↓
Permanent backend data

Redux
   ↓
Client-side state/cache
```

Appwrite remains the source of truth, while Redux keeps the post data available to different React components.

---

# AuthSlice and PostForm

The `AuthSlice` stores information about the currently logged-in user.

```jsx
const initialState = {
    status: false,
    userData: null
};
```

After login:

```jsx
login: (state, action) => {

    state.status = true;

    state.userData = action.payload;

}
```

Therefore, in `PostForm` we can get the current user using:

```jsx
const userData = useSelector(
    (state) => state.auth.userData
);
```

Then while creating a post:

```jsx
userId: userData.$id
```

This connects the post with the user who created it.

---

# RTE Component

`RTE` stands for **Rich Text Editor**.

This project uses **TinyMCE** as the rich text editor.

The editor allows users to create formatted content instead of entering plain text.

For example, users can use:

* Bold
* Italic
* Lists
* Images
* Links
* Text alignment
* Headings
* Tables

---

## RTE Component

```jsx
import React from 'react'
import { Editor } from "@tinymce/tinymce-react"
import { Controller } from "react-hook-form"

function RTE({
    name,
    control,
    label,
    defaultValue = ""
}) {

    return (

        <div className='w-full'>

            {label && (
                <label className='inline-block mb-1 pl-1'>
                    {label}
                </label>
            )}

            <Controller
                name={name || "Content"}
                control={control}

                render={({ field: { onChange } }) => (

                    <Editor
                        initialValue={defaultValue}

                        init={{
                            height: 500,

                            plugins: [
                                "image",
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "charmap",
                                "preview",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "media",
                                "table",
                                "help",
                                "wordcount"
                            ],

                            toolbar:
                                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",

                            content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
                        }}

                        onEditorChange={onChange}
                    />

                )}
            />

        </div>
    )
}

export default RTE
```

---

# Why Controller is Used?

Normally, React Hook Form can register native inputs directly:

```jsx
<Input {...register("title")} />
```

But TinyMCE is a **third-party controlled component**.

Therefore, `register()` is not directly suitable for it.

`Controller` acts as a bridge between **React Hook Form** and **TinyMCE**.

```text
TinyMCE
   ↓
onEditorChange
   ↓
Controller
   ↓
React Hook Form
   ↓
form data
```

The important part is:

```jsx
<Controller
    name={name}
    control={control}
    render={({ field: { onChange } }) => (
        <Editor
            onEditorChange={onChange}
        />
    )}
/>
```

When the editor content changes:

```jsx
onEditorChange
```

calls:

```jsx
onChange
```

and React Hook Form receives the updated content.

---

# Using RTE in PostForm

First, get `control` from `useForm()`:

```jsx
const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue
} = useForm();
```

Then pass it to `RTE`:

```jsx
<RTE
    label="Content :"
    name="content"
    control={control}
    defaultValue={getValues("content")}
/>
```

Here:

* `name` → name of the form field
* `control` → React Hook Form control object
* `label` → label displayed above editor
* `defaultValue` → initial content when editing an existing post

---

# Slug Generation

The `PostForm` automatically generates a slug from the title.

Example:

```text
My First Blog Post
        ↓
my-first-blog-post
```

The transformation is handled by:

```jsx
const slugTransform = useCallback((value) => {

    if (value && typeof value === "string")

        return value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, "-")
            .replace(/\s/g, "-");

    return "";

}, []);
```

The `watch()` subscription watches the title:

```jsx
const subscription = watch((value, { name }) => {

    if (name === "title") {

        setValue(
            "slug",
            slugTransform(value.title),
            { shouldValidate: true }
        );

    }

});
```

So whenever the title changes, the slug is automatically updated.

The user can also manually edit the slug because the slug field itself is registered with React Hook Form.

---

# Overall Data Flow

```text
                    ┌───────────────┐
                    │    PostForm   │
                    └───────┬───────┘
                            │
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
        React Hook      TinyMCE RTE     Featured Image
           Form              │              │
             │               │              │
             └───────────────┼──────────────┘
                             ↓
                      Appwrite Service
                             ↓
                    ┌────────┴────────┐
                    ↓                 ↓
                 Create             Update
                    ↓                 ↓
                    └────────┬────────┘
                             ↓
                          Appwrite
                             ↓
                         dbPost
                             ↓
                    ┌────────┴────────┐
                    ↓                 ↓
              addPost()          updatePost()
                    ↓                 ↓
                    └────────┬────────┘
                             ↓
                        PostSlice
                             ↓
                       Redux Store
```

## Main Responsibility

```text
AuthSlice
    → Stores logged-in user

PostSlice
    → Stores posts on client side

PostForm
    → Handles create/update form

RTE
    → Handles rich text content

Database Service
    → Communicates with Appwrite TablesDB

Bucket Service
    → Handles featured images

Appwrite
    → Permanent backend storage
```


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
