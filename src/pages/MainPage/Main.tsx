import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import { API_BASE_URL, getStoredUser } from "../../utils/auth";
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

type ViewMode = "grid" | "list";
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchMode, setSearchMode] = useState<SearchMode>("basic");
  const [basicSearchQuery, setBasicSearchQuery] = useState("");
  const [advancedSearch, setAdvancedSearch] = useState<AdvancedSearchParams>({
    name: "",
    email: "",
    phone: "",
    skype: "",
    building: "",
    room: "",
    department: "",
  });
  const [buildings, setBuildings] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate("/");
      return;
    }
    fetchEmployees();
  }, [navigate]);

  useEffect(() => {
    const mode = searchParams.get("mode") || "basic";
    setSearchMode(mode as SearchMode);
    if (mode === "basic") {
      const query = searchParams.get("query") || "";
      setBasicSearchQuery(query);
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
      setAdvancedSearch(advParams);
      if (Object.values(advParams).some((v) => v))
        performAdvancedSearch(advParams, employees);
    }
  }, [searchParams, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();
      if (!data.success)
        throw new Error(data.message || "Failed to fetch employees");
      const empList: Employee[] = data.employees;
      setEmployees(empList);
      setFilteredEmployees(empList);
      const user = getStoredUser();
      if (user) {
        const loggedInUser = empList.find((emp) => emp.email === user.email);
        setCurrentUser(loggedInUser || null);
      }
      setBuildings([...new Set(empList.map((emp) => emp.building))]);
      setDepartments([...new Set(empList.map((emp) => emp.department))]);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const performBasicSearch = (
    query: string,
    empList: Employee[] = employees
  ) => {
    if (!query.trim()) {
      setFilteredEmployees(empList);
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
    setFilteredEmployees(filtered);
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
    setFilteredEmployees(filtered);
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
    navigate(`/employees/${employeeId}`);
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
          setSearchMode={setSearchMode}
          basicSearchQuery={basicSearchQuery}
          setBasicSearchQuery={setBasicSearchQuery}
          handleBasicSearch={handleBasicSearch}
          advancedSearch={advancedSearch}
          setAdvancedSearch={setAdvancedSearch}
          buildings={buildings}
          departments={departments}
          handleAdvancedSearch={handleAdvancedSearch}
        />
        <div className="employee-wrapper">
          <EmployeeManage
            count={filteredEmployees.length}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
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
    </>
  );
};

export default Main;
