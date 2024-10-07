// routes/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "../screens/signin";
import { ErrorPage } from "../screens/error";
import { PrivateRoute } from "./private-route";
import { PublicRoute } from "./public-route";
import { Users } from "@/screens/users";
import { Advisors } from "@/screens/advisors";
import { Theses } from "@/screens/theses";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signin",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <Users />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/advisors",
    element: (
      <PrivateRoute>
        <Advisors />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/profile",
    element: (
      <PrivateRoute>
        <div>Advisors Page</div>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/theses",
    element: (
      <PrivateRoute>
        <Theses />
      </PrivateRoute>
    ),
  },
]);
