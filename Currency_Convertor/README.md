# 💱 Currency Converter

A simple and responsive **Currency Converter** built with **React.js**.
This project allows users to convert one currency into another using live exchange-rate data fetched from an API.

## 🚀 Features

* 💰 Convert between different currencies
* 🔄 Swap **From** and **To** currencies
* 🌐 Fetches currency exchange rates from an external API
* ⚡ Uses **Axios** for API requests
* 🪝 Uses a custom React Hook — `useCurrencyInfo`
* 🆔 Uses React's `useId()` Hook for unique input IDs
* 🎨 Responsive UI built with **Tailwind CSS**
* 🧩 Reusable `InputBox` component
* 📱 Responsive and centered UI with a background image

## 🛠️ Technologies Used

* React.js
* JavaScript
* Tailwind CSS
* Axios
* Vite
* Currency API

## 📂 Project Structure

```text
Currency_Convertor/
│
├── src/
│   ├── components/
│   │   ├── InputBox.jsx
│   │   └── index.js
│   │
│   ├── hooks/
│   │   └── useCurrencyInfo.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
├── package.json
├── package-lock.json
└── README.md
```

## 🪝 Custom Hook — `useCurrencyInfo`

The project uses a custom React Hook called:

```js
useCurrencyInfo(currency)
```

The purpose of this hook is to fetch currency exchange-rate information based on the selected currency.

### Example

```js
const currencyInfo = useCurrencyInfo(from);
```

The hook uses `useEffect()` to fetch updated currency information whenever the selected currency changes.

```js
useEffect(() => {
    const fetchData = async () => {
        const { data } = await axios.get(
            `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`
        );

        setDataValue(data[currency]);
    };

    fetchData();
}, [currency]);
```

This keeps the currency information updated whenever the `from` currency changes.

## 📡 Axios

**Axios** is used to make HTTP requests to the currency API.

```js
import axios from "axios";
```

The API request is made using:

```js
const { data } = await axios.get(API_URL);
```

Axios automatically parses the JSON response, making the returned data easy to work with.

## 🆔 React `useId()` Hook

The `InputBox` component uses React's `useId()` Hook:

```js
const amountInputId = useId();
```

This generates a unique ID for the amount input.

The ID is connected to the `<label>` using `htmlFor`:

```jsx
<label htmlFor={amountInputId}>
    {label}
</label>

<input id={amountInputId} />
```

This improves accessibility and ensures that the label correctly identifies its corresponding input.

## 🧩 Reusable `InputBox` Component

The `InputBox` component is designed to be reusable.

It receives values and functions through props:

```jsx
<InputBox
    label="From"
    amount={amount}
    currencyOptions={options}
    onCurrencyChange={(currency) => setFrom(currency)}
    selectCurrency={from}
    onAmountChange={(amount) => setAmount(amount)}
/>
```

The same component is reused for the **From** and **To** currency sections.

## 🔄 Currency Swap

The application provides a **Swap** button that exchanges:

```text
From Currency ↔ To Currency
```

It also swaps the corresponding amounts.

## 🧠 React Concepts Used

This project helped practice several important React concepts:

### `useState`

Used for managing:

* Amount
* From currency
* To currency
* Converted amount

Example:

```js
const [amount, setAmount] = useState("");
```

### `useEffect`

Used inside the custom hook to fetch currency information when the selected currency changes.

### `useId`

Used to generate unique IDs for form inputs and labels.

### Props

Props are used to pass data and functions between `App.jsx` and `InputBox`.

### Custom Hooks

Created:

```text
useCurrencyInfo
```

to separate API-fetching logic from the UI.

### Controlled Components

The input fields are controlled using React state:

```jsx
value={amount}
onChange={(e) => onAmountChange(Number(e.target.value))}
```

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/anujrawat14/projects.git
```

Go into the project:

```bash
cd projects/Currency_Convertor
```

Install dependencies:

```bash
npm install
```

Install Axios if required:

```bash
npm install axios
```

Start the development server:

```bash
npm run dev
```

## 🔑 API

This project uses the **Fawaz Ahmed Currency API** through jsDelivr:

```text
https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/
```

The selected currency is added to the API URL to retrieve its exchange rates.
## 📸 Project Preview

![Currency Converter](./src/screenshot.png)

Built as a React learning project while practicing React Hooks, Custom Hooks, API integration, and Tailwind CSS.
