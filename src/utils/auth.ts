export const API_BASE_URL = "http://localhost:3000";

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  employeeId: string;
  isAdmin: boolean;
  role: string;
}

export interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_avatar: string;
  department: string;
  room: string;
  building: string;
  desk_number: string;
  date_of_birth: {
    day: number;
    month: number;
    year: number;
  };
  manager?: {
    first_name: string;
    last_name: string;
    _id: string;
  };
  skype: string;
  cnumber: string;
  citizenship: string;
  first_native_name?: string;
  middle_native_name?: string;
  last_native_name?: string;
  remote_work?: boolean;
  visa?: Array<{
    issuing_country: string;
    type: string;
    start_date: number;
    end_date: number;
  }>;
  isAdmin?: boolean;
  role?: string;
}

export const getStoredUser = (): User | null => {
  const userStr =
    sessionStorage.getItem("user") || localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const setStoredUser = (user: User, remember: boolean = false): void => {
  const userStr = JSON.stringify(user);
  if (remember) {
    localStorage.setItem("user", userStr);
  } else {
    sessionStorage.setItem("user", userStr);
  }
};

export const clearStoredUser = (): void => {
  sessionStorage.removeItem("user");
  localStorage.removeItem("user");
};

export const isAuthenticated = (): boolean => {
  return !!getStoredUser();
};

export const isAdmin = (): boolean => {
  const user = getStoredUser();
  if (!user) return false;
  const adminValue = user.isAdmin as any;
  return adminValue === true || adminValue === 1 || adminValue === "1";
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const formatDateOfBirth = (dateObj: {
  day: number;
  month: number;
  year: number;
}): string => {
  const day = String(dateObj.day).padStart(2, "0");
  const month = String(dateObj.month).padStart(2, "0");
  const year = dateObj.year;
  return `${day}.${month}.${year}`;
};

export const isVisaExpired = (endDate: number): boolean => {
  return endDate < Date.now();
};
