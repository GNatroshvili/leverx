import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import EmployeeDetails from "../../components/EmployeeDetails/EmployeeDetails";
import { getStoredUser, API_BASE_URL } from "../../utils/auth";
import type { Employee } from "../../utils/auth";

import "../../components/EmployeeDetails/employee-details.scss";
import "../../components/Header/header.scss";
import "../../layout.scss";
import "../../reset.scss";

const EmployeeDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate("/");
      return;
    }

    // Fetch current user data if needed
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/employees`);
        const data = await response.json();
        if (data.success) {
          const loggedInUser = data.employees.find(
            (emp: Employee) => emp.email === user.email
          );
          setCurrentUser(loggedInUser || null);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

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
