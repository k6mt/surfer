import MainLayout from "@components/layout/MainLayout";
import DashBoard from "@pages/LoadTest";
import Home from "@pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "loadtest", element: <DashBoard /> },
      ],
    },
  ],
  {
    basename: "/k6m-surfer",
  }
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
