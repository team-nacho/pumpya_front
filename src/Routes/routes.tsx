import { RouteObject } from "react-router-dom";
import { HomeContainer } from "../Pages/home";
import { PartyContainer } from "../Pages/party";
import HistoryPage from "../Pages/history";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomeContainer />,
  },
  {
    path: "party",
    children: [
      {
        path: ":partyId",
        element: <PartyContainer />,
      },
    ],
  },
  {
    path: "history",
    children: [
      {
        path: ":partyId",
        element: <HistoryPage />,
      }
    ]
  },
  {
    path: "*",
    element: <HomeContainer />,
  },
];
