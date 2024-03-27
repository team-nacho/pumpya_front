import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "/"
  },
  {
    path:"party",
    children: [
      {
        path:":partyId"
      },
      {
        path:"current"
      }
    ]
  },
  {
    path:"history"
  }
]