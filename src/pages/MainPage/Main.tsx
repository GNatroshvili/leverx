import React, { useEffect } from "react";
import { useGetUsersQuery } from "../../store/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import { getStoredUser } from "../../utils/auth";
import type { Employee } from "../../utils/auth";
import EmployeeManage from "../../components/Main/EmployeeManage";
import EmptyEmployeesWrapper from "../../components/Main/EmptyEmployeesWrapper";
import EmployeeCardsWrapper from "../../components/Main/EmployeeCardsWrapper";
import EmployeeHeader from "../../components/Main/EmployeeHeader";
import EmployeeListCardsWrapper from "../../components/Main/EmployeeListCardsWrapper";
import MobileSearchWrapper from "../../components/Main/MobileSearchWrapper";
import SearchWrapper from "../../components/Main/SearchWrapper";
import "../../components/Main/style.scss";
import "../../components/Header/header.scss";
import "../../layout.css";
import "../../index.css";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import {
  setCurrentUser,
  setEmployees,
  setFilteredEmployees,
  setBuildings,
  setDepartments,
  setViewMode,
  setSearchMode,
  setBasicSearchQuery,
  setAdvancedSearch,
} from "../../store/mainPageSlice";

type SearchMode = "basic" | "advanced";

interface AdvancedSearchParams {
  name: string;
  email: string;
  phone: string;
  skype: string;
  building: string;
  room: string;
  department: string;
}

