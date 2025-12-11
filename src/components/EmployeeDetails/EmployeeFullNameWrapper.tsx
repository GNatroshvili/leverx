import React from "react";
import type { EditFormData } from "./types";

interface EmployeeFullNameWrapperProps {
  isEditMode: boolean;
  formData: EditFormData;
  fullName: string;
  nativeFullName: string;
  handleInputChange: (field: keyof EditFormData, value: string) => void;
}

const EmployeeFullNameWrapper: React.FC<EmployeeFullNameWrapperProps> = ({
  isEditMode,
  formData,
  fullName,
  nativeFullName,
  handleInputChange,
}) => {
  return (
    <div className="employee-full-name-wrapper">
      {isEditMode ? (
        <div className="row row--split">
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
            placeholder="First Name"
            className="edit-input flex-1"
          />
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
            placeholder="Last Name"
            className="edit-input flex-1"
          />
        </div>
      ) : (
        <p id="details-employee-name">{fullName}</p>
      )}

      {isEditMode ? (
        <div className="row native-row">
          <input
            type="text"
            value={formData.first_native_name}
            onChange={(e) =>
              handleInputChange("first_native_name", e.target.value)
            }
            placeholder="First Native"
            className="edit-input native-input flex-1"
          />
          <input
            type="text"
            value={formData.middle_native_name}
            onChange={(e) =>
              handleInputChange("middle_native_name", e.target.value)
            }
            placeholder="Middle Native"
            className="edit-input native-input flex-1"
          />
          <input
            type="text"
            value={formData.last_native_name}
            onChange={(e) =>
              handleInputChange("last_native_name", e.target.value)
            }
            placeholder="Last Native"
            className="edit-input native-input flex-1"
          />
        </div>
      ) : (
        <p id="details-employee-native-name" className="full-name">
          {nativeFullName}
        </p>
      )}
    </div>
  );
};

export default EmployeeFullNameWrapper;
