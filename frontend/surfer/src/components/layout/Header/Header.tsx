import NavItem from "@components/layout/Header/NavItem";

const NAV_ITMES = [
  { to: "/", label: "Home" },
  { to: "/loadtest", label: "Load Test" },
];

const Header = () => {
  return (
    <div>
      <header className="header">
        <div className="header__logo">
          <div>K6M Surfer</div>
        </div>
        <nav className="header__nav">
          {NAV_ITMES.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} />
          ))}
        </nav>
      </header>
    </div>
  );
};

export default Header;
