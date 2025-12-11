import React from "react";

interface EmpHrBtnWrapperProps {
  role: string;
  canEdit: boolean;
  onSetEmployee: () => void;
  onSetManager: () => void;
}

const EmpHrBtnWrapper: React.FC<EmpHrBtnWrapperProps> = ({ role, canEdit, onSetEmployee, onSetManager }) => (
  <div className="emp-hr-btn-wrapper">
    <button
      className={`emp-btn ${role === "employee" ? "active" : ""}`}
      disabled={!canEdit}
      onClick={onSetEmployee}
    >
      EMPLOYEE
    </button>
    <button
      className={`emp-btn ${role === "manager" ? "active" : ""}`}
      disabled={!canEdit}
      onClick={onSetManager}
    >
      HR
    </button>
  </div>
);

export default EmpHrBtnWrapper;
