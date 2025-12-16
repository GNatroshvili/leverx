import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoredUser, formatDateOfBirth } from "../../utils/auth";
import type { Employee } from "../../utils/auth";
import type { EditFormData } from "./types";
import { useGetUsersQuery, useUpdateUserMutation } from "../../store/api";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import {
  setCurrentEmployee,
  setIsEditMode,
  setCanEdit,
  setManagers,
  setFormData,
  updateFormField,
} from "../../store/employeeDetailsSlice";
import CurrentUserAvatar from "./CurrentUserAvatar";
import EmployeeFullNameWrapper from "./EmployeeFullNameWrapper";
import CopyLinkBtn from "./CopyLinkBtn";
import ButtonGroup from "./ButtonGroup";
import EmployeeDetailedInfoWrapper from "./EmployeeDetailedInfoWrapper";
import LeftArrow from "../../public/assets/left-arrow.png";

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { currentEmployee, isEditMode, canEdit, managers, formData } =
    useSelector((state: RootState) => state.employeeDetails);

  const { data } = useGetUsersQuery();
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate("/");
      return;
    }
    if (data && data.success) {
      const employees: Employee[] = data.employees;
      const managerList = employees.filter(
        (emp: any) => emp.role === "manager"
      );
      dispatch(setManagers(managerList));
      const loggedInUser = employees.find((emp) => emp.email === user.email);
      if (id) {
        const employee = employees.find((emp) => emp._id === id);
        if (employee) {
          dispatch(setCurrentEmployee(employee));
          dispatch(
            setCanEdit(determineEditAccess(employee, loggedInUser, user))
          );
          dispatch(setFormData(initializeFormData(employee)));
        } else {
          navigate("/404");
        }
      }
    }
  }, [id, navigate, data, dispatch]);

  const initializeFormData = (employee: Employee) => {
    const emp = employee as any;
    const dateBirth = emp.date_birth || emp.date_of_birth;
    const managerId = emp.manager?.id || emp.manager?._id || "";
    const timestampToDateString = (timestamp: number | undefined): string => {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      const dateStr = date.toISOString().split("T")[0];
      return dateStr || "";
    };
    return {
      first_name: employee.first_name || "",
      last_name: employee.last_name || "",
      first_native_name:
        emp.first_native_name === "N/A" ? "" : emp.first_native_name || "",
      middle_native_name:
        emp.middle_native_name === "N/A" ? "" : emp.middle_native_name || "",
      last_native_name:
        emp.last_native_name === "N/A" ? "" : emp.last_native_name || "",
      department:
        employee.department === "N/A" ? "" : employee.department || "",
      building: employee.building === "N/A" ? "" : employee.building || "",
      room: employee.room === "N/A" ? "" : employee.room || "",
      desk_number:
        employee.desk_number === "N/A"
          ? ""
          : String(employee.desk_number || ""),
      date_birth_year: dateBirth?.year ? String(dateBirth.year) : "",
      date_birth_month: dateBirth?.month
        ? String(dateBirth.month).padStart(2, "0")
        : "",
      date_birth_day: dateBirth?.day
        ? String(dateBirth.day).padStart(2, "0")
        : "",
      manager_id: managerId ? String(managerId) : "",
      phone: employee.phone === "N/A" ? "" : employee.phone || "",
      email: employee.email === "N/A" ? "" : employee.email || "",
      skype: employee.skype === "N/A" ? "" : employee.skype || "",
      cnumber: employee.cnumber === "N/A" ? "" : employee.cnumber || "",
      citizenship:
        employee.citizenship === "N/A" ? "" : employee.citizenship || "",
      visa1_issuing_country: employee.visa?.[0]?.issuing_country || "",
      visa1_type: employee.visa?.[0]?.type || "",
      visa1_start_date:
        timestampToDateString(employee.visa?.[0]?.start_date) || "",
      visa1_end_date: timestampToDateString(employee.visa?.[0]?.end_date) || "",
      visa2_issuing_country: employee.visa?.[1]?.issuing_country || "",
      visa2_type: employee.visa?.[1]?.type || "",
      visa2_start_date:
        timestampToDateString(employee.visa?.[1]?.start_date) || "",
      visa2_end_date: timestampToDateString(employee.visa?.[1]?.end_date) || "",
    };
  };

  const determineEditAccess = (
    employee: Employee,
    loggedInUser: Employee | undefined,
    user: any
  ): boolean => {
    if (!employee || !loggedInUser) return false;

    // admin can edit anyone
    const userIsAdmin =
      user?.isAdmin === true || user?.isAdmin === 1 || user?.isAdmin === "1";
    if (userIsAdmin) return true;

    // HR/Manager can edit their subordinates
    const userRole = user?.role || "employee";
    const userIsHR = userRole === "manager";
    // manager object from the server may contain `id` (not `_id`) — accept both
    const managerId =
      (employee.manager as any)?._id || (employee.manager as any)?.id;
    if (userIsHR && employee.manager && managerId === loggedInUser._id) {
      return true;
    }

    return false;
  };

  const handleBackClick = () => {
    navigate("/main");
  };

  const handleManagerClick = () => {
    if (isEditMode) return;
    const managerId =
      (currentEmployee as any)?.manager?._id ||
      (currentEmployee as any)?.manager?.id;
    if (managerId) {
      navigate(`/users/${managerId}`);
    }
  };

  const handleInputChange = (field: keyof EditFormData, value: string) => {
    dispatch(updateFormField({ field, value }));
  };

  const handleEditClick = () => {
    if (!isEditMode) {
      dispatch(setIsEditMode(true));
    } else {
      handleSave();
    }
  };

  const handleCancelEdit = () => {
    dispatch(setIsEditMode(false));
    if (currentEmployee) {
      dispatch(setFormData(initializeFormData(currentEmployee)));
    }
  };

  const handleSave = async () => {
    if (!currentEmployee) return;

    const user = getStoredUser();
    const updates: any = {};

    // collect changed values
    const emp = currentEmployee as any;
    const originalDateBirth = emp.date_birth || emp.date_of_birth;
    const originalManagerId = emp.manager?.id || emp.manager?._id || "";

    if (
      formData.first_name &&
      formData.first_name !== currentEmployee.first_name
    ) {
      updates.first_name = formData.first_name;
    }
    if (
      formData.last_name &&
      formData.last_name !== currentEmployee.last_name
    ) {
      updates.last_name = formData.last_name;
    }

    const origFirstNative =
      emp.first_native_name === "N/A" ? "" : emp.first_native_name || "";
    const origMiddleNative =
      emp.middle_native_name === "N/A" ? "" : emp.middle_native_name || "";
    const origLastNative =
      emp.last_native_name === "N/A" ? "" : emp.last_native_name || "";

    if (formData.first_native_name !== origFirstNative) {
      updates.first_native_name = formData.first_native_name || null;
    }
    if (formData.middle_native_name !== origMiddleNative) {
      updates.middle_native_name = formData.middle_native_name || null;
    }
    if (formData.last_native_name !== origLastNative) {
      updates.last_native_name = formData.last_native_name || null;
    }

    const origDept =
      currentEmployee.department === "N/A"
        ? ""
        : currentEmployee.department || "";
    if (formData.department !== origDept) {
      updates.department = formData.department || null;
    }

    const origBuilding =
      currentEmployee.building === "N/A" ? "" : currentEmployee.building || "";
    if (formData.building !== origBuilding) {
      updates.building = formData.building || null;
    }

    const origRoom =
      currentEmployee.room === "N/A" ? "" : currentEmployee.room || "";
    if (formData.room !== origRoom) {
      updates.room = formData.room || null;
    }

    const origDesk =
      currentEmployee.desk_number === "N/A"
        ? ""
        : String(currentEmployee.desk_number || "");
    if (formData.desk_number !== origDesk) {
      updates.desk_number = formData.desk_number
        ? parseInt(formData.desk_number)
        : null;
    }

    // date of birth
    if (
      formData.date_birth_year &&
      formData.date_birth_month &&
      formData.date_birth_day
    ) {
      const newYear = parseInt(formData.date_birth_year);
      const newMonth = parseInt(formData.date_birth_month);
      const newDay = parseInt(formData.date_birth_day);

      if (
        originalDateBirth?.year !== newYear ||
        originalDateBirth?.month !== newMonth ||
        originalDateBirth?.day !== newDay
      ) {
        updates.date_birth_year = newYear;
        updates.date_birth_month = newMonth;
        updates.date_birth_day = newDay;
      }
    }

    if (formData.manager_id !== String(originalManagerId)) {
      updates.manager_id = formData.manager_id || null;
    }

    const origPhone =
      currentEmployee.phone === "N/A" ? "" : currentEmployee.phone || "";
    if (formData.phone !== origPhone) {
      updates.phone = formData.phone || null;
    }

    const origEmail =
      currentEmployee.email === "N/A" ? "" : currentEmployee.email || "";
    if (formData.email !== origEmail) {
      updates.email = formData.email || null;
    }

    const origSkype =
      currentEmployee.skype === "N/A" ? "" : currentEmployee.skype || "";
    if (formData.skype !== origSkype) {
      updates.skype = formData.skype || null;
    }

    const origCnumber =
      currentEmployee.cnumber === "N/A" ? "" : currentEmployee.cnumber || "";
    if (formData.cnumber !== origCnumber) {
      updates.cnumber = formData.cnumber || null;
    }

    const origCitizenship =
      currentEmployee.citizenship === "N/A"
        ? ""
        : currentEmployee.citizenship || "";
    if (formData.citizenship !== origCitizenship) {
      updates.citizenship = formData.citizenship || null;
    }

    // Helper to convert date string to timestamp
    const dateStringToTimestamp = (dateStr: string) => {
      if (!dateStr) return null;
      return new Date(dateStr).getTime();
    };

    // Visa 1 updates
    const origVisa1Country = currentEmployee.visa?.[0]?.issuing_country || "";
    const origVisa1Type = currentEmployee.visa?.[0]?.type || "";
    const origVisa1Start = currentEmployee.visa?.[0]?.start_date
      ? new Date(currentEmployee.visa[0].start_date).toISOString().split("T")[0]
      : "";
    const origVisa1End = currentEmployee.visa?.[0]?.end_date
      ? new Date(currentEmployee.visa[0].end_date).toISOString().split("T")[0]
      : "";

    if (formData.visa1_issuing_country !== origVisa1Country) {
      updates.visa1_issuing_country = formData.visa1_issuing_country || null;
    }
    if (formData.visa1_type !== origVisa1Type) {
      updates.visa1_type = formData.visa1_type || null;
    }
    if (formData.visa1_start_date !== origVisa1Start) {
      updates.visa1_start_date = dateStringToTimestamp(
        formData.visa1_start_date
      );
    }
    if (formData.visa1_end_date !== origVisa1End) {
      updates.visa1_end_date = dateStringToTimestamp(formData.visa1_end_date);
    }

    // Visa 2 updates
    const origVisa2Country = currentEmployee.visa?.[1]?.issuing_country || "";
    const origVisa2Type = currentEmployee.visa?.[1]?.type || "";
    const origVisa2Start = currentEmployee.visa?.[1]?.start_date
      ? new Date(currentEmployee.visa[1].start_date).toISOString().split("T")[0]
      : "";
    const origVisa2End = currentEmployee.visa?.[1]?.end_date
      ? new Date(currentEmployee.visa[1].end_date).toISOString().split("T")[0]
      : "";

    if (formData.visa2_issuing_country !== origVisa2Country) {
      updates.visa2_issuing_country = formData.visa2_issuing_country || null;
    }
    if (formData.visa2_type !== origVisa2Type) {
      updates.visa2_type = formData.visa2_type || null;
    }
    if (formData.visa2_start_date !== origVisa2Start) {
      updates.visa2_start_date = dateStringToTimestamp(
        formData.visa2_start_date
      );
    }
    if (formData.visa2_end_date !== origVisa2End) {
      updates.visa2_end_date = dateStringToTimestamp(formData.visa2_end_date);
    }

    if (Object.keys(updates).length === 0) {
      alert("No changes to save");
      setIsEditMode(false);
      return;
    }

    try {
      const result = await updateUser({
        id: currentEmployee._id,
        updates,
        requestingUserEmail: user?.email || "",
      }).unwrap();
      if (result.success) {
        alert("Changes saved successfully!");
        // update Redux store with new employee data
        dispatch(setCurrentEmployee(result.employee));
        // update managers list in case role changed
        if (data && data.success) {
          const employees: Employee[] = data.employees.map((emp: Employee) =>
            emp._id === result.employee._id ? result.employee : emp
          );
          const managerList = employees.filter(
            (emp: any) => emp.role === "manager"
          );
          dispatch(setManagers(managerList));
        }
        dispatch(setFormData(initializeFormData(result.employee)));
        dispatch(setIsEditMode(false));
      } else {
        alert(result.message || "Failed to save changes");
      }
    } catch {
      alert("Failed to save changes. Please try again.");
    }
  };

  const getDateOfBirth = () => {
    const emp = currentEmployee as any;
    const dob = emp.date_birth || emp.date_of_birth;
    return dob ? formatDateOfBirth(dob) : "N/A";
  };

  if (!currentEmployee) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  const fullName = `${currentEmployee.first_name} ${currentEmployee.last_name}`;
  const emp = currentEmployee as any;
  const hasNativeName =
    emp.first_native_name &&
    emp.first_native_name !== "N/A" &&
    emp.middle_native_name !== "N/A" &&
    emp.last_native_name !== "N/A";
  const nativeFullName = hasNativeName
    ? `${emp.first_native_name} ${emp.middle_native_name} ${emp.last_native_name}`
    : "N/A";

  return (
    <div className="container">
      <div className="employee-details-wrapper fade-slide-in">
        <img
          src={LeftArrow}
          alt="left-arrow-icon"
          className="left-arrow-icon"
          onClick={handleBackClick}
        />

        <div className="employee-avatar-wrapper">
          <CurrentUserAvatar currentEmployee={currentEmployee} />

          <EmployeeFullNameWrapper
            isEditMode={isEditMode}
            formData={formData}
            fullName={fullName}
            nativeFullName={nativeFullName}
            handleInputChange={handleInputChange}
          />

          <CopyLinkBtn />

          <ButtonGroup
            canEdit={canEdit}
            isEditMode={isEditMode}
            handleEditClick={handleEditClick}
            handleCancelEdit={handleCancelEdit}
          />
        </div>

        <div className="divider-line"></div>

        <EmployeeDetailedInfoWrapper
          currentEmployee={currentEmployee}
          isEditMode={isEditMode}
          formData={formData}
          managers={managers}
          getDateOfBirth={getDateOfBirth}
          handleInputChange={handleInputChange}
          handleManagerClick={handleManagerClick}
        />
      </div>
    </div>
  );
};

export default EmployeeDetails;
