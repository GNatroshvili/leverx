import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { API_BASE_URL, getStoredUser } from '../utils/auth';
import type { Employee } from '../utils/auth';
import '../../styles/scss/reset.scss';
import '../../styles/scss/layout.scss';
import '../../styles/scss/header.scss';
import '../../styles/scss/style.scss';

type ViewMode = 'grid' | 'list';
type SearchMode = 'basic' | 'advanced';

interface AdvancedSearchParams {
  name: string;
  email: string;
  phone: string;
  skype: string;
  building: string;
  room: string;
  department: string;
}

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchMode, setSearchMode] = useState<SearchMode>('basic');
  const [basicSearchQuery, setBasicSearchQuery] = useState('');
  const [advancedSearch, setAdvancedSearch] = useState<AdvancedSearchParams>({
    name: '',
    email: '',
    phone: '',
    skype: '',
    building: '',
    room: '',
    department: ''
  });
  const [buildings, setBuildings] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate('/');
      return;
    }

    fetchEmployees();
  }, [navigate]);

  useEffect(() => {
    // Restore search from URL params
    const mode = searchParams.get('mode') || 'basic';
    setSearchMode(mode as SearchMode);

    if (mode === 'basic') {
      const query = searchParams.get('query') || '';
      setBasicSearchQuery(query);
      if (query) {
        performBasicSearch(query, employees);
      }
    } else if (mode === 'advanced') {
      const advParams: AdvancedSearchParams = {
        name: searchParams.get('name') || '',
        email: searchParams.get('email') || '',
        phone: searchParams.get('phone') || '',
        skype: searchParams.get('skype') || '',
        building: searchParams.get('building') || '',
        room: searchParams.get('room') || '',
        department: searchParams.get('department') || ''
      };
      setAdvancedSearch(advParams);
      if (Object.values(advParams).some(v => v)) {
        performAdvancedSearch(advParams, employees);
      }
    }
  }, [searchParams, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch employees');
      }

      const empList: Employee[] = data.employees;
      setEmployees(empList);
      setFilteredEmployees(empList);

      // Find logged-in user
      const user = getStoredUser();
      if (user) {
        const loggedInUser = empList.find(emp => emp.email === user.email);
        setCurrentUser(loggedInUser || null);
      }

      // Extract unique buildings and departments
      const uniqueBuildings = [...new Set(empList.map(emp => emp.building))];
      const uniqueDepartments = [...new Set(empList.map(emp => emp.department))];
      setBuildings(uniqueBuildings);
      setDepartments(uniqueDepartments);

    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const performBasicSearch = (query: string, empList: Employee[] = employees) => {
    if (!query.trim()) {
      setFilteredEmployees(empList);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const filtered = empList.filter(emp => {
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

  const performAdvancedSearch = (params: AdvancedSearchParams, empList: Employee[] = employees) => {
    const filtered = empList.filter(emp => {
      const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
      const email = emp.email.toLowerCase();
      const phone = emp.phone.toLowerCase();
      const skype = emp.skype.toLowerCase();
      const building = emp.building.toLowerCase();
      const room = emp.room.toString().toLowerCase();
      const department = emp.department.toLowerCase();

      const nameMatch = !params.name || 
        fullName.includes(params.name.toLowerCase()) ||
        emp.first_name.toLowerCase().includes(params.name.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(params.name.toLowerCase());
      const emailMatch = !params.email || email.includes(params.email.toLowerCase());
      const phoneMatch = !params.phone || phone.includes(params.phone.toLowerCase());
      const skypeMatch = !params.skype || skype.includes(params.skype.toLowerCase());
      const buildingMatch = !params.building || building === params.building.toLowerCase();
      const roomMatch = !params.room || room.includes(params.room.toLowerCase());
      const departmentMatch = !params.department || department === params.department.toLowerCase();

      return nameMatch && emailMatch && phoneMatch && skypeMatch && buildingMatch && roomMatch && departmentMatch;
    });

    setFilteredEmployees(filtered);
  };

  const handleBasicSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performBasicSearch(basicSearchQuery);
    setSearchParams({ mode: 'basic', query: basicSearchQuery });
  };

  const handleAdvancedSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performAdvancedSearch(advancedSearch);
    
    const params: any = { mode: 'advanced' };
    Object.entries(advancedSearch).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    setSearchParams(params);
  };

  const handleEmployeeClick = (employeeId: string) => {
    navigate(`/employee-details/${employeeId}`);
  };

  const renderGridView = () => {
    if (filteredEmployees.length === 0) {
      return (
        <div className="empty-employees-wrapper">
          <div className="empty-employees">
            <img src="/assets/not-found.png" alt="not-found-icon" className="not-found-img" />
            <p className="no-employees-text">Nothing found</p>
            <p className="try-different-search-text">
              No results match your search. consider trying different search requests.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="employee-cards-wrapper">
        {filteredEmployees.map(emp => (
          <div 
            key={emp._id} 
            className="employee-card"
            onClick={() => handleEmployeeClick(emp._id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="employee-data-wrapper">
              <img src={emp.user_avatar} alt="user-avatar" className="avatar" />
              <p className="employee-name">{emp.first_name} {emp.last_name}</p>
            </div>
            <div className="divider-line"></div>
            <div className="work-role-and-room-wrapper">
              <div className="work-role-wrapper">
                <img src="/assets/briefcase.png" alt="briefcase-icon" />
                <p className="work-role">{emp.department}</p>
              </div>
              <div className="room-number-wrapper">
                <img src="/assets/door.png" alt="door-icon" />
                <p className="room-number">#{emp.room}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderListView = () => {
    if (filteredEmployees.length === 0) {
      return (
        <div className="empty-employees-wrapper">
          <div className="empty-employees">
            <img src="/assets/not-found.png" alt="not-found-icon" className="not-found-img" />
            <p className="no-employees-text">Nothing found</p>
            <p className="try-different-search-text">
              No results match your search. consider trying different search requests.
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="employee-header">
          <div className="photo-and-name-wrapper">
            <div className="photo-wrapper">
              <img src="/assets/circle.png" alt="circle-icon" />
              <p className="font-style">Photo</p>
            </div>
            <div className="name-wrapper">
              <img src="/assets/name.png" alt="name-icon" />
              <p>Name</p>
            </div>
          </div>
          <div className="department-and-room-wrapper">
            <div className="department-wrapper">
              <img src="/assets/briefcase.png" alt="briefcase-icon" />
              <p className="font-style">Department</p>
            </div>
            <div className="room-wrapper">
              <img src="/assets/door.png" alt="door-icon" />
              <p className="font-style">Room</p>
            </div>
          </div>
        </div>
        <div className="employee-list-cards-wrapper">
          {filteredEmployees.map((emp, index) => (
            <React.Fragment key={emp._id}>
              <div 
                className="employee-list-card"
                onClick={() => handleEmployeeClick(emp._id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="list-avatar-and-name-wrapper">
                  <div>
                    <img src={emp.user_avatar} alt="user-avatar" className="list-avatar" />
                  </div>
                  <div>
                    <p>{emp.first_name} {emp.last_name}</p>
                  </div>
                </div>
                <div className="list-role-and-room-wrapper">
                  <div>
                    <p>{emp.department}</p>
                  </div>
                  <div>
                    <p>#{emp.room}</p>
                  </div>
                </div>
              </div>
              {index < filteredEmployees.length - 1 && <div className="list-divider-line"></div>}
            </React.Fragment>
          ))}
        </div>
      </>
    );
  };

  const currentUserInfo = currentUser ? {
    firstName: currentUser.first_name,
    lastName: currentUser.last_name,
    avatar: currentUser.user_avatar,
    id: currentUser._id
  } : undefined;

  return (
    <>
      {currentUserInfo && <Header currentUser={currentUserInfo} showUserInfo={true} />}
      {!currentUserInfo && <Header showUserInfo={false} />}
      
      <div className="mobile-search-wrapper">
        <img src="/assets/search-icon.png" alt="search-icon" />
        <p className="mobile-search-input">Open search panel</p>
      </div>

      <div className="main-page-wrapper container">
        <div className="search-wrapper">
          <div className="search-options-wrapper">
            <button
              className={searchMode === 'basic' ? 'basic-btn' : 'search-option-btn'}
              id="basic-search-btn"
              onClick={() => setSearchMode('basic')}
            >
              BASIC SEARCH
            </button>
            <button
              className={searchMode === 'advanced' ? 'advanced-btn' : 'search-option-btn'}
              id="advanced-search-btn"
              onClick={() => setSearchMode('advanced')}
            >
              ADVANCED SEARCH
            </button>
          </div>

          {searchMode === 'basic' && (
            <div className="search-input-and-button-wrapper" id="basic-search-wrapper">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  id="search-input"
                  placeholder="Search"
                  value={basicSearchQuery}
                  onChange={(e) => setBasicSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBasicSearch(e)}
                />
                <img src="/assets/search-icon.png" alt="search-icon" className="search-icon" />
              </div>
              <div className="search-btn-wrapper">
                <button className="search-btn" id="search-btn" onClick={handleBasicSearch}>
                  Search
                </button>
              </div>
            </div>
          )}

          {searchMode === 'advanced' && (
            <div className="search-input-and-button-wrapper" id="advanced-search-wrapper">
              <div className="search-input-wrapper">
                <p className="input-label">Name</p>
                <input
                  type="text"
                  className="advanced-search-input"
                  id="advanced-name-input"
                  placeholder="john smith"
                  value={advancedSearch.name}
                  onChange={(e) => setAdvancedSearch({...advancedSearch, name: e.target.value})}
                />
              </div>
              <div>
                <p className="input-label">Email</p>
                <input
                  type="text"
                  className="advanced-search-input"
                  id="advanced-email-input"
                  placeholder="john.smith@example.com"
                  value={advancedSearch.email}
                  onChange={(e) => setAdvancedSearch({...advancedSearch, email: e.target.value})}
                />
              </div>
              <div className="contact-input-wrapper">
                <div className="advanced-phone-wrapper">
                  <p className="input-label">Phone</p>
                  <input
                    type="text"
                    className="advanced-search-input"
                    id="advanced-phone-input"
                    placeholder="Phone Number"
                    value={advancedSearch.phone}
                    onChange={(e) => setAdvancedSearch({...advancedSearch, phone: e.target.value})}
                  />
                </div>
                <div className="advanced-skype-wrapper">
                  <p className="input-label">Skype</p>
                  <input
                    type="text"
                    className="advanced-search-input"
                    id="advanced-skype-input"
                    placeholder="Skype ID"
                    value={advancedSearch.skype}
                    onChange={(e) => setAdvancedSearch({...advancedSearch, skype: e.target.value})}
                  />
                </div>
              </div>
              <div className="Building-input-wrapper">
                <div>
                  <p className="input-label">Building</p>
                  <select
                    className="advanced-search-input dropdown"
                    id="advanced-building-input"
                    value={advancedSearch.building}
                    onChange={(e) => setAdvancedSearch({...advancedSearch, building: e.target.value})}
                  >
                    <option value="">Any</option>
                    {buildings.map(building => (
                      <option key={building} value={building}>{building}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="input-label">Room</p>
                  <input
                    type="text"
                    className="advanced-search-input"
                    id="advanced-room-input"
                    placeholder="303.1"
                    value={advancedSearch.room}
                    onChange={(e) => setAdvancedSearch({...advancedSearch, room: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <div>
                  <p className="input-label">Department</p>
                  <select
                    className="advanced-search-input dropdown"
                    id="advanced-department-input"
                    value={advancedSearch.department}
                    onChange={(e) => setAdvancedSearch({...advancedSearch, department: e.target.value})}
                  >
                    <option value="">Any</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="search-btn-wrapper">
                <button className="search-btn" id="advanced-search-submit-btn" onClick={handleAdvancedSearch}>
                  Search
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="employee-wrapper">
          <div className="employee-manage">
            <div>
              <p className="employee-count">{filteredEmployees.length} employees displayed</p>
            </div>
            <div className="employee-manage-options-wrapper">
              <a href="#" id="grid-view-btn" onClick={(e) => { e.preventDefault(); setViewMode('grid'); }}>
                <img 
                  src={viewMode === 'grid' ? '/assets/blue-grid.png' : '/assets/grid.png'} 
                  alt="grid-icon" 
                  id="grid-icon"
                />
              </a>
              <a href="#" id="list-view-btn" onClick={(e) => { e.preventDefault(); setViewMode('list'); }}>
                <img 
                  src={viewMode === 'list' ? '/assets/blue-list.png' : '/assets/list.png'} 
                  alt="list-icon" 
                  id="list-icon"
                />
              </a>
            </div>
          </div>

          {viewMode === 'grid' ? renderGridView() : renderListView()}
        </div>
      </div>
    </>
  );
};

export default MainPage;
