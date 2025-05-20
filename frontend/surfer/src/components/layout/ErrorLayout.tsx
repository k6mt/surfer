import { Outlet } from "react-router-dom";

const ErrorLayout = () => {
  return (
    <div>
      <main>
        <div className="layout__container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ErrorLayout;
