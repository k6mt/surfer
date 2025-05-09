import { useState } from "react";

interface MethodProps {
  value: string;
  options?: string[];
  onChange: (value: string) => void;
}

const MethodSelect: React.FC<MethodProps> = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`custom-select ${isOpen ? "open" : ""}`}>
      <div className={`custom-select-box ${isOpen ? "open" : ""}`} onClick={toggleDropdown}>
        <div className={`selected-value ${value.toLowerCase()}`}>{value}</div>
        <div className={`dropdown-icon ${isOpen ? "open" : ""}`}>&#9662;</div>
      </div>
      {isOpen && (
        <ul className="option-list">
          {options?.map((opt) => (
            <li
              key={opt}
              className={`option-item ${opt.toLowerCase()} ${opt === value ? "selected" : ""}`}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MethodSelect;
