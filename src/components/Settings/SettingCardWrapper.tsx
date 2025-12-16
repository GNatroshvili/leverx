import React from "react";
import SettingsCardTitle from "./SettingsCardTitle";
import DividerLine from "./DividerLine";
import NavigationWrapper from "./NavigationWrapper";
import EmployeeListWrapper from "./EmployeeListWrapper";

interface SettingCardWrapperProps {
  loading: boolean;
  error: string | null;
  employees: React.ReactNode;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent | React.KeyboardEvent) => void;
}

const SettingCardWrapper: React.FC<SettingCardWrapperProps> = ({ loading, error, employees, searchQuery, onSearchChange, onSearchSubmit }) => (
  <div className="setting-card-wrapper">
    <SettingsCardTitle />
    <DividerLine />
    <NavigationWrapper searchQuery={searchQuery} onSearchChange={onSearchChange} onSearchSubmit={onSearchSubmit} />
    <DividerLine />
    <EmployeeListWrapper loading={loading} error={error} employees={employees} />
  </div>
);

export default SettingCardWrapper;
