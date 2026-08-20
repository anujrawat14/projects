import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import { About, Contact, Home, GitHub, Random, User } from './components'
import { gitHubInfoLoader } from "./components"


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       {
//         path: "",
//         element: <Home />
//       },
//       {
//         path: "about",
//         element: <About />
//       },
//       {
//         path: "contact",
//         element: <Contact />
//       },
//       {
//         path: "github",
//         element: <GitHub />
//       }
//     ]
//   }
// ])


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/" element=<Layout /> >
      <Route path="" element=<Home /> />
      <Route path="/about" element=<About /> />
      <Route path="/contact" element=<Contact /> />
      <Route
        loader={gitHubInfoLoader}
        path="/github" element=<GitHub /> />

      <Route path=':id' element=<Random /> />

      <Route path='/user/:userId' element=<User /> />


    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
