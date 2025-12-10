import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { API_BASE_URL, getStoredUser, formatDate, formatDateOfBirth, isVisaExpired } from '../../utils/auth';
import type { Employee } from '../../utils/auth';
import '../../../styles/scss/reset.scss';
import '../../../styles/scss/layout.scss';
import '../../../styles/scss/header.scss';
import '../../../styles/scss/employee-details.scss';

// interface for edit form data
interface EditFormData {
  first_name: string;
  last_name: string;
  first_native_name: string;
  middle_native_name: string;
  last_native_name: string;
  department: string;
  building: string;
  room: string;
  desk_number: string;
  date_birth_year: string;
  date_birth_month: string;
  date_birth_day: string;
  manager_id: string;
  phone: string;
  email: string;
  skype: string;
  cnumber: string;
  citizenship: string;
}

const EmployeeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [managers, setManagers] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<EditFormData>({
    first_name: '',
    last_name: '',
    first_native_name: '',
    middle_native_name: '',
    last_native_name: '',
    department: '',
    building: '',
    room: '',
    desk_number: '',
    date_birth_year: '',
    date_birth_month: '',
    date_birth_day: '',
    manager_id: '',
    phone: '',
    email: '',
    skype: '',
    cnumber: '',
    citizenship: '',
  });

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate('/');
      return;
    }

    fetchEmployees();
  }, [id, navigate]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch employees');
      }

      const employees: Employee[] = data.employees;
      setAllEmployees(employees);
      
      // filter managers for dropdown
      const managerList = employees.filter((emp: any) => emp.role === 'manager');
      setManagers(managerList);
      
      // here find logged-in user
      const user = getStoredUser();
      if (user) {
        const loggedInUser = employees.find(emp => emp.email === user.email);
        setCurrentUser(loggedInUser || null);

        if (id) {
          const employee = employees.find(emp => emp._id === id);
          if (employee) {
            setCurrentEmployee(employee);
            setCanEdit(determineEditAccess(employee, loggedInUser, user));
            initializeFormData(employee);
          } else {
            navigate('/404');
          }
        }
      }
    } catch (error) {
      console.error('Error loading employee data:', error);
    }
  };

  const initializeFormData = (employee: Employee) => {
    const emp = employee as any;
    const dateBirth = emp.date_birth || emp.date_of_birth;
    const managerId = emp.manager?.id || emp.manager?._id || '';
    
    setFormData({
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      first_native_name: emp.first_native_name === 'N/A' ? '' : (emp.first_native_name || ''),
      middle_native_name: emp.middle_native_name === 'N/A' ? '' : (emp.middle_native_name || ''),
      last_native_name: emp.last_native_name === 'N/A' ? '' : (emp.last_native_name || ''),
      department: employee.department === 'N/A' ? '' : (employee.department || ''),
      building: employee.building === 'N/A' ? '' : (employee.building || ''),
      room: employee.room === 'N/A' ? '' : (employee.room || ''),
      desk_number: employee.desk_number === 'N/A' ? '' : String(employee.desk_number || ''),
      date_birth_year: dateBirth?.year ? String(dateBirth.year) : '',
      date_birth_month: dateBirth?.month ? String(dateBirth.month).padStart(2, '0') : '',
      date_birth_day: dateBirth?.day ? String(dateBirth.day).padStart(2, '0') : '',
      manager_id: managerId ? String(managerId) : '',
      phone: employee.phone === 'N/A' ? '' : (employee.phone || ''),
      email: employee.email === 'N/A' ? '' : (employee.email || ''),
      skype: employee.skype === 'N/A' ? '' : (employee.skype || ''),
      cnumber: employee.cnumber === 'N/A' ? '' : (employee.cnumber || ''),
      citizenship: employee.citizenship === 'N/A' ? '' : (employee.citizenship || ''),
    });
  };

  const determineEditAccess = (employee: Employee, loggedInUser: Employee | undefined, user: any): boolean => {
    if (!employee || !loggedInUser) return false;

    // admin can edit anyone
    const userIsAdmin = user?.isAdmin === true || user?.isAdmin === 1 || user?.isAdmin === '1';
    if (userIsAdmin) return true;

    // HR/Manager can edit their subordinates
    const userRole = user?.role || 'employee';
    const userIsHR = userRole === 'manager';
    // manager object from the server may contain `id` (not `_id`) — accept both
    const managerId = (employee.manager as any)?._id || (employee.manager as any)?.id;
    if (userIsHR && employee.manager && managerId === loggedInUser._id) {
      return true;
    }

    return false;
  };

  const handleBackClick = () => {
    navigate('/main');
  };

  const handleManagerClick = () => {
    if (isEditMode) return;
    const managerId = (currentEmployee as any)?.manager?._id || (currentEmployee as any)?.manager?.id;
    if (managerId) {
      navigate(`/employees/${managerId}`);
    }
  };

  const handleInputChange = (field: keyof EditFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditClick = () => {
    if (!isEditMode) {
      setIsEditMode(true);
    } else {
      handleSave();
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    if (currentEmployee) {
      initializeFormData(currentEmployee);
    }
  };

  const handleSave = async () => {
    if (!currentEmployee) return;

    const user = getStoredUser();
    const updates: any = {};

    // collect changed values
    const emp = currentEmployee as any;
    const originalDateBirth = emp.date_birth || emp.date_of_birth;
    const originalManagerId = emp.manager?.id || emp.manager?._id || '';

    if (formData.first_name && formData.first_name !== currentEmployee.first_name) {
      updates.first_name = formData.first_name;
    }
    if (formData.last_name && formData.last_name !== currentEmployee.last_name) {
      updates.last_name = formData.last_name;
    }
    
    const origFirstNative = emp.first_native_name === 'N/A' ? '' : (emp.first_native_name || '');
    const origMiddleNative = emp.middle_native_name === 'N/A' ? '' : (emp.middle_native_name || '');
    const origLastNative = emp.last_native_name === 'N/A' ? '' : (emp.last_native_name || '');
    
    if (formData.first_native_name !== origFirstNative) {
      updates.first_native_name = formData.first_native_name || null;
    }
    if (formData.middle_native_name !== origMiddleNative) {
      updates.middle_native_name = formData.middle_native_name || null;
    }
    if (formData.last_native_name !== origLastNative) {
      updates.last_native_name = formData.last_native_name || null;
    }

    const origDept = currentEmployee.department === 'N/A' ? '' : (currentEmployee.department || '');
    if (formData.department !== origDept) {
      updates.department = formData.department || null;
    }

    const origBuilding = currentEmployee.building === 'N/A' ? '' : (currentEmployee.building || '');
    if (formData.building !== origBuilding) {
      updates.building = formData.building || null;
    }

    const origRoom = currentEmployee.room === 'N/A' ? '' : (currentEmployee.room || '');
    if (formData.room !== origRoom) {
      updates.room = formData.room || null;
    }

    const origDesk = currentEmployee.desk_number === 'N/A' ? '' : String(currentEmployee.desk_number || '');
    if (formData.desk_number !== origDesk) {
      updates.desk_number = formData.desk_number ? parseInt(formData.desk_number) : null;
    }

    // date of birth
    if (formData.date_birth_year && formData.date_birth_month && formData.date_birth_day) {
      const newYear = parseInt(formData.date_birth_year);
      const newMonth = parseInt(formData.date_birth_month);
      const newDay = parseInt(formData.date_birth_day);
      
      if (originalDateBirth?.year !== newYear || originalDateBirth?.month !== newMonth || originalDateBirth?.day !== newDay) {
        updates.date_birth_year = newYear;
        updates.date_birth_month = newMonth;
        updates.date_birth_day = newDay;
      }
    }

    if (formData.manager_id !== String(originalManagerId)) {
      updates.manager_id = formData.manager_id || null;
    }

    const origPhone = currentEmployee.phone === 'N/A' ? '' : (currentEmployee.phone || '');
    if (formData.phone !== origPhone) {
      updates.phone = formData.phone || null;
    }

    const origEmail = currentEmployee.email === 'N/A' ? '' : (currentEmployee.email || '');
    if (formData.email !== origEmail) {
      updates.email = formData.email || null;
    }

    const origSkype = currentEmployee.skype === 'N/A' ? '' : (currentEmployee.skype || '');
    if (formData.skype !== origSkype) {
      updates.skype = formData.skype || null;
    }

    const origCnumber = currentEmployee.cnumber === 'N/A' ? '' : (currentEmployee.cnumber || '');
    if (formData.cnumber !== origCnumber) {
      updates.cnumber = formData.cnumber || null;
    }

    const origCitizenship = currentEmployee.citizenship === 'N/A' ? '' : (currentEmployee.citizenship || '');
    if (formData.citizenship !== origCitizenship) {
      updates.citizenship = formData.citizenship || null;
    }

    if (Object.keys(updates).length === 0) {
      alert('No changes to save');
      setIsEditMode(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/employees/${currentEmployee._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updates,
          requestingUserEmail: user?.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Changes saved successfully!');
        // here i am reloading employee data
        const employeeResponse = await fetch(`${API_BASE_URL}/employees/${currentEmployee._id}`);
        const employeeData = await employeeResponse.json();
        if (employeeData.success) {
          setCurrentEmployee(employeeData.employee);
          initializeFormData(employeeData.employee);
          setIsEditMode(false);
        }
      } else {
        alert(data.message || 'Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const currentUserInfo = currentUser ? {
    firstName: currentUser.first_name,
    lastName: currentUser.last_name,
    avatar: currentUser.user_avatar,
    id: currentUser._id
  } : undefined;

  if (!currentEmployee) {
    return (
      <>
        {currentUserInfo && <Header currentUser={currentUserInfo} showUserInfo={true} />}
        {!currentUserInfo && <Header showUserInfo={false} />}
        <div className="container">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  const fullName = `${currentEmployee.first_name} ${currentEmployee.last_name}`;
  const emp = currentEmployee as any;
  const hasNativeName = emp.first_native_name && 
                        emp.first_native_name !== 'N/A' &&
                        emp.middle_native_name !== 'N/A' &&
                        emp.last_native_name !== 'N/A';
  const nativeFullName = hasNativeName
    ? `${emp.first_native_name} ${emp.middle_native_name} ${emp.last_native_name}`
    : 'N/A';
  const managerName = currentEmployee.manager && currentEmployee.manager.first_name !== 'N/A'
    ? `${currentEmployee.manager.first_name} ${currentEmployee.manager.last_name}`
    : 'N/A';

  // helper to get date of birth from either field name
  const getDateOfBirth = () => {
    const dob = emp.date_birth || emp.date_of_birth;
    return dob ? formatDateOfBirth(dob) : 'N/A';
  };

  return (
    <>
      {currentUserInfo && <Header currentUser={currentUserInfo} showUserInfo={true} />}
      {!currentUserInfo && <Header showUserInfo={false} />}
      
      <div className="container">
        <div className="employee-details-wrapper">
          <img
            src="/assets/left-arrow.png"
            alt="left-arrow-icon"
            className="left-arrow-icon"
            onClick={handleBackClick}
          />
          
          <div className="employee-avatar-wrapper">
            <div>
              <img
                src={(() => {
                  const src = currentEmployee.user_avatar || '';
                  if (!src) return '/assets/default-avatar.jpg';
                  if (src.startsWith('http')) return src;
                  return src.replace(/^\.?\//, '/');
                })()}
                alt="employee-avatar"
                className="employee-avatar"
                id="details-employee-avatar"
              />
              {(emp.remote_work || emp.isRemoteWork) && (
                <img
                  src="/assets/home.png"
                  alt="home-icon"
                  className="home-icon"
                  id="details-remote-work-icon"
                />
              )}
            </div>
            
            <div className="employee-full-name-wrapper">
              {isEditMode ? (
                <div className="row row--split">
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    placeholder="First Name"
                    className="edit-input flex-1"
                  />
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
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
                    onChange={(e) => handleInputChange('first_native_name', e.target.value)}
                    placeholder="First Native"
                    className="edit-input native-input flex-1"
                  />
                  <input
                    type="text"
                    value={formData.middle_native_name}
                    onChange={(e) => handleInputChange('middle_native_name', e.target.value)}
                    placeholder="Middle Native"
                    className="edit-input native-input flex-1"
                  />
                  <input
                    type="text"
                    value={formData.last_native_name}
                    onChange={(e) => handleInputChange('last_native_name', e.target.value)}
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

            <button className="copy-link-btn">
              <img src="/assets/copy.png" alt="link-icon" className="btn-icon" />
              Copy link
            </button>
            
            {canEdit && (
              <div className="button-group">
                <button 
                  className={isEditMode ? "save-btn action-btn" : "edit-btn action-btn"}
                  onClick={handleEditClick}
                >
                  {isEditMode ? (
                    <>
                      <img src="/assets/save-icon.png" alt="save-icon" className="btn-icon" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      SAVE
                    </>
                  ) : (
                    <>
                      <img src="/assets/pencil.png" alt="edit-icon" className="btn-icon" />
                      EDIT
                    </>
                  )}
                </button>
                {isEditMode && (
                  <button className="cancel-btn action-btn" onClick={handleCancelEdit}>
                    CANCEL
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="divider-line"></div>

          <div className="employee-detailed-info-wrapper">
            <div>
              <p className="data-section-title">GENERAL INFO</p>
              <div className="vertical-divider-line"></div>
              <div className="data-column">
                <div className="data-line-wrapper">
                  <div className="data-title-wrapper">
                    <img src="/assets/briefcase.png" alt="briefcase-icon" className="icon-size" />
                    <p className="gray-text">Department</p>
                  </div>
                  <div className="data-title-value-wrapper">
                    {isEditMode ? (
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          placeholder="Enter department"
                          className="edit-input"
                      />
                    ) : (
                      <p id="details-department">{currentEmployee.department || 'N/A'}</p>
                    )}
                  </div>
                </div>
                
                <div className="data-line-wrapper">
                  <div className="data-title-wrapper">
                    <img src="/assets/building.png" alt="building-icon" className="icon-size" />
                    <p className="gray-text">Building</p>
                  </div>
                  <div className="data-title-value-wrapper">
                    {isEditMode ? (
                        <input
                          type="text"
                          value={formData.building}
                          onChange={(e) => handleInputChange('building', e.target.value)}
                          placeholder="Enter building"
                          className="edit-input"
                      />
                    ) : (
                      <p id="details-building">{currentEmployee.building || 'N/A'}</p>
                    )}
                  </div>
                </div>
                
                <div className="data-line-wrapper">
                  <div className="data-title-wrapper">
                    <img src="/assets/door.png" alt="door-icon" className="icon-size" />
                    <p className="gray-text">Room</p>
                  </div>
                  <div className="data-title-value-wrapper">
                    {isEditMode ? (
                        <input
                          type="text"
                          value={formData.room}
                          onChange={(e) => handleInputChange('room', e.target.value)}
                          placeholder="Enter room"
                          className="edit-input"
                      />
                    ) : (
                      <p id="details-room">{currentEmployee.room || 'N/A'}</p>
                    )}
                  </div>
                </div>
                
                <div className="data-line-wrapper">
                  <div className="data-title-wrapper">
                    <img src="/assets/desk-number.png" alt="desk-icon" className="icon-size" />
                    <p className="gray-text">Desk number</p>
                  </div>
                  <div className="data-title-value-wrapper">
                    {isEditMode ? (
                        <input
                          type="number"
                          value={formData.desk_number}
                          onChange={(e) => handleInputChange('desk_number', e.target.value)}
                          placeholder="Enter desk number"
                          className="edit-input"
                      />
                    ) : (
                      <p id="details-desk-number">{currentEmployee.desk_number || 'N/A'}</p>
                    )}
                  </div>
                </div>
                
                <div className="data-line-wrapper">
                  <div className="data-title-wrapper">
                    <img src="/assets/date-of-birth.png" alt="date-of-birth-icon" className="icon-size" />
                    <p className="gray-text">Date of birth</p>
                  </div>
                  <div className="data-title-value-wrapper">
                    {isEditMode ? (
                        <input
                          type="date"
                          value={formData.date_birth_year && formData.date_birth_month && formData.date_birth_day 
                            ? `${formData.date_birth_year}-${formData.date_birth_month}-${formData.date_birth_day}`
                            : ''}
                          onChange={(e) => {
                            const [year, month, day] = e.target.value.split('-');
                            handleInputChange('date_birth_year', year || '');
                            handleInputChange('date_birth_month', month || '');
                            handleInputChange('date_birth_day', day || '');
                          }}
                          className="edit-input"
                      />
                    ) : (
                      <p id="details-date-of-birth">{getDateOfBirth()}</p>
                    )}
                  </div>
                </div>
                
                <div className="data-line-wrapper">
                  <div className="data-title-wrapper">
                    <img src="/assets/manager.png" alt="manager-icon" className="icon-size" />
                    <p className="gray-text">Manager</p>
                  </div>
                  <div className="data-title-value-wrapper">
                    {isEditMode ? (
                        <select
                          value={formData.manager_id}
                          onChange={(e) => handleInputChange('manager_id', e.target.value)}
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
                        className={`blue-text ${(emp.manager?._id || emp.manager?.id) ? 'clickable' : ''}`}
                        onClick={handleManagerClick}
                      >
                        {managerName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="employee-contact-info-wrapper">
              <p className="data-section-title">CONTACTS</p>
              <div className="vertical-divider-line"></div>
              <div className="data-column">
                <div className="data-line-wrapper">
                  <div className="data-title-wrapper">
                    <img src="/assets/mobile-phone.png" alt="mobile-phone-icon" className="icon-size" />
                    <p className="gray-text">Mobile phone</p>
                  </div>
                  <div className="data-title-value-wrapper">
                    {isEditMode ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter phone number"
                          className="edit-input"
                      />
                    ) : (
                      <p id="details-phone" className="blue-text">{currentEmployee.phone || 'N/A'}</p>
                    )}
                  </div>
                </div>
                
                <div className="data-line-wrapper">
                  <div className="data-title-wrapper">
                    <img src="/assets/email.png" alt="email-icon" className="icon-size" />
                    <p className="gray-text">Email</p>
                  </div>
                  <div className="data-title-value-wrapper">
                    {isEditMode ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter email"
                          className="edit-input"
                      />
                    ) : (
                      <p id="details-email" className="blue-text">{currentEmployee.email || 'N/A'}</p>
                    )}
                  </div>
                </div>
                
                <div className="data-line-wrapper">
                  <div className="data-title-wrapper">
                    <img src="/assets/skype.png" alt="skype-icon" className="icon-size" />
                    <p className="gray-text">Skype</p>
                  </div>
                  <div className="data-title-value-wrapper">
                    {isEditMode ? (
                        <input
                          type="text"
                          value={formData.skype}
                          onChange={(e) => handleInputChange('skype', e.target.value)}
                          placeholder="Enter Skype ID"
                          className="edit-input"
                      />
                    ) : (
                      <p id="details-skype" className="blue-text">{currentEmployee.skype || 'N/A'}</p>
                    )}
                  </div>
                </div>
                
                <div className="data-line-wrapper">
                  <div className="data-title-wrapper">
                    <img src="/assets/c-number-1.png" alt="c-number-icon" className="icon-size" />
                    <p className="gray-text">C-number</p>
                  </div>
                  <div className="data-title-value-wrapper">
                    {isEditMode ? (
                        <input
                          type="text"
                          value={formData.cnumber}
                          onChange={(e) => handleInputChange('cnumber', e.target.value)}
                          placeholder="Enter C-number"
                          className="edit-input"
                      />
                    ) : (
                      <p id="details-cnumber">{currentEmployee.cnumber || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="employee-travel-info-wrapper">
              <p className="data-section-title">TRAVEL INFO</p>
              <div className="vertical-divider-line"></div>
              <div className="data-column">
                <div className="data-line-wrapper">
                  <div className="data-title-wrapper">
                    <img src="/assets/citizienship.png" alt="citizienship-icon" className="icon-size" />
                    <p className="gray-text">Citizenship</p>
                  </div>
                  <div className="data-title-value-wrapper">
                    {isEditMode ? (
                        <input
                          type="text"
                          value={formData.citizenship}
                          onChange={(e) => handleInputChange('citizenship', e.target.value)}
                          placeholder="Enter citizenship"
                          className="edit-input"
                      />
                    ) : (
                      <p id="details-citizenship">{currentEmployee.citizenship || 'N/A'}</p>
                    )}
                  </div>
                </div>
                
                {currentEmployee.visa_1 && (
                  <>
                    <div className="data-line-wrapper">
                      <div className="data-title-wrapper">
                        <img src="/assets/visa.png" alt="visa-icon" className="visa-size" />
                        <p className="gray-text">Visa 1</p>
                      </div>
                      <div className="data-title-value-wrapper">
                        <p id="details-visa-1">{currentEmployee.visa_1 || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {currentEmployee.visa_1_start_date && currentEmployee.visa_1_end_date && (
                      <div className="data-line-wrapper">
                        <div className="data-title-wrapper">
                          <img src="/assets/date-of-birth.png" alt="date-icon" className="icon-size" />
                          <p className="gray-text">Visa 1 validity period</p>
                        </div>
                        <div className="data-title-value-wrapper">
                          <p id="details-visa-1-period">
                            {formatDate(currentEmployee.visa_1_start_date)} - {formatDate(currentEmployee.visa_1_end_date)}
                            {isVisaExpired(currentEmployee.visa_1_end_date) && ' (expired)'}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {currentEmployee.visa_2 && (
                  <>
                    <div className="data-line-wrapper">
                      <div className="data-title-wrapper">
                        <img src="/assets/visa.png" alt="visa-icon" className="icon-size" />
                        <p className="gray-text">Visa 2</p>
                      </div>
                      <div className="data-title-value-wrapper">
                        <p id="details-visa-2">{currentEmployee.visa_2 || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {currentEmployee.visa_2_start_date && currentEmployee.visa_2_end_date && (
                      <div className="data-line-wrapper">
                        <div className="data-title-wrapper">
                          <img src="/assets/date-of-birth.png" alt="date-icon" className="icon-size" />
                          <p className="gray-text">Visa 2 validity period</p>
                        </div>
                        <div className="data-title-value-wrapper">
                          <p id="details-visa-2-period">
                            {formatDate(currentEmployee.visa_2_start_date)} - {formatDate(currentEmployee.visa_2_end_date)}
                            {isVisaExpired(currentEmployee.visa_2_end_date) && ' (expired)'}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDetailsPage;
