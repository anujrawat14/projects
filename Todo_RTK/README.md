# 📝 React + Redux Toolkit Todo Project Guide

A complete, beginner-friendly guide to understanding and building a Todo application using **React** and **Redux Toolkit (RTK)**.

---

## 🧠 Redux Toolkit Concepts

### 1. `createSlice`
`createSlice()` is a standard Redux Toolkit utility function that automatically generates action creators and action types that correspond to the reducers and state.

```javascript
import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    todos: [{ id: 1, text: "hello" }]
};

export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodo: (state, action) => {
            const todo = {
                id: nanoid(),
                text: action.payload
            };
            state.todos.push(todo);
        },
        removeTodo: (state, action) => {
            state.todos = state.todos.filter(
                (elem) => elem.id !== action.payload
            );
        },
        updateTodo: (state, action) => {
            state.todos = state.todos.map((elem) =>
                elem.id === action.payload.id
                    ? { ...elem, text: action.payload.text }
                    : elem
            );
        }
    }
});
```

---

### 🔑 2. `nanoid`
`nanoid()` is a lightweight utility built into Redux Toolkit to generate non-sequential, cryptographically strong, unique IDs for newly created items.

```javascript
id: nanoid()
```

**Example output:**
- `todo 1` → `id: "V1StGXR8_Z5jdHi6B-myT"`
- `todo 2` → `id: "clp9K2xY7..."`

---

### 🔍 3. `useSelector`
`useSelector` is a React-Redux hook used to extract and read slices of state from the global Redux store.

```javascript
const todos = useSelector(state => state.todos);
```

> **Note:** Here, `todos` contains the array of todo items currently held in the Redux store.

---

### 🚀 4. `useDispatch`
`useDispatch` is a React-Redux hook that returns a reference to the `dispatch` function from the Redux store, enabling components to send actions.

```javascript
const dispatch = useDispatch();
```

**Example:**
```javascript
dispatch(removeTodo(todo.id));
```

---

## 🔄 Todo Operations

### ➕ Add Todo
The component dispatches the text entered by the user:

```javascript
dispatch(addTodo(text));
```

1. The reducer receives the text through `action.payload`.
2. A new todo object is created:
   ```javascript
   const todo = {
       id: nanoid(),
       text: action.payload
   };
   ```
3. The new item is appended to the list:
   ```javascript
   state.todos.push(todo);
   ```

---

### 🗑️ Remove Todo
The component passes the unique ID of the target todo:

```javascript
dispatch(removeTodo(todo.id));
```

1. The reducer accesses the ID via `action.payload`.
2. The matching todo is filtered out:
   ```javascript
   state.todos = state.todos.filter(
       (elem) => elem.id !== action.payload
   );
   ```

---

### ✏️ Update Todo
For updating existing todo text, the payload contains both the `id` and the updated `text`:

```javascript
dispatch(
    updateTodo({
        id: todo.id,
        text: editText
    })
);
```

The reducer iterates and updates only the matched item:
```javascript
state.todos = state.todos.map((elem) =>
    elem.id === action.payload.id
        ? { ...elem, text: action.payload.text }
        : elem
);
```
*(The ID remains constant while the text content is replaced.)*

---

## 📝 Edit Todo Flow

```text
Click "Update"
      ↓
Todo enters edit mode
      ↓
Input box appears
      ↓
User changes text
      ↓
Click "Save"
      ↓
updateTodo() dispatched
      ↓
Redux state updated
      ↓
Updated todo renders on screen
```

### Visual Example:

- **Initial State:**
  ```text
  Learn React                 [ Update ]   [ Delete ]
  ```

- **After clicking "Update":**
  ```text
  [ Learn React             ] [ Save ]
  ```

- **After editing text:**
  ```text
  [ Learn Redux Toolkit     ] [ Save ]
  ```

- **After clicking "Save":**
  ```text
  Learn Redux Toolkit         [ Update ]   [ Delete ]
  ```

