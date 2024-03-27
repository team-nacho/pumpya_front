import { RouteObject } from "react-router-dom";
import HomePage from "../Pages/home";
import PartyPage from "../Pages/party";
import HistoryPage from "../Pages/history";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage/>
  },
  {
    path:"party",
    children: [
      {
        path:":partyId",
        element: <PartyPage/>
      }
    ]
  },
  {
    path:"history",
    element: <HistoryPage/>
  },
  {
    path:"*",
    element: <HomePage/>
  }
]