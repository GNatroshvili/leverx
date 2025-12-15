import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Employee } from "../utils/auth";
import type { EditFormData } from "../components/EmployeeDetails/types";

export interface EmployeeDetailsState {
  currentEmployee: Employee | null;
  isEditMode: boolean;
  canEdit: boolean;
  managers: Employee[];
  formData: EditFormData;
}

const initialState: EmployeeDetailsState = {
  currentEmployee: null,
  isEditMode: false,
  canEdit: false,
  managers: [],
  formData: {
    first_name: "",
    last_name: "",
    first_native_name: "",
    middle_native_name: "",
    last_native_name: "",
    department: "",
    building: "",
    room: "",
    desk_number: "",
    date_birth_year: "",
    date_birth_month: "",
    date_birth_day: "",
    manager_id: "",
    phone: "",
    email: "",
    skype: "",
    cnumber: "",
    citizenship: "",
    visa1_issuing_country: "",
    visa1_type: "",
    visa1_start_date: "",
    visa1_end_date: "",
    visa2_issuing_country: "",
    visa2_type: "",
    visa2_start_date: "",
    visa2_end_date: "",
  },
};

const employeeDetailsSlice = createSlice({
  name: "employeeDetails",
  initialState,
  reducers: {
    setCurrentEmployee(state, action: PayloadAction<Employee | null>) {
      state.currentEmployee = action.payload;
    },
    setIsEditMode(state, action: PayloadAction<boolean>) {
      state.isEditMode = action.payload;
    },
    setCanEdit(state, action: PayloadAction<boolean>) {
      state.canEdit = action.payload;
    },
    setManagers(state, action: PayloadAction<Employee[]>) {
      state.managers = action.payload;
    },
    setFormData(state, action: PayloadAction<EditFormData>) {
      state.formData = action.payload;
    },
    updateFormField(state, action: PayloadAction<{ field: keyof EditFormData; value: string }>) {
      state.formData[action.payload.field] = action.payload.value;
    },
    resetEmployeeDetailsState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setCurrentEmployee,
  setIsEditMode,
  setCanEdit,
  setManagers,
  setFormData,
  updateFormField,
  resetEmployeeDetailsState,
} = employeeDetailsSlice.actions;

export default employeeDetailsSlice.reducer;