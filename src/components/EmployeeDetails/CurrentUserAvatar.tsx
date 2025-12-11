import React from "react";
import type { Employee } from "../../utils/auth";

interface CurrentUserAvatarProps {
  currentEmployee: Employee;
}

const CurrentUserAvatar: React.FC<CurrentUserAvatarProps> = ({
  currentEmployee,
}) => {
  const emp = currentEmployee as any;

  return (
    <div>
      <img
        src={(() => {
          const src = currentEmployee.user_avatar || "";
          if (!src) return "/assets/default-avatar.jpg";
          if (src.startsWith("http")) return src;
          return src.replace(/^\.?\//, "/");
        })()}
        alt="employee-avatar"
        className="employee-avatar"
        id="details-employee-avatar"
      />
      {(emp.remote_work || emp.isRemoteWork) && (
        <img
          src="/assets/home.png"
          alt="home-icon"
          className="home-icon"
          id="details-remote-work-icon"
        />
      )}
    </div>
  );
};

export default CurrentUserAvatar;
