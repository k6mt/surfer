import { AsideNav } from "@_types/shared";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

const RouteNav: React.FC<AsideNav> = ({ to, label, icon }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "nav-item nav-item-active" : "nav-item"
      }
    >
      <div className="icon">{icon && <FontAwesomeIcon icon={icon} />}</div>
      <div className="label"> {label}</div>
    </NavLink>
  );
};

export default RouteNav;
