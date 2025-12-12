import React from "react";
import blueGrid from "../../public/assets/blue-grid.png";
import gridIcon from "../../public/assets/grid.png";
import blueList from "../../public/assets/blue-list.png";
import listIcon from "../../public/assets/list.png";

interface EmployeeManageOptionsWrapperProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

const EmployeeManageOptionsWrapper: React.FC<
  EmployeeManageOptionsWrapperProps
> = ({ viewMode, setViewMode }) => (
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
        src={viewMode === "grid" ? blueGrid : gridIcon}
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
        src={viewMode === "list" ? blueList : listIcon}
        alt="list-icon"
        id="list-icon"
      />
    </a>
  </div>
);

export default EmployeeManageOptionsWrapper;
