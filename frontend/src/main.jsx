import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import {
  Register,
  Login,
  PostAdd,
  PostEdit,
  AchievementAdd,
  AchievementEdit,
  AwardAdd,
  AwardEdit,
  CollaborationAdd,
  CollaborationEdit,
  ConferenceAdd,
  ProjectAdd,
  TeachingExperienceAdd,
  SingleAchievement,
  SinglePost,
  SingleProject,
} from "./components/index.js";
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
      {
        path: "/addAchievement/:userName",
        element: <AchievementAdd />,
      },
      {
        path: "/editAchievement/:userName/:achievementId",
        element: <AchievementEdit />,
      },
      {
        path: "/addAward/:userName",
        element: <AwardAdd />,
      },
      {
        path: "/editAward/:userName/:awardId",
        element: <AwardEdit />,
      },
      {
        path: "/addCollaboration/:userName",
        element: <CollaborationAdd />,
      },
      {
        path: "/editCollaboration/:userName/:collaborationId",
        element: <CollaborationEdit />,
      },
      {
        path: "/addConference/:userName",
        element: <ConferenceAdd />,
      },
      {
        path: "/addProjects/:userName",
        element: <ProjectAdd />,
      },
      {
        path: "/addExperience/:userName",
        element: <TeachingExperienceAdd />,
      },
      {
        path: "/achievement/:achievementId",
        element: <SingleAchievement />,
      },
      {
        path: "/post/:postId",
        element: <SinglePost />,
      },
      {
        path: "/project/:projectId",
        element: <SingleProject />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
