import RouteAside from "@components/RouteSide/RouteAside";
import SurferList from "@components/SurferList/SurferList";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const handleApiClick = async (method: string, url: string) => {
    try {
      console.log(method, url);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <RouteAside />
      <SurferList onApiClick={handleApiClick} />
      <main>
        <div className="layout__container">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default MainLayout;
