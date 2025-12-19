import React from "react";
import type { Employee } from "../../utils/auth";
import type { EditFormData } from "./types";
import { formatDate, isVisaExpired } from "../../utils/auth";
import DataSectionTitle from "./DataSectionTitle";
import VerticalDividerLine from "./VerticalDividerLine";
import DataColumn from "./DataColumn";
import DataLineWrapper from "./DataLineWrapper";

interface EmployeeDetailedInfoWrapperProps {
  currentEmployee: Employee;
  isEditMode: boolean;
  formData: EditFormData;
  managers: Employee[];
  getDateOfBirth: () => string;
  handleInputChange: (field: keyof EditFormData, value: string) => void;
  handleManagerClick: () => void;
}

const EmployeeDetailedInfoWrapper: React.FC<
  EmployeeDetailedInfoWrapperProps
> = ({
  currentEmployee,
  isEditMode,
  formData,
  managers,
  getDateOfBirth,
  handleInputChange,
  handleManagerClick,
}) => {
  const emp = currentEmployee as any;
  const managerName =
    currentEmployee.manager && currentEmployee.manager.first_name !== "N/A"
      ? `${currentEmployee.manager.first_name} ${currentEmployee.manager.last_name}`
      : "N/A";

  return (
    <div className="employee-detailed-info-wrapper">
      {/* GENERAL INFO */}
      <div>
        <DataSectionTitle title="GENERAL INFO" />
        <VerticalDividerLine />
        <DataColumn>
          <DataLineWrapper
            icon="/assets/briefcase.png"
            iconAlt="briefcase-icon"
            label="Department"
          >
            {isEditMode ? (
              <input
                type="text"
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                placeholder="Enter department"
                className="edit-input"
              />
            ) : (
              <p id="details-department">
                {currentEmployee.department || "N/A"}
              </p>
            )}
          </DataLineWrapper>

          <DataLineWrapper
            icon="/assets/building.png"
            iconAlt="building-icon"
            label="Building"
          >
            {isEditMode ? (
              <input
                type="text"
                value={formData.building}
                onChange={(e) => handleInputChange("building", e.target.value)}
                placeholder="Enter building"
                className="edit-input"
              />
            ) : (
              <p id="details-building">{currentEmployee.building || "N/A"}</p>
            )}
          </DataLineWrapper>

          <DataLineWrapper
            icon="/assets/door.png"
            iconAlt="door-icon"
            label="Room"
          >
            {isEditMode ? (
              <input
                type="text"
                value={formData.room}
                onChange={(e) => handleInputChange("room", e.target.value)}
                placeholder="Enter room"
                className="edit-input"
              />
            ) : (
              <p id="details-room">{currentEmployee.room || "N/A"}</p>
            )}
          </DataLineWrapper>

          <DataLineWrapper
            icon="/assets/desk-number.png"
            iconAlt="desk-icon"
            label="Desk number"
          >
            {isEditMode ? (
              <input
                type="number"
                value={formData.desk_number}
                onChange={(e) =>
                  handleInputChange("desk_number", e.target.value)
                }
                placeholder="Enter desk number"
                className="edit-input"
              />
            ) : (
              <p id="details-desk-number">
                {currentEmployee.desk_number || "N/A"}
              </p>
            )}
          </DataLineWrapper>

          <DataLineWrapper
            icon="/assets/date-of-birth.png"
            iconAlt="date-of-birth-icon"
            label="Date of birth"
          >
            {isEditMode ? (
              <input
                type="date"
                value={
                  formData.date_birth_year &&
                  formData.date_birth_month &&
                  formData.date_birth_day
                    ? `${formData.date_birth_year}-${formData.date_birth_month}-${formData.date_birth_day}`
                    : ""
                }
                onChange={(e) => {
                  const [year, month, day] = e.target.value.split("-");
                  handleInputChange("date_birth_year", year || "");
                  handleInputChange("date_birth_month", month || "");
                  handleInputChange("date_birth_day", day || "");
                }}
                className="edit-input"
              />
            ) : (
              <p id="details-date-of-birth">{getDateOfBirth()}</p>
            )}
          </DataLineWrapper>

          <DataLineWrapper
            icon="/assets/manager.png"
            iconAlt="manager-icon"
            label="Manager"
          >
            {isEditMode ? (
              <select
                value={formData.manager_id}
                onChange={(e) =>
                  handleInputChange("manager_id", e.target.value)
                }
                className="edit-input select-input"
              >
                <option value="">No Manager</option>
                {managers.map((manager) => (
                  <option key={manager._id} value={manager._id}>
                    {manager.first_name} {manager.last_name}
                  </option>
                ))}
              </select>
            ) : (
              <p
                id="details-manager"
                className={`blue-text ${
                  emp.manager?._id || emp.manager?.id ? "clickable" : ""
                }`}
                onClick={handleManagerClick}
              >
                {managerName}
              </p>
            )}
          </DataLineWrapper>
        </DataColumn>
      </div>

      {/* CONTACTS */}
      <div className="employee-contact-info-wrapper">
        <DataSectionTitle title="CONTACTS" />
        <VerticalDividerLine />
        <DataColumn>
          <DataLineWrapper
            icon="/assets/mobile-phone.png"
            iconAlt="mobile-phone-icon"
            label="Mobile phone"
          >
            {isEditMode ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className="edit-input"
              />
            ) : (
              <p id="details-phone" className="blue-text">
                {currentEmployee.phone || "N/A"}
              </p>
            )}
          </DataLineWrapper>

          <DataLineWrapper
            icon="/assets/email.png"
            iconAlt="email-icon"
            label="Email"
          >
            {isEditMode ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email"
                className="edit-input"
              />
            ) : (
              <p id="details-email" className="blue-text">
                {currentEmployee.email || "N/A"}
              </p>
            )}
          </DataLineWrapper>

          <DataLineWrapper
            icon="/assets/skype.png"
            iconAlt="skype-icon"
            label="Skype"
          >
            {isEditMode ? (
              <input
                type="text"
                value={formData.skype}
                onChange={(e) => handleInputChange("skype", e.target.value)}
                placeholder="Enter Skype ID"
                className="edit-input"
              />
            ) : (
              <p id="details-skype" className="blue-text">
                {currentEmployee.skype || "N/A"}
              </p>
            )}
          </DataLineWrapper>

          <DataLineWrapper
            icon="/assets/c-number-1.png"
            iconAlt="c-number-icon"
            label="C-number"
          >
            {isEditMode ? (
              <input
                type="text"
                value={formData.cnumber}
                onChange={(e) => handleInputChange("cnumber", e.target.value)}
                placeholder="Enter C-number"
                className="edit-input"
              />
            ) : (
              <p id="details-cnumber">{currentEmployee.cnumber || "N/A"}</p>
            )}
          </DataLineWrapper>
        </DataColumn>
      </div>

      {/* TRAVEL INFO */}
      <div className="employee-travel-info-wrapper">
        <DataSectionTitle title="TRAVEL INFO" />
        <VerticalDividerLine />
        <DataColumn>
          <DataLineWrapper
            icon="/assets/citizienship.png"
            iconAlt="citizienship-icon"
            label="Citizenship"
          >
            {isEditMode ? (
              <input
                type="text"
                value={formData.citizenship}
                onChange={(e) =>
                  handleInputChange("citizenship", e.target.value)
                }
                placeholder="Enter citizenship"
                className="edit-input"
              />
            ) : (
              <p id="details-citizenship">
                {currentEmployee.citizenship || "N/A"}
              </p>
            )}
          </DataLineWrapper>

          <DataLineWrapper
            icon="/assets/visa.png"
            iconAlt="visa-icon"
            label="Visa 1"
            iconClassName="icon-size"
          >
            <p id="details-visa-1">
              {currentEmployee.visa &&
              currentEmployee.visa[0] &&
              currentEmployee.visa[0].issuing_country &&
              currentEmployee.visa[0].type
                ? `${currentEmployee.visa[0].issuing_country} - ${currentEmployee.visa[0].type}`
                : "N/A"}
            </p>
          </DataLineWrapper>

          <DataLineWrapper
            icon="/assets/date-of-birth.png"
            iconAlt="date-icon"
            label="Visa 1 validity period"
          >
            <p id="details-visa-1-period">
              {currentEmployee.visa &&
              currentEmployee.visa[0] &&
              currentEmployee.visa[0].start_date &&
              currentEmployee.visa[0].end_date
                ? `${formatDate(
                    currentEmployee.visa[0].start_date
                  )} - ${formatDate(currentEmployee.visa[0].end_date)}${
                    isVisaExpired(currentEmployee.visa[0].end_date)
                      ? " (expired)"
                      : ""
                  }`
                : "N/A"}
            </p>
          </DataLineWrapper>

          <DataLineWrapper
            icon="/assets/visa.png"
            iconAlt="visa-icon"
            label="Visa 2"
          >
            <p id="details-visa-2">
              {currentEmployee.visa &&
              currentEmployee.visa[1] &&
              currentEmployee.visa[1].issuing_country &&
              currentEmployee.visa[1].type
                ? `${currentEmployee.visa[1].issuing_country} - ${currentEmployee.visa[1].type}`
                : "N/A"}
            </p>
          </DataLineWrapper>

          <DataLineWrapper
            icon="/assets/date-of-birth.png"
            iconAlt="date-icon"
            label="Visa 2 validity period"
          >
            <p id="details-visa-2-period">
              {currentEmployee.visa &&
              currentEmployee.visa[1] &&
              currentEmployee.visa[1].start_date &&
              currentEmployee.visa[1].end_date
                ? `${formatDate(
                    currentEmployee.visa[1].start_date
                  )} - ${formatDate(currentEmployee.visa[1].end_date)}${
                    isVisaExpired(currentEmployee.visa[1].end_date)
                      ? " (expired)"
                      : ""
                  }`
                : "N/A"}
            </p>
          </DataLineWrapper>
        </DataColumn>
      </div>
    </div>
  );
};

export default EmployeeDetailedInfoWrapper;
