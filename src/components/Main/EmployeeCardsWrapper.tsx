import React from "react";
import type { Employee } from "../../utils/auth";
import briefCase from "../../public/assets/briefcase.png";
import doorIcon from "../../public/assets/door.png";

interface EmployeeCardsWrapperProps {
  employees: Employee[];
  onEmployeeClick: (id: string) => void;
}

const EmployeeCardsWrapper: React.FC<EmployeeCardsWrapperProps> = ({
  employees,
  onEmployeeClick,
}) => (
  <div className="employee-cards-wrapper">
    {employees.map((emp) => (
      <div
        key={emp._id}
        className="employee-card"
        onClick={() => onEmployeeClick(emp._id)}
        style={{ cursor: "pointer" }}
      >
        <div className="employee-data-wrapper">
          <img src={emp.user_avatar} alt="user-avatar" className="avatar" />
          <p className="employee-name">
            {emp.first_name} {emp.last_name}
          </p>
        </div>
        <div className="divider-line"></div>
        <div className="work-role-and-room-wrapper">
          <div className="work-role-wrapper">
            <img src={briefCase} alt="briefcase-icon" />
            <p className="work-role">{emp.department}</p>
          </div>
          <div className="room-number-wrapper">
            <img src={doorIcon} alt="door-icon" />
            <p className="room-number">#{emp.room}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default EmployeeCardsWrapper;
