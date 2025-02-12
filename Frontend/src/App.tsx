// App.tsx
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Background } from "./layouts";
import {
  Settings,
  Landing,
  Jobs,
  Account,
  Dashboard,
  NotFound,
  Authentication,
} from "./pages";
import { Analytics } from "@vercel/analytics/react";

// Layout route wrapper
const LayoutRoute = () => (
  <Background>
    <Outlet />
  </Background>
);

const ErrorRoute = () => (
  <Background>
    <NotFound />
  </Background>
);

// Router configuration
const router = createBrowserRouter([
  {
    element: <LayoutRoute />,
    errorElement: <ErrorRoute />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/authentication",
        element: <Authentication />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/jobs",
        element: <Jobs />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
    </>
  );
}

export default App;
