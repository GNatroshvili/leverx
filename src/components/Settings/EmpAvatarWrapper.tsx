import React from "react";

const EmpAvatarWrapper: React.FC<{
  avatar: string;
  firstName: string;
  lastName: string;
}> = ({ avatar, firstName, lastName }) => (
  <div className="emp-avatar-wrapper">
    <img src={avatar} alt="avatar" className="emp-avatar" />
    <div className="emp-name-wrapper">
      <p className="emp-first-name">{firstName}</p>
      <p className="emp-last-name">{lastName}</p>
    </div>
  </div>
);

export default EmpAvatarWrapper;
