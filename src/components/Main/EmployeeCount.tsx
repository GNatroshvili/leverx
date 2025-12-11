import React from "react";

const EmployeeCount: React.FC<{ count: number }> = ({ count }) => (
  <p className="employee-count">{count} employees displayed</p>
);

export default EmployeeCount;
