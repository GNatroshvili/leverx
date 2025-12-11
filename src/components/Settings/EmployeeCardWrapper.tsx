import React from "react";
import EmpAvatarWrapper from "./EmpAvatarWrapper";
import EmpHrBtnWrapper from "./EmpHrBtnWrapper";
import EmpAdminBtnWrapper from "./EmpAdminBtnWrapper";

interface EmployeeCardWrapperProps {
  avatar: string;
  firstName: string;
  lastName: string;
  role: string;
  isAdmin: boolean;
  canEdit: boolean;
  onSetEmployee: () => void;
  onSetManager: () => void;
  onToggleAdmin: () => void;
  showDivider?: boolean;
}

const EmployeeCardWrapper: React.FC<EmployeeCardWrapperProps> = ({
  avatar,
  firstName,
  lastName,
  role,
  isAdmin,
  canEdit,
  onSetEmployee,
  onSetManager,
  onToggleAdmin,
  showDivider,
}) => (
  <>
    <div className="employee-card-wrapper">
      <EmpAvatarWrapper avatar={avatar} firstName={firstName} lastName={lastName} />
      <EmpHrBtnWrapper role={role} canEdit={canEdit} onSetEmployee={onSetEmployee} onSetManager={onSetManager} />
      <EmpAdminBtnWrapper isAdmin={isAdmin} canEdit={canEdit} onToggleAdmin={onToggleAdmin} />
    </div>
    {showDivider && <div className="divider-line" />}
  </>
);

export default EmployeeCardWrapper;
