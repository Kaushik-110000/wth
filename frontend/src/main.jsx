import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { Register, Login, PostAdd, PostEdit } from "./components/index.js";
import MainPage from "./pages/MainPage.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/:userName",
        element: <MainPage />,
      },
      {
        path: "/addPost/:userName",
        element: <PostAdd />,
      },
      {
        path: "/editPost/:postId",
        element: <PostEdit />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
