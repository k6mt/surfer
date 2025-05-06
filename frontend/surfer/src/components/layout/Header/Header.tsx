import NavItem from "@components/layout/Header/NavItem";
import K6MLogo from "@images/k6m-surfer_logo.png";
import type { Nav } from "@_types/shared";
import Burger from "@components/layout/Header/Burger";
import BurgerUI from "@components/layout/Header/BurgerUI";
import { useState } from "react";

const NAV_ITMES: Nav[] = [
  { to: "/", label: "Home" },
  { to: "/loadtest", label: "Load Test" },
  { to: "/cover", label: "Menu1" },
  { to: "/cover2", label: "Menu2" },
  { to: "/cover3", label: "Menu3" },
  { to: "/cover4", label: "Menu4" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <header className="header">
        <div className="header__logo">
          <p className="header__logo_text">Surfer</p>
          <div className="header__logo_img_container">
            <img className="header__logo_img" src={K6MLogo} alt="Surfer Logo" />
          </div>
          <div></div>
        </div>
        <nav className="header__nav">
          <div className="header__nav_list">
            {NAV_ITMES.map((item) => (
              <div className="header__nav_item" key={item.to}>
                <NavItem key={item.to} to={item.to} label={item.label} />
              </div>
            ))}
          </div>

          <div className="header__nav_burger">
            <Burger open={isOpen} onToggle={() => setIsOpen((o: boolean) => !o)} />
            <BurgerUI open={isOpen} navitems={NAV_ITMES} />
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
