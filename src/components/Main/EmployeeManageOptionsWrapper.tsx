import React from "react";

interface EmployeeManageOptionsWrapperProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

const EmployeeManageOptionsWrapper: React.FC<EmployeeManageOptionsWrapperProps> = ({ viewMode, setViewMode }) => (
  <div className="employee-manage-options-wrapper">
    <a
      href="#"
      id="grid-view-btn"
      onClick={(e) => {
        e.preventDefault();
        setViewMode("grid");
      }}
    >
      <img
        src={viewMode === "grid" ? "/assets/blue-grid.png" : "/assets/grid.png"}
        alt="grid-icon"
        id="grid-icon"
      />
    </a>
    <a
      href="#"
      id="list-view-btn"
      onClick={(e) => {
        e.preventDefault();
        setViewMode("list");
      }}
    >
      <img
        src={viewMode === "list" ? "/assets/blue-list.png" : "/assets/list.png"}
        alt="list-icon"
        id="list-icon"
      />
    </a>
  </div>
);

export default EmployeeManageOptionsWrapper;
