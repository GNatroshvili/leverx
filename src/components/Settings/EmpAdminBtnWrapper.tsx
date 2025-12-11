import React from "react";

interface EmpAdminBtnWrapperProps {
  isAdmin: boolean;
  canEdit: boolean;
  onToggleAdmin: () => void;
}

const EmpAdminBtnWrapper: React.FC<EmpAdminBtnWrapperProps> = ({ isAdmin, canEdit, onToggleAdmin }) => (
  <div className="emp-admin-btn-wrapper">
    <button
      className={`admin-btn ${isAdmin ? "active" : ""}`}
      disabled={!canEdit}
      onClick={onToggleAdmin}
    >
      ADMIN
    </button>
  </div>
);

export default EmpAdminBtnWrapper;
