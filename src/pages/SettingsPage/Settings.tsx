import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { getStoredUser, isAdmin as checkIsAdmin } from "../../utils/auth";
import type { Employee, User } from "../../utils/auth";
import SettingCardWrapper from "../../components/Settings/SettingCardWrapper";
import EmployeeCardWrapper from "../../components/Settings/EmployeeCardWrapper";
import { useGetUsersQuery, useUpdateUserRoleMutation } from "../../store/api";
import "../../layout.css";
import "../../index.css";
import "../../components/Settings/settings.scss";

const Settings: React.FC = () => {
  const stored = getStoredUser() as User | null;
  const { data, isLoading, error } = useGetUsersQuery();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [updateUserRole] = useUpdateUserRoleMutation();

  useEffect(() => {
    if (data && data.success) {
      setEmployees(data.employees);
      setAllEmployees(data.employees);
    }
  }, [data]);

  const updateEmployeeRole = async (
    employeeId: string,
    role: string | null,
    isAdmin: boolean | null
  ) => {
    try {
      const body: any = {
        requestingUserEmail: stored?.email || "",
      };
      if (role !== null) body.role = role;
      if (isAdmin !== null) body.isAdmin = isAdmin;
      const result = await updateUserRole({
        id: employeeId,
        role: body.role,
        isAdmin: body.isAdmin,
        requestingUserEmail: body.requestingUserEmail,
      }).unwrap();
      if (!result.success)
        throw new Error(result.message || "Failed to update role");
      setEmployees((prev) =>
        prev.map((emp) => {
          if ((emp._id || (emp as any).id) === employeeId) {
            return {
              ...emp,
              role: role ?? emp.role,
              isAdmin: isAdmin !== null ? isAdmin : emp.isAdmin,
            } as Employee;
          }
          return emp;
        })
      );
      return true;
    } catch (err) {
      console.error("Error updating role", err);
      return false;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      setEmployees([...allEmployees]);
      return;
    }
    setEmployees(
      allEmployees.filter((emp) => {
        const first = (emp.first_name || (emp as any).firstName || "")
          .toString()
          .toLowerCase();
        const last = (emp.last_name || (emp as any).lastName || "")
          .toString()
          .toLowerCase();
        const full = `${first} ${last}`.trim();
        return first.includes(q) || last.includes(q) || full.includes(q);
      })
    );
  };

  const currentIsAdmin = checkIsAdmin();

  const employeeCards = employees.map((emp, i) => {
    const firstName = (emp.first_name ||
      (emp as any).firstName ||
      "") as string;
    const lastName = (emp.last_name || (emp as any).lastName || "") as string;
    const avatarRaw = (emp.user_avatar ||
      (emp as any).photo ||
      "/assets/default-avatar.jpg") as string;
    const avatar = avatarRaw.startsWith("http")
      ? avatarRaw
      : avatarRaw.replace(/^\.?\//, "/");
    const role = emp.role || "employee";
    const isAdmin = !!emp.isAdmin;
    const employeeId = (emp._id || (emp as any).id) as string;
    const canEdit = currentIsAdmin && !!stored && stored.email !== emp.email;
    return (
      <EmployeeCardWrapper
        key={employeeId}
        avatar={avatar}
        firstName={firstName}
        lastName={lastName}
        role={role}
        isAdmin={isAdmin}
        canEdit={canEdit}
        onSetEmployee={() => updateEmployeeRole(employeeId, "employee", null)}
        onSetManager={() => updateEmployeeRole(employeeId, "manager", null)}
        onToggleAdmin={() => updateEmployeeRole(employeeId, null, !isAdmin)}
        showDivider={i < employees.length - 1}
      />
    );
  });

  // map stored user to Header's expected currentUser shape
  const headerUser = stored
    ? {
        firstName: stored.firstName,
        lastName: stored.lastName,
        avatar: "/assets/default-avatar.jpg",
        id: stored.employeeId,
      }
    : undefined;

  return (
    <>
      {headerUser ? (
        <Header currentUser={headerUser} showUserInfo={true} />
      ) : (
        <Header showUserInfo={true} />
      )}
      <div className="container">
        <SettingCardWrapper
          loading={isLoading}
          error={
            error
              ? typeof error === "string"
                ? error
                : (error as any)?.data?.message ||
                  (error as any)?.error ||
                  "Failed to load employees"
              : null
          }
          employees={employeeCards}
          onSearchChange={handleSearchChange}
        />
      </div>
    </>
  );
};

export default Settings;
