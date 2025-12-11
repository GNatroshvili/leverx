import React from "react";
import EmployeeCount from "./EmployeeCount";
import EmployeeManageOptionsWrapper from "./EmployeeManageOptionsWrapper";

interface EmployeeManageProps {
  count: number;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

const EmployeeManage: React.FC<EmployeeManageProps> = ({ count, viewMode, setViewMode }) => (
  <div className="employee-manage">
    <div>
      <EmployeeCount count={count} />
    </div>
    <EmployeeManageOptionsWrapper viewMode={viewMode} setViewMode={setViewMode} />
  </div>
);

export default EmployeeManage;
