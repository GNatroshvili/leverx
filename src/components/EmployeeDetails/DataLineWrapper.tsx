import React from "react";
import type { ReactNode } from "react";

interface DataLineWrapperProps {
  icon: string;
  iconAlt: string;
  label: string;
  children: ReactNode;
  iconClassName?: string;
}

const DataLineWrapper: React.FC<DataLineWrapperProps> = ({
  icon,
  iconAlt,
  label,
  children,
  iconClassName = "icon-size",
}) => {
  return (
    <div className="data-line-wrapper">
      <div className="data-title-wrapper">
        <img src={icon} alt={iconAlt} className={iconClassName} />
        <p className="gray-text">{label}</p>
      </div>
      <div className="data-title-value-wrapper">{children}</div>
    </div>
  );
};

export default DataLineWrapper;
