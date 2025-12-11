import React from "react";
import SettingsCardTitle from "./SettingsCardTitle";
import DividerLine from "./DividerLine";
import NavigationWrapper from "./NavigationWrapper";
import EmployeeListWrapper from "./EmployeeListWrapper";

interface SettingCardWrapperProps {
  loading: boolean;
  error: string | null;
  employees: React.ReactNode;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SettingCardWrapper: React.FC<SettingCardWrapperProps> = ({ loading, error, employees, onSearchChange }) => (
  <div className="setting-card-wrapper">
    <SettingsCardTitle />
    <DividerLine />
    <NavigationWrapper />
    <DividerLine />
    <EmployeeListWrapper loading={loading} error={error} employees={employees} />
  </div>
);

export default SettingCardWrapper;
