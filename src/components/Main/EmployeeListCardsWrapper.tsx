import React from "react";
import type { Employee } from "../../utils/auth";

interface EmployeeListCardsWrapperProps {
  employees: Employee[];
  onEmployeeClick: (id: string) => void;
}

const EmployeeListCardsWrapper: React.FC<EmployeeListCardsWrapperProps> = ({
  employees,
  onEmployeeClick,
}) => (
  <div className="employee-list-cards-wrapper">
    {employees.map((emp, index) => (
      <React.Fragment key={emp._id}>
        <div
          className="employee-list-card"
          onClick={() => onEmployeeClick(emp._id)}
          style={{ cursor: "pointer" }}
        >
          <div className="list-avatar-and-name-wrapper">
            <div>
              <img
                src={emp.user_avatar}
                alt="user-avatar"
                className="list-avatar"
              />
            </div>
            <div>
              <p>
                {emp.first_name} {emp.last_name}
              </p>
            </div>
          </div>
          <div className="list-role-and-room-wrapper">
            <div>
              <p>{emp.department}</p>
            </div>
            <div>
              <p>#{emp.room}</p>
            </div>
          </div>
        </div>
        {index < employees.length - 1 && (
          <div className="list-divider-line"></div>
        )}
      </React.Fragment>
    ))}
  </div>
);

export default EmployeeListCardsWrapper;
