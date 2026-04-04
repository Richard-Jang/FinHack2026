import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { RootRoute } from "./Route"

function App() {

  const router = createBrowserRouter([RootRoute], {});

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
