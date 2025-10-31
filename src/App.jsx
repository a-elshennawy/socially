import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout/Layout";
import SpinnerLoader from "./components/ReusableComponents/SpinnerLoader";

const Home = lazy(() => import("./components/Pages/Home"));
const PostComments = lazy(() => import("./components/Pages/PostComments"));
const Signup = lazy(() => import("./components/Pages/Signup/Signup"));
const Login = lazy(() => import("./components/Pages/Login/Login"));

const createRoute = (path, element) => ({
  path,
  element: <Suspense fallback={<SpinnerLoader />}>{element}</Suspense>,
});

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [createRoute("", <Home />)],
    },
    createRoute("/PostComments/:postId", <PostComments />),
    createRoute("/signup", <Signup />),
    createRoute("/login", <Login />),
  ]);
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
