import { useRoutes } from "react-router-dom";
import { routes } from "./Routes/routes";

const App = () => {
  const content = useRoutes(routes);
  return content;
};

export default App;