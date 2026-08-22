import { createContext, useContext } from "react";

export const ThemeContext = createContext({
    themeMode: "light",
    darkTheme: () => { },
    lightTheme: () => { }
})
//we can give default values also to usecontext

export const ThemeProvider = ThemeContext.Provider;

//custom hook which give directly  use context
export default function useTheme() {
    return useContext(ThemeContext)
}