import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import EmployeeDetails from "../../components/EmployeeDetails/EmployeeDetails";
import { getStoredUser } from "../../utils/auth";
import type { Employee } from "../../utils/auth";
import { useGetUsersQuery } from "../../store/api";
import "../../components/EmployeeDetails/employee-details.scss";
import "../../components/Header/header.scss";
import "../../layout.css";
import "../../index.css";

const EmployeeDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const { data } = useGetUsersQuery();
  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate("/");
      return;
    }
    if (data && data.success) {
      const loggedInUser = data.employees.find(
        (emp: Employee) => emp.email === user.email
      );
      setCurrentUser(loggedInUser || null);
    }
  }, [navigate, data]);

  const currentUserInfo = currentUser
    ? {
        firstName: currentUser.first_name,
        lastName: currentUser.last_name,
        avatar: currentUser.user_avatar,
        id: currentUser._id,
      }
    : undefined;

  return (
    <>
      {currentUserInfo && (
        <Header currentUser={currentUserInfo} showUserInfo={true} />
      )}
      {!currentUserInfo && <Header showUserInfo={false} />}
      <EmployeeDetails />
    </>
  );
};

export default EmployeeDetailsPage;
