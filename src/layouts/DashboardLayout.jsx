import { Outlet } from "react-router-dom";
import AppNavigation from "./AppNavigation";

const DashboardLayout = () => {
  return (
    <div>
      {/* <h2>Qarz Manager</h2> */}

      <Outlet />
      <AppNavigation />
    </div>
  );
};

export default DashboardLayout;
