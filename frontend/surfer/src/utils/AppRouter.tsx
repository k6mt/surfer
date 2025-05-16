import MainLayout from "@components/layout/MainLayout";
import Home from "@pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "@pages/NotFound";
import ErrorLayout from "@components/layout/ErrorLayout";
import { lazy } from "react";
import TracePage from "@pages/TracePage";

const DashBoard = lazy(() => import("@pages/LoadTest"));

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "trace", element: <TracePage /> },
        { path: "loadtest", element: <DashBoard /> },
      ],
    },
    {
      path: "*",
      element: <ErrorLayout />,
      children: [{ path: "*", element: <NotFound /> }],
    },
  ],
  {
    basename: "/k6m-surfer",
  }
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
