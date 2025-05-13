import { AsideNav } from "@_types/shared";
import RouteNav from "@components/RouteSide/RouteNav";
import {
  faHome,
  faMicrochip,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";

const NAV_ITMES: AsideNav[] = [
  { to: "/", label: "Home", icon: faHome },
  { to: "/trace", label: "Trace", icon: faRoute },
  { to: "/loadtest", label: "Load Test", icon: faMicrochip },
];

const RouteAside = () => {
  return (
    <div className="aside_nav">
      <div className="aside_nav_list">
        {NAV_ITMES.map((item) => (
          <div className="aside_nav_item" key={item.to}>
            <RouteNav to={item.to} label={item.label} icon={item.icon} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteAside;
