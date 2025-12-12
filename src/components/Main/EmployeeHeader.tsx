import React from "react";
import circle from "../../public/assets/circle.png";
import nameIcon from "../../public/assets/name.png";
import briefcaseIcon from "../../public/assets/briefcase.png";
import doorIcon from "../../public/assets/door.png";

const EmployeeHeader: React.FC = () => (
  <div className="employee-header">
    <div className="photo-and-name-wrapper">
      <div className="photo-wrapper">
        <img src={circle} alt="circle-icon" />
        <p className="font-style">Photo</p>
      </div>
      <div className="name-wrapper">
        <img src={nameIcon} alt="name-icon" />
        <p>Name</p>
      </div>
    </div>
    <div className="department-and-room-wrapper">
      <div className="department-wrapper">
        <img src={briefcaseIcon} alt="briefcase-icon" />
        <p className="font-style">Department</p>
      </div>
      <div className="room-wrapper">
        <img src={doorIcon} alt="door-icon" />
        <p className="font-style">Room</p>
      </div>
    </div>
  </div>
);

export default EmployeeHeader;
