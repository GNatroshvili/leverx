import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Employee } from "../utils/auth";

export type ViewMode = "grid" | "list";
export type SearchMode = "basic" | "advanced";

export interface AdvancedSearchParams {
  name: string;
  email: string;
  phone: string;
  skype: string;
  building: string;
  room: string;
  department: string;
}

export interface MainPageState {
  employees: Employee[];
  filteredEmployees: Employee[];
  currentUser: Employee | null;
  viewMode: ViewMode;
  searchMode: SearchMode;
  basicSearchQuery: string;
  advancedSearch: AdvancedSearchParams;
  buildings: string[];
  departments: string[];
}

const initialState: MainPageState = {
  employees: [],
  filteredEmployees: [],
  currentUser: null,
  viewMode: "grid",
  searchMode: "basic",
  basicSearchQuery: "",
  advancedSearch: {
    name: "",
    email: "",
    phone: "",
    skype: "",
    building: "",
    room: "",
    department: "",
  },
  buildings: [],
  departments: [],
};

const mainPageSlice = createSlice({
  name: "mainPage",
  initialState,
  reducers: {
    setEmployees(state, action: PayloadAction<Employee[]>) {
      state.employees = action.payload;
    },
    setFilteredEmployees(state, action: PayloadAction<Employee[]>) {
      state.filteredEmployees = action.payload;
    },
    setCurrentUser(state, action: PayloadAction<Employee | null>) {
      state.currentUser = action.payload;
    },
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },
    setSearchMode(state, action: PayloadAction<SearchMode>) {
      state.searchMode = action.payload;
    },
    setBasicSearchQuery(state, action: PayloadAction<string>) {
      state.basicSearchQuery = action.payload;
    },
    setAdvancedSearch(state, action: PayloadAction<AdvancedSearchParams>) {
      state.advancedSearch = action.payload;
    },
    setBuildings(state, action: PayloadAction<string[]>) {
      state.buildings = action.payload;
    },
    setDepartments(state, action: PayloadAction<string[]>) {
      state.departments = action.payload;
    },
  },
});

export const {
  setEmployees,
  setFilteredEmployees,
  setCurrentUser,
  setViewMode,
  setSearchMode,
  setBasicSearchQuery,
  setAdvancedSearch,
  setBuildings,
  setDepartments,
} = mainPageSlice.actions;

export default mainPageSlice.reducer;
