import { lazy, Suspense } from "react";
import { Offline } from "react-detect-offline";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout/Layout";
import SpinnerLoader from "./components/ReusableComponents/SpinnerLoader";

const Home = lazy(() => import("./components/Pages/Home"));
const PostComments = lazy(() => import("./components/Pages/PostComments"));

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
  ]);
  return (
    <>
      <Offline>
        <div className="offline-message">
          You're offline. Check your connection...
        </div>
      </Offline>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
