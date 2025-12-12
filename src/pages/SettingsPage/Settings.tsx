import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import {
  getStoredUser,
  API_BASE_URL,
  isAdmin as checkIsAdmin,
} from "../../utils/auth";
import type { Employee, User } from "../../utils/auth";
import SettingCardWrapper from "../../components/Settings/SettingCardWrapper";
import EmployeeCardWrapper from "../../components/Settings/EmployeeCardWrapper";
import "../../../styles/scss/reset.scss";
import "../../../styles/scss/layout.scss";
import "../../../styles/scss/settings.scss";

const Settings: React.FC = () => {
  const stored = getStoredUser() as User | null;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/employees`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list: Employee[] = data.employees || data;
        setEmployees(list);
        setAllEmployees(list);
      } catch (err: any) {
        setError(err.message || "Failed to load employees");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

      const res = await fetch(`${API_BASE_URL}/employees/${employeeId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "Failed to update role");

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
    setSearchQuery(q);
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
          loading={loading}
          error={error}
          employees={employeeCards}
          onSearchChange={handleSearchChange}
        />
      </div>
    </>
  );
};

export default Settings;
