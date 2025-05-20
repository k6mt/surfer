import CommonContainer from "@components/common/CommonContainer";
import ModelHeader from "@components/common/ModelHeader";
import RouteAside from "@components/RouteSide/RouteAside";
import SurferList from "@components/SurferList/SurferList";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={`layout ${isHome ? "home" : ""}`}>
      <RouteAside />
      {!isHome && <SurferList />}
      {!isHome && (
        <main>
          <div className="container">
            <ModelHeader />
            <CommonContainer>
              <Outlet />
            </CommonContainer>
          </div>
        </main>
      )}

      {isHome && (
        <main>
          <div className="container">
            <Outlet />
          </div>
        </main>
      )}
    </div>
  );
};

export default MainLayout;