---

## 🏪 Redux Store Configuration

Create and configure your central store using `configureStore`:

```javascript
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../features/Todo/TodoSlice";

export const store = configureStore({
    reducer: {
        todos: todoReducer
    }
});
```

---

## 🌐 Redux Provider Setup

Wrap your root React component tree inside `<Provider>` and pass the store:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App />
    </Provider>
);
```

> The `<Provider>` component makes the store instance available to any nested components that need to access it.

---

## 🔁 Redux Data Flow

```text
Component
    ↓
dispatch(action)
    ↓
Reducer
    ↓
Redux Store
    ↓
useSelector()
    ↓
Component re-renders
```

### Step-by-Step Example (Deleting a Todo):
```text
User clicks Delete
       ↓
dispatch(removeTodo(id))
       ↓
removeTodo reducer executed
       ↓
Redux store updates state
       ↓
useSelector receives fresh state
       ↓
Todo UI re-renders with item removed
```

---

## 📌 Core Terminology

### 1. `state`
The current data snapshot managed in Redux.
```javascript
state = {
    todos: [
        {
            id: 1,
            text: "Learn Redux"
        }
    ]
};
```

### 2. `action`
A plain JavaScript object describing what happened.
```javascript
// Dispatched from UI:
dispatch(removeTodo(5));
```

### 3. `action.payload`
The actual data/argument sent along with the dispatched action.

- For deletion: `action.payload` is `5`
- For updates:
  ```javascript
  dispatch(
      updateTodo({
          id: 5,
          text: "Learn Redux Toolkit"
      })
  );
  ```
  `action.payload` is:
  ```javascript
  {
      id: 5,
      text: "Learn Redux Toolkit"
  }
  ```

---

## 🧩 Redux Toolkit Slice Architecture

```text
createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodo: () => {},
        removeTodo: () => {},
        updateTodo: () => {}
    }
})
```

```text
Slice
 ├── name
 ├── initialState
 └── reducers
       ├── addTodo
       ├── removeTodo
       └── updateTodo
```

### 📤 Exporting Actions
```javascript
export const {
    addTodo,
    removeTodo,
    updateTodo
} = todoSlice.actions;
```

Import them into components as needed:
```javascript
import {
    addTodo,
    removeTodo,
    updateTodo
} from "../features/Todo/TodoSlice";
```

### 📤 Exporting Reducer
```javascript
export default todoSlice.reducer;
```

---

## 📦 Installation & Setup

1. **Create a React project using Vite:**
   ```bash
   npm create vite@latest redux-todo
   ```

2. **Navigate into the folder and install dependencies:**
   ```bash
   cd redux-todo
   npm install
   ```

3. **Install Redux Toolkit and React Redux:**
   ```bash
   npm install @reduxjs/toolkit react-redux
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 🎯 Learning Goals

- [x] Understanding `createSlice` and slice architecture
- [x] Setting up a global store using `configureStore`
- [x] Supplying store state via `<Provider>`
- [x] Reading state with `useSelector`
- [x] Dispatching actions with `useDispatch`
- [x] Generating unique IDs with `nanoid`
- [x] Performing CRUD operations (Add, Remove, Update) in Redux Toolkit
- [x] Mastering unidirectional state flow in modern React applications

---

## 📸 Project Preview

Add your project screenshot in your root directory:

```markdown
![Redux Toolkit Todo App](./screenshot.png)
```

**Directory Structure:**
```text
redux-todo/
│
├── src/
│   ├── app/
│   │   └── store.js
│   ├── features/
│   │   └── Todo/
│   │       └── TodoSlice.js
│   ├── components/
│   │   ├── AddTodo.jsx
│   │   └── Todos.jsx
│   ├── App.jsx
│   └── main.jsx
│
├── README.md
└── screenshot.png
```

---

## 👨‍💻 Author

**Anuj Rawat**  
*Built while learning and practicing React + Redux Toolkit.*
