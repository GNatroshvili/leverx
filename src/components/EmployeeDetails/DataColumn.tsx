import React from "react";
import type { ReactNode } from "react";

interface DataColumnProps {
  children: ReactNode;
}

const DataColumn: React.FC<DataColumnProps> = ({ children }) => {
  return <div className="data-column">{children}</div>;
};

export default DataColumn;