const Main: React.FC = () => {
  // handler to update Redux state for view mode
  const handleSetViewMode = (mode: "grid" | "list") => {
    dispatch(setViewMode(mode));
  };
  // handlers to update Redux state for search inputs
  const handleSetSearchMode = (mode: "basic" | "advanced") => {
    dispatch(setSearchMode(mode));
    // optionally reset search fields when switching modes
    if (mode === "basic") {
      dispatch(
        setAdvancedSearch({
          name: "",
          email: "",
          phone: "",
          skype: "",
          building: "",
          room: "",
          department: "",
        })
      );
    } else {
      dispatch(setBasicSearchQuery(""));
    }
  };

  const handleSetBasicSearchQuery = (query: string) => {
    dispatch(setBasicSearchQuery(query));
  };

  const handleSetAdvancedSearch = (params: any) => {
    dispatch(setAdvancedSearch(params));
  };
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const { data } = useGetUsersQuery();
  const dispatch = useDispatch();
  const employees = useSelector((state: RootState) => state.mainPage.employees);
  const filteredEmployees = useSelector(
    (state: RootState) => state.mainPage.filteredEmployees
  );
  const currentUser = useSelector(
    (state: RootState) => state.mainPage.currentUser
  );
  const viewMode = useSelector((state: RootState) => state.mainPage.viewMode);
  const searchMode = useSelector(
    (state: RootState) => state.mainPage.searchMode
  );
  const basicSearchQuery = useSelector(
    (state: RootState) => state.mainPage.basicSearchQuery
  );
  const advancedSearch = useSelector(
    (state: RootState) => state.mainPage.advancedSearch
  );
  const buildings = useSelector((state: RootState) => state.mainPage.buildings);
  const departments = useSelector(
    (state: RootState) => state.mainPage.departments
  );

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate("/");
      return;
    }
    if (data && data.success) {
      dispatch(setEmployees(data.employees));
      dispatch(setFilteredEmployees(data.employees));
      const loggedInUser = data.employees.find(
        (emp: Employee) => emp.email === user.email
      );
      dispatch(setCurrentUser(loggedInUser || null));
      dispatch(
        setBuildings(
          Array.from(
            new Set(data.employees.map((emp: Employee) => String(emp.building)))
          ) as string[]
        )
      );
      dispatch(
        setDepartments(
          Array.from(
            new Set(
              data.employees.map((emp: Employee) => String(emp.department))
            )
          ) as string[]
        )
      );
    }
  }, [navigate, data, dispatch]);

  useEffect(() => {
    const mode = searchParams.get("mode") || "basic";
    dispatch(setSearchMode(mode as SearchMode));
    if (mode === "basic") {
      const query = searchParams.get("query") || "";
      dispatch(setBasicSearchQuery(query));
      if (query) performBasicSearch(query, employees);
    } else if (mode === "advanced") {
      const advParams: AdvancedSearchParams = {
        name: searchParams.get("name") || "",
        email: searchParams.get("email") || "",
        phone: searchParams.get("phone") || "",
        skype: searchParams.get("skype") || "",
        building: searchParams.get("building") || "",
        room: searchParams.get("room") || "",
        department: searchParams.get("department") || "",
      };
      dispatch(setAdvancedSearch(advParams));
      if (Object.values(advParams).some((v) => v))
        performAdvancedSearch(advParams, employees);
    }
  }, [searchParams, employees, dispatch]);

  const performBasicSearch = (
    query: string,
    empList: Employee[] = employees
  ) => {
    if (!query.trim()) {
      dispatch(setFilteredEmployees(empList));
      return;
    }
    const searchTerm = query.toLowerCase().trim();
    const filtered = empList.filter((emp) => {
      const id = emp._id.toLowerCase();
      const firstName = emp.first_name.toLowerCase();
      const lastName = emp.last_name.toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      return (
        id.includes(searchTerm) ||
        firstName.includes(searchTerm) ||
        lastName.includes(searchTerm) ||
        fullName.includes(searchTerm)
      );
    });
    dispatch(setFilteredEmployees(filtered));
  };

  const performAdvancedSearch = (
    params: AdvancedSearchParams,
    empList: Employee[] = employees
  ) => {
    const filtered = empList.filter((emp) => {
      const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
      const email = emp.email.toLowerCase();
      const phone = emp.phone.toLowerCase();
      const skype = emp.skype.toLowerCase();
      const building = emp.building.toLowerCase();
      const room = emp.room.toString().toLowerCase();
      const department = emp.department.toLowerCase();
      const nameMatch =
        !params.name ||
        fullName.includes(params.name.toLowerCase()) ||
        emp.first_name.toLowerCase().includes(params.name.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(params.name.toLowerCase());
      const emailMatch =
        !params.email || email.includes(params.email.toLowerCase());
      const phoneMatch =
        !params.phone || phone.includes(params.phone.toLowerCase());
      const skypeMatch =
        !params.skype || skype.includes(params.skype.toLowerCase());
      const buildingMatch =
        !params.building || building === params.building.toLowerCase();
      const roomMatch =
        !params.room || room.includes(params.room.toLowerCase());
      const departmentMatch =
        !params.department || department === params.department.toLowerCase();
      return (
        nameMatch &&
        emailMatch &&
        phoneMatch &&
        skypeMatch &&
        buildingMatch &&
        roomMatch &&
        departmentMatch
      );
    });
    dispatch(setFilteredEmployees(filtered));
  };

  const handleBasicSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performBasicSearch(basicSearchQuery);
    setSearchParams({ mode: "basic", query: basicSearchQuery });
  };

  const handleAdvancedSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performAdvancedSearch(advancedSearch);
    const params: any = { mode: "advanced" };
    Object.entries(advancedSearch).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    setSearchParams(params);
  };

  const handleEmployeeClick = (employeeId: string) => {
    navigate(`/users/${employeeId}`);
  };

  const currentUserInfo = currentUser
    ? {
        firstName: currentUser.first_name,
        lastName: currentUser.last_name,
        avatar: currentUser.user_avatar,
        id: currentUser._id,
      }
    : undefined;

  return (
    <>
      {currentUserInfo && (
        <Header currentUser={currentUserInfo} showUserInfo={true} />
      )}
      {!currentUserInfo && <Header showUserInfo={false} />}
      <MobileSearchWrapper />
      <div className="main-page-wrapper container">
        <SearchWrapper
          searchMode={searchMode}
          setSearchMode={handleSetSearchMode}
          basicSearchQuery={basicSearchQuery}
          setBasicSearchQuery={handleSetBasicSearchQuery}
          handleBasicSearch={handleBasicSearch}
          advancedSearch={advancedSearch}
          setAdvancedSearch={handleSetAdvancedSearch}
          buildings={buildings}
          departments={departments}
          handleAdvancedSearch={handleAdvancedSearch}
        />
        <div className="employee-wrapper">
          <EmployeeManage
            count={filteredEmployees.length}
            viewMode={viewMode}
            setViewMode={handleSetViewMode}
          />
          {/* Animated transition between grid and list views */}
          <div className="employee-view-transition">
            <div
              key={viewMode}
              className={`employee-view-content fade-slide-in`}
            >
              {viewMode === "grid" ? (
                filteredEmployees.length === 0 ? (
                  <EmptyEmployeesWrapper />
                ) : (
                  <EmployeeCardsWrapper
                    employees={filteredEmployees}
                    onEmployeeClick={handleEmployeeClick}
                  />
                )
              ) : filteredEmployees.length === 0 ? (
                <EmptyEmployeesWrapper />
              ) : (
                <>
                  <EmployeeHeader />
                  <EmployeeListCardsWrapper
                    employees={filteredEmployees}
                    onEmployeeClick={handleEmployeeClick}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
