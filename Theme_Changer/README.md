# 🧠 Context API

The project uses a single `Theme.js` file to handle the theme context.

It contains:
- `createContext()`
- `ThemeProvider`
- Custom `useTheme()` hook

### Theme Context

```javascript
import { createContext, useContext } from "react";

export const ThemeContext = createContext({
  themeMode: "light",
  darkTheme: () => {},
  lightTheme: () => {},
});

export const ThemeProvider = ThemeContext.Provider;

export default function useTheme() {
  return useContext(ThemeContext);
}
```

---

## ⚛️ Theme State

The theme is managed in `App.jsx` using `useState()`.

```javascript
const [themeMode, setThemeMode] = useState("light");

const darkTheme = () => {
  setThemeMode("dark");
};

const lightTheme = () => {
  setThemeMode("light");
};
```

The theme state and functions are provided through `ThemeProvider`:

```jsx
<ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
```

This makes the theme data available to components such as `ThemeBtn` and `Card`.

---

## 🔄 Theme Switching

`useEffect()` is used to update the theme class on the HTML element whenever `themeMode` changes.

```javascript
useEffect(() => {
  const htmlObj = document.querySelector("html").classList;

  htmlObj.remove("light", "dark");
  htmlObj.add(themeMode);
}, [themeMode]);
```

### Theme Switching Flow:

```text
Theme Button
     ↓
darkTheme() / lightTheme()
     ↓
themeMode changes
     ↓
useEffect()
     ↓
Remove previous theme
     ↓
Add current theme to <html>
     ↓
Tailwind dark mode is applied
```

---

## 🔘 Theme Button

The `ThemeBtn` component uses the custom `useTheme()` hook:

```javascript
const { themeMode, lightTheme, darkTheme } = useTheme();
```

The checkbox determines whether dark mode should be enabled:

```javascript
const onChngBtn = (e) => {
  const darkModeStatus = e.currentTarget.checked;

  if (darkModeStatus) {
    darkTheme();
  } else {
    lightTheme();
  }
};
```

The checkbox is controlled by the current theme:

```jsx
checked={themeMode === "dark"}
```

This keeps the toggle button synchronized with the current theme.

---

## 🎨 Tailwind Dark Mode

The project uses Tailwind CSS dark mode.  
When the theme is changed to dark, the `dark` class is added to the `<html>` element:

```html
<html class="dark">
```

Tailwind `dark:` utilities can then be used throughout the application.

---

## 📦 Barrel Exports

Components are exported from `components/index.js`:

```javascript
export { default as ThemeBtn } from "./button/ThemeBtn";
export { default as Card } from "./card/Card";
```

This allows components to be imported from a single location:

```javascript
import { ThemeBtn, Card } from "./components";
```

---

## 📚 Concepts Practiced

- **React Context API**
  - `createContext()`
  - `Context Provider`
  - `useContext()`
- **Custom Hooks**
- `useState()`
- `useEffect()`
- **Global State Management**
- **Avoiding Prop Drilling**
- **Controlled Components**
- **Tailwind CSS Dark Mode**
- **Barrel Exports**

---

## 🚀 Run Locally

### 1. Clone the repository
```bash
git clone <your-repository-url>
```

### 2. Navigate to the project
```bash
cd <project-folder>
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start the development server
```bash
npm run dev
```

---

## 📸 Project Preview

Add your screenshot to the project root and name it `screenshot.png`.

![Theme Switcher](./screenshot.png)

---

## 💡 Key Takeaway

This project demonstrates how the **React Context API** can be used to manage global theme state without prop drilling.  
The theme state is managed in `App.jsx`, provided through `ThemeProvider`, and accessed by components using the custom `useTheme()` hook.

⭐ *If you found this project helpful, consider giving the repository a star!*
