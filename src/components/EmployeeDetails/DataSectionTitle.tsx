import React from "react";

interface DataSectionTitleProps {
  title: string;
}

const DataSectionTitle: React.FC<DataSectionTitleProps> = ({ title }) => {
  return <p className="data-section-title">{title}</p>;
};

export default DataSectionTitle;
