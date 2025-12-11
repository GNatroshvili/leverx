import React from "react";

interface EmployeeListWrapperProps {
  loading: boolean;
  error: string | null;
  employees: React.ReactNode;
}

const EmployeeListWrapper: React.FC<EmployeeListWrapperProps> = ({ loading, error, employees }) => (
  <div className="employee-list-wrapper">
    {loading && <p style={{ padding: 20 }}>Loading...</p>}
    {error && <p style={{ padding: 20, color: "red" }}>{error}</p>}
    {!loading && !error && employees}
    {!loading && !error && (!employees || (Array.isArray(employees) && employees.length === 0)) && (
      <p style={{ padding: 20, textAlign: "center", color: "#7a7676" }}>
        No employees found
      </p>
    )}
  </div>
);

export default EmployeeListWrapper;
