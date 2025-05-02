interface BurgerProps {
  open: boolean;
  onToggle: () => void;
}

const Burger = ({ open, onToggle }: BurgerProps) => {
  console.log("Burger render", open);
  return (
    <button
      className={`header__burger ${open ? "is-open" : ""}`}
      onClick={onToggle}
      aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
    ></button>
  );
};

export default Burger;
