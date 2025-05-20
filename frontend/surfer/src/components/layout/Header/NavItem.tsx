import { NavLink } from "react-router-dom";

interface NavItemProps {
  to: string;
  label: string;
}

const NavItem = ({ to, label }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "nav__item nav__item--active" : "nav__item"
      }
    >
      {label}
    </NavLink>
  );
};

export default NavItem;
