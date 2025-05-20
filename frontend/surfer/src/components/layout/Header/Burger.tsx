import BurgerOpen from "@icons/icon-hamburger.svg";
import BurgerClose from "@icons/icon-hamburger-close.svg";

interface BurgerProps {
  open: boolean;
  onToggle: () => void;
}

const Burger = ({ open, onToggle }: BurgerProps) => {
  return (
    <button
      className={`header__burger ${open ? "is-open" : ""}`}
      onClick={onToggle}
      aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
    >
      <img
        className={`header__burger_icon ${open ? "is-open" : ""}`}
        src={open ? `${BurgerClose}` : `${BurgerOpen}`}
        alt={open ? "메뉴 닫기" : "메뉴 열기"}
      />
    </button>
  );
};

export default Burger;
