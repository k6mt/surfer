import React from "react";

interface SurferTabButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}
const SurferTabButton: React.FC<SurferTabButtonProps> = ({ icon, label, onClick }) => {
  return (
    <div className="tab-button" onClick={onClick}>
      <div className="tab-button-icon">{icon}</div>
      <div className="tab-button-label">{label}</div>
    </div>
  );
};

export default SurferTabButton;
