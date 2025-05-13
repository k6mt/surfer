import RouteAside from "@components/RouteSide/RouteAside";
import SurferList from "@components/SurferList/SurferList";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <RouteAside />
      <SurferList />
      <main>
        <div className="layout__container">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default MainLayout;
