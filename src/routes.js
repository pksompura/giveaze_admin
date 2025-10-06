import { lazy } from "react";

export const publicRoutes = [
  {
    path: "/login",
    exact: true,
    element: lazy(() => import("./pages/auth/Login.jsx")),
  },
  // {
  //   path: "/forgot-password",
  //   exact: true,
  //   element: lazy(() => import("./pages/auth/ForgotPassword.jsx")),
  // },
  // {
  //   path: "/reset-password",
  //   exact: true,
  //   element: lazy(() => import("./pages/auth/ResetPassword.jsx")),
  // },
];

export const protectedRoutes = [
  {
    path: "/",
    exact: true,
    element: lazy(() => import("./pages/index.jsx")),
  },
  {
    path: "/campaigns",
    exact: true,
    element: lazy(() => import("./pages/campaigns")),
  },
  {
    path: "/campaigns/create",
    exact: true,
    element: lazy(() => import("./pages/campaigns/campaign-form")),
  },
  {
    path: "/fundraiser-campaigns",
    exact: true,
    element: lazy(() => import("./pages/fundraiserCampaigns/index.jsx")),
  },

  {
    path: "/transactions",
    exact: true,
    element: lazy(() => import("./pages/transactions/Transactions.jsx")),
  },
  {
    path: "/donars",
    exact: true,
    element: lazy(() => import("./pages/donars/Donars.jsx")),
  },
  {
    path: "/campaigns/:campaignId/edit",
    exact: true,
    element: lazy(() => import("./pages/campaigns/campaign-form")),
  },
  {
    path: "/users",
    exact: true,
    element: lazy(() => import("./pages/users")),
  },
  {
    path: "/enquiries",
    exact: true,
    element: lazy(() => import("./pages/enquiry")),
  },
  {
    path: "/category",
    exact: true,
    element: lazy(() => import("./pages/category/category.jsx")),
  },
  {
    path: "/settings",
    exact: true,
    element: lazy(() => import("./pages/settings/Settings.jsx")),
  },
  {
    path: "/80g-reports",
    exact: true,
    element: lazy(() => import("./pages/form80g/Reports80G.jsx")),
  },

  //users
];
