# React Context API – Login & Profile

A simple React project built to understand and practice **React Context API**, `useContext`, `useState`, and component communication.

## 🚀 Features

- User login form
- Global user state using **Context API**
- Display logged-in username
- Show/Hide profile details
- Controlled inputs using `useState`
- Tailwind CSS styling
- Component-based structure

## 🛠️ Tech Stack

- React
- JavaScript
- Tailwind CSS
- Vite
- React Context API

## 🧠 Concepts Learned

### 1. createContext()

Used to create a global context:

```js
const userContext = React.createContext();
```

### 2. Context Provider

The provider stores and shares the user data:

```jsx
<userContext.Provider value={{ user, setUser }}>
    {children}
</userContext.Provider>
```

### 3. useContext()

Components can access shared user data without passing props:

```js
const { user, setUser } = useContext(userContext);
```

### 4. Local State

`useState` is used for component-specific data such as form inputs and profile visibility:

```js
const [showDetails, setShowDetails] = useState(false);
```

## 🔄 Application Flow

```text
Login
  ↓
User enters username & password
  ↓
setUser()
  ↓
Context stores user information
  ↓
Profile receives user using useContext()
  ↓
User profile is displayed
  ↓
View Profile
  ↓
Show / Hide user details
```

## ▶️ Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local URL provided by Vite.

## 📸 Project Preview



![Home Page](./screenshots/home.png)

## 🎯 Purpose

This project was created as part of my React learning journey to understand how **Context API can be used to manage and share state between components without prop drilling**.
