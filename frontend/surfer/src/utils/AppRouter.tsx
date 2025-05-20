import MainLayout from "@components/layout/MainLayout";
import Home from "@pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "@pages/NotFound";
import ErrorLayout from "@components/layout/ErrorLayout";
import TracePage from "@pages/TracePage";
import LoadTest from "@pages/LoadTest";
import Analyze from "@pages/Analyze";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "trace", element: <TracePage /> },
        { path: "loadtest", element: <LoadTest /> },
        { path: "analyze", element: <Analyze /> },
      ],
    },
    {
      path: "*",
      element: <ErrorLayout />,
      children: [{ path: "*", element: <NotFound /> }],
    },
  ],
  {
    basename: "/k6mt-surfer",
  }
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
