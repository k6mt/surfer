import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

interface MethodProps {
  value: string;
  isOption: boolean;
  onChange: (value: string) => void;
}

const MethodSelect: React.FC<MethodProps> = ({ value, isOption, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const options = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  const shouldShowOptions = isOpen && isOption;

  return (
    <div className={`custom-select ${isOpen ? "open" : "close"}`}>
      <div
        className={`custom-select-box ${isOpen ? "open" : "close"} ${
          isOption ? "list" : "no-list"
        }`}
        onClick={toggleDropdown}
      >
        <div className={`selected-value ${value.toLowerCase()}`}>{value}</div>
        {isOption && (
          <div className={`dropdown-icon ${isOpen ? "open" : ""}`}>
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
        )}
      </div>
      {shouldShowOptions && (
        <ul className="option-list">
          {options?.map((opt) => (
            <li
              key={opt}
              className={`option-item ${opt.toLowerCase()} ${
                opt === value ? "selected" : ""
              }`}
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
