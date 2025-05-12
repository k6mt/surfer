import Header from "@components/layout/Header/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <div className="layout__container">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default MainLayout;
