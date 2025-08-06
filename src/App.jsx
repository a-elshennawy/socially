import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import SpinnerLoader from "./components/SpinnerLoader";
import ThemeProvider from "./components/ThemeProvider";

const Home = lazy(() => import("./components/Home"));
const PostComments = lazy(() => import("./components/PostComments"));

const createRoute = (path, element) => ({
  path,
  element: <Suspense fallback={<SpinnerLoader />}>{element}</Suspense>,
});

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ThemeProvider>
          <Layout />
        </ThemeProvider>
      ),
      children: [
        createRoute("", <Home />),
        createRoute("/PostComments/:postId", <PostComments />),
      ],
    },
  ]);
  return <RouterProvider router={routes} />;
}

export default App;
