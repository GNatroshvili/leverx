import React from "react";

const EmployeeHeader: React.FC = () => (
  <div className="employee-header">
    <div className="photo-and-name-wrapper">
      <div className="photo-wrapper">
        <img src="/assets/circle.png" alt="circle-icon" />
        <p className="font-style">Photo</p>
      </div>
      <div className="name-wrapper">
        <img src="/assets/name.png" alt="name-icon" />
        <p>Name</p>
      </div>
    </div>
    <div className="department-and-room-wrapper">
      <div className="department-wrapper">
        <img src="/assets/briefcase.png" alt="briefcase-icon" />
        <p className="font-style">Department</p>
      </div>
      <div className="room-wrapper">
        <img src="/assets/door.png" alt="door-icon" />
        <p className="font-style">Room</p>
      </div>
    </div>
  </div>
);

export default EmployeeHeader;
