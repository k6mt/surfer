import { Nav } from "@_types/shared";
import NavItem from "@components/layout/Header/NavItem";

interface BurgerUIProps {
  open: boolean;
  navitems: Nav[];
}

const BurgerUI = ({ open, navitems }: BurgerUIProps) => {
  if (!open) return null;

  return (
    <div>
      <div className="header__burger_menu">
        {navitems.map((item) => (
          <div className="header__burgur_menu_item" key={item.to}>
            <NavItem key={item.to} to={item.to} label={item.label} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BurgerUI;
