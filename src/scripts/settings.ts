// here importing SCSS styles for settings page
import '../../styles/scss/reset.scss';
import '../../styles/scss/layout.scss';
import '../../styles/scss/header.scss';
import '../../styles/scss/settings.scss';

document.addEventListener('DOMContentLoaded', () => {
  // check if user is logged in
  const currentUser = sessionStorage.getItem('user') || localStorage.getItem('user');
  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }

  // parse current user data from session
  const userData = JSON.parse(currentUser);
  const API_BASE_URL = 'http://localhost:3000';
  
  // track if current user is admin
  let currentUserIsAdmin = false;
  
  // fetch full user data from API using the email from session
  fetch(`${API_BASE_URL}/employees`)
    .then((response) => response.json())
    .then((data) => {
      const employees = data.employees || data;
      // find the current logged-in user by email
      const loggedInUser = employees.find((emp: any) => emp.email === userData.email);
      
      if (loggedInUser) {
        // update current user admin status
        currentUserIsAdmin = loggedInUser.isAdmin || false;
        console.log('Current user is admin:', currentUserIsAdmin);
        
        const headerEmployeeAvatar = document.getElementById('employee-avatar') as HTMLImageElement;
        const headerEmployeeName = document.getElementById('employee-username');
        const mobileEmployeeAvatar = document.getElementById('mobile-employee-avatar') as HTMLImageElement;
        const mobileEmployeeName = document.getElementById('mobile-employee');
        const userDataWrapper = document.querySelector('.user-data') as HTMLElement;

        const firstName = loggedInUser.first_name || loggedInUser.firstName || '';
        const lastName = loggedInUser.last_name || loggedInUser.lastName || '';
        const avatar = loggedInUser.user_avatar || loggedInUser.photo || './assets/avatar.png';
        const userId = loggedInUser._id || loggedInUser.id;

        // display current user info in header
        if (headerEmployeeName) {
          headerEmployeeName.textContent = `${firstName} ${lastName}`;
        }
        if (headerEmployeeAvatar) {
          headerEmployeeAvatar.src = avatar;
        }
        if (mobileEmployeeName) {
          mobileEmployeeName.textContent = `${firstName} ${lastName}`;
        }
        if (mobileEmployeeAvatar) {
          mobileEmployeeAvatar.src = avatar;
        }

        // add click handler to navigate to user's detail page
        if (userDataWrapper) {
          userDataWrapper.style.cursor = 'pointer';
          userDataWrapper.addEventListener('click', () => {
            window.location.href = `employee-details.html#${userId}`;
          });
        }

        // add click handler for mobile avatar
        if (mobileEmployeeAvatar) {
          mobileEmployeeAvatar.style.cursor = 'pointer';
          mobileEmployeeAvatar.addEventListener('click', () => {
            window.location.href = `employee-details.html#${userId}`;
          });
        }
      }
    })
    .catch((error) => console.error('Error fetching user data:', error));

  // function to update employee role
  async function updateEmployeeRole(employeeId: string, role: string | null, isAdmin: boolean | null) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${employeeId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          isAdmin,
          requestingUserEmail: userData.email,
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        alert(data.message || 'Failed to update role');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role');
      return false;
    }
  }

  // function to render employee list
  function renderEmployeeList(employees: any[]) {
    console.log('Rendering employees:', employees);
    const employeeListWrapper = document.querySelector('.employee-list-wrapper');
    console.log('Employee list wrapper:', employeeListWrapper);
    
    if (!employeeListWrapper) {
      console.error('Employee list wrapper not found!');
      return;
    }

    // Clear existing content
    employeeListWrapper.innerHTML = '';

    if (!employees || employees.length === 0) {
      employeeListWrapper.innerHTML = '<p style="padding: 20px; text-align: center; color: #7a7676;">No employees found</p>';
      return;
    }

    employees.forEach((employee: any, index: number) => {
      const employeeCard = document.createElement('div');
      employeeCard.className = 'employee-card-wrapper';
      
      const firstName = employee.first_name || employee.firstName || '';
      const lastName = employee.last_name || employee.lastName || '';
      const avatar = employee.user_avatar || employee.photo || './assets/avatar.png';
      const role = employee.role || 'employee';
      const isAdmin = employee.isAdmin || false;
      const employeeId = employee._id || employee.id;
      
      // determine which role buttons should be active
      const isEmployeeRole = role === 'employee';
      const isManagerRole = role === 'manager';
      
      // Admin cannot edit their own card
      const canEdit = currentUserIsAdmin && userData.email !== employee.email;
      employeeCard.innerHTML = `
        <div class="emp-avatar-wrapper">
          <img src="${avatar}" alt="avatar" class="emp-avatar" />
          <div class="emp-name-wrapper">
            <p>${firstName}</p>
            <p>${lastName}</p>
          </div>
        </div>
        <div class="emp-hr-btn-wrapper">
          <button class="emp-btn ${isEmployeeRole ? 'active' : ''}" data-role="employee" ${canEdit ? '' : 'disabled'}>EMPLOYEE</button>
          <button class="emp-btn ${isManagerRole ? 'active' : ''}" data-role="manager" ${canEdit ? '' : 'disabled'}>HR</button>
        </div>
        <div class="emp-admin-btn-wrapper">
          <button class="admin-btn ${isAdmin ? 'active' : ''}" data-admin="true" ${canEdit ? '' : 'disabled'}>ADMIN</button>
        </div>
      `;

      employeeListWrapper.appendChild(employeeCard);

      // add event listeners for role buttons (only if current user is admin)
      if (currentUserIsAdmin) {
        const empButtons = employeeCard.querySelectorAll('.emp-btn');
        const adminButton = employeeCard.querySelector('.admin-btn');

        empButtons.forEach((btn) => {
          btn.addEventListener('click', async () => {
            const newRole = btn.getAttribute('data-role');
            const success = await updateEmployeeRole(employeeId, newRole, null);
            
            if (success) {
              // update UI
              empButtons.forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
            }
          });
        });

        if (adminButton) {
          adminButton.addEventListener('click', async () => {
            const currentIsAdmin = adminButton.classList.contains('active');
            const newIsAdmin = !currentIsAdmin;
            
            const success = await updateEmployeeRole(employeeId, null, newIsAdmin);
            
            if (success) {
              // update UI
              adminButton.classList.toggle('active');
            }
          });
        }
      }

      // add divider line after each employee except the last one
      if (index < employees.length - 1) {
        const divider = document.createElement('div');
        divider.className = 'divider-line';
        employeeListWrapper.appendChild(divider);
      }
    });
  }

  // here i am fetch all employees from database
  console.log('Fetching employees from:', `${API_BASE_URL}/employees`);
  fetch(`${API_BASE_URL}/employees`)
    .then((response) => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('API response data:', data);
      const employees = data.employees || data;
      console.log('Employees data received:', employees);
      renderEmployeeList(employees);
    })
    .catch((error) => {
      console.error('Error fetching employees:', error);
      const employeeListWrapper = document.querySelector('.employee-list-wrapper');
      if (employeeListWrapper) {
        employeeListWrapper.innerHTML = `<p style="padding: 20px; text-align: center; color: red;">Error loading employees: ${error.message}</p>`;
      }
    });

  // redirect to main page when Address Book button is clicked
  const addressBookBtn = document.querySelector('.header-options-wrapper .page-title:nth-child(1)');
  if (addressBookBtn) {
    addressBookBtn.addEventListener('click', () => {
      window.location.href = 'main.html';
    });
  }

  const signOutLink = document.querySelector('.sign-out-link');
  const logoutBtn = document.querySelector('.logout-btn');

  function handleSignOut(e: Event) {
    e.preventDefault();
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }

  if (signOutLink) {
    signOutLink.addEventListener('click', handleSignOut);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleSignOut);
  }

  const burgerMenuWrapper = document.querySelector('.burger-menu-wrapper');
  const mobileNav = document.querySelector('.mobile-nav');
  const menuBackdrop = document.querySelector('.menu-backdrop');

  if (burgerMenuWrapper) {
    burgerMenuWrapper.addEventListener('click', function (e) {
      burgerMenuWrapper.classList.toggle('open');
      if (mobileNav) mobileNav.classList.toggle('open');
      if (menuBackdrop) menuBackdrop.classList.toggle('open');
      e.stopPropagation();
    });
  }

  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', function () {
      if (burgerMenuWrapper) burgerMenuWrapper.classList.remove('open');
      if (mobileNav) mobileNav.classList.remove('open');
      if (menuBackdrop) menuBackdrop.classList.remove('open');
    });
  }
});
