import React, { useEffect, useState } from 'react'
import { ThemeProvider } from './context/Theme'
import { ThemeBtn, Card } from './components';

const App = () => {

  const [themeMode, setThemeMode] = useState("Light");

  const darkTheme = () => {
    setThemeMode("dark");
  }

  const lightTheme = () => {
    setThemeMode("light");
  }

  // actual change in theme

  useEffect(() => {


    const htmlObj = document.querySelector('html').classList;
    htmlObj.remove("light", "dark");//remove kra jo html ka andar jo bhi theme tha
    htmlObj.add(themeMode);// theme mode ko add kr diya

  }, [themeMode])

  return (
    <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>

      <div className="flex flex-wrap min-h-screen items-center">

        <div className="w-full">
          <div className="w-full max-w-sm mx-auto flex justify-end mb-4">
            <ThemeBtn />
          </div>

          <div className="w-full max-w-sm mx-auto">
            <Card />
          </div>
        </div>
      </div>

    </ThemeProvider>
  )
}

export default App



