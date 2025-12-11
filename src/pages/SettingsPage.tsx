import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import {
  getStoredUser,
  API_BASE_URL,
  isAdmin as checkIsAdmin,
} from "../utils/auth";
import type { Employee, User } from "../utils/auth";
import "../../styles/scss/reset.scss";
import "../../styles/scss/layout.scss";
import "../../styles/scss/settings.scss";

const SettingsPage: React.FC = () => {
  const stored = getStoredUser() as User | null;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // update local state
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

  const renderEmployeeCard = (emp: Employee, index: number) => {
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
    const currentIsAdmin = checkIsAdmin();
    const canEdit = currentIsAdmin && !!stored && stored.email !== emp.email;

    return (
      <div>
        <div key={employeeId} className="employee-card-wrapper">
          <div className="emp-avatar-wrapper">
            <img src={avatar} alt="avatar" className="emp-avatar" />
            <div className="emp-name-wrapper">
              <p className="emp-first-name">{firstName}</p>
              <p className="emp-last-name">{lastName}</p>
            </div>
          </div>

          <div className="emp-hr-btn-wrapper">
            <button
              className={`emp-btn ${role === "employee" ? "active" : ""}`}
              disabled={!canEdit}
              onClick={() => updateEmployeeRole(employeeId, "employee", null)}
            >
              EMPLOYEE
            </button>
            <button
              className={`emp-btn ${role === "manager" ? "active" : ""}`}
              disabled={!canEdit}
              onClick={() => updateEmployeeRole(employeeId, "manager", null)}
            >
              HR
            </button>
          </div>

          <div className="emp-admin-btn-wrapper">
            <button
              className={`admin-btn ${isAdmin ? "active" : ""}`}
              disabled={!canEdit}
              onClick={() => updateEmployeeRole(employeeId, null, !isAdmin)}
            >
              ADMIN
            </button>
          </div>
        </div>
        {index < employees.length - 1 && <div className="divider-line" />}
      </div>
    );
  };

  return (
    <>
      <Header currentUser={stored as any} showUserInfo={true} />

      <div className="container">
        <div className="setting-card-wrapper">
          <div className="settings-card-title">
            <h1 className="settings-title">ROLES & PERMISSIONS</h1>
          </div>
          <div className="divider-line"></div>
          <div className="navigation-wrapper">
            <div>
              <div className="settings-search-wrapper">
                <input
                  type="text"
                  className="settings-search-input"
                  placeholder="Type to search"
                  onChange={(e) => {
                    const q = e.target.value.trim().toLowerCase();
                    if (!q) {
                      setEmployees([...allEmployees]);
                      return;
                    }
                    setEmployees(
                      allEmployees.filter((emp) => {
                        const first = (
                          emp.first_name ||
                          (emp as any).firstName ||
                          ""
                        )
                          .toString()
                          .toLowerCase();
                        const last = (
                          emp.last_name ||
                          (emp as any).lastName ||
                          ""
                        )
                          .toString()
                          .toLowerCase();
                        const full = `${first} ${last}`.trim();
                        return (
                          first.includes(q) ||
                          last.includes(q) ||
                          full.includes(q)
                        );
                      })
                    );
                  }}
                />
                <img
                  src="/assets/search-icon.png"
                  alt="search-icon"
                  className="settings-search-icon"
                />
              </div>
            </div>
            <div className="address-book-role-wrapper">
              <div className="vertical-divider"></div>
              <p className="address-book-title">Address book role</p>
            </div>
            <div className="admin-column-wrapper">
              <div className="vertical-divider"></div>
              <p className="admin-title">Admin</p>
            </div>
          </div>
          <div className="divider-line"></div>
          <div className="employee-list-wrapper">
            {loading && <p style={{ padding: 20 }}>Loading...</p>}
            {error && <p style={{ padding: 20, color: "red" }}>{error}</p>}
            {!loading &&
              !error &&
              employees.map((e, i) => renderEmployeeCard(e, i))}
            {!loading && !error && employees.length === 0 && (
              <p style={{ padding: 20, textAlign: "center", color: "#7a7676" }}>
                No employees found
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
