import AnalyzeContainer from "@components/Analyze/AnalyzeContainer";
import ModelHeader from "@components/Analyze/ModelHeader";
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
            <AnalyzeContainer>
              <Outlet />
            </AnalyzeContainer>
          </div>
        </main>
      )}
    </div>
  );
};

export default MainLayout;
