// @ts-nocheck
// here importing SCSS styles
import '../../styles/scss/reset.scss';
import '../../styles/scss/layout.scss';
import '../../styles/scss/header.scss';
import '../../styles/scss/style.scss';

document.addEventListener("DOMContentLoaded", () => {
  // check if user is logged in (session exists in either storage)
  const currentUser =
    sessionStorage.getItem("user") || localStorage.getItem("user");
  if (!currentUser) {
    // no active session, redirect to sign-in page
    window.location.href = "index.html";
    return;
  }

  const gridWrapper = document.querySelector(".employee-cards-wrapper");
  const listWrapper = document.querySelector(".employee-list-cards-wrapper");
  const employeeHeader = document.querySelector(".employee-header");
  const employeeCount = document.querySelector(".employee-count");
  const gridViewBtn = document.getElementById("grid-view-btn");
  const listViewBtn = document.getElementById("list-view-btn");
  const gridIcon = document.getElementById("grid-icon");
  const listIcon = document.getElementById("list-icon");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const headerEmployeeAvatar = document.getElementById("employee-avatar");
  const headerEmployeeName = document.getElementById("employee-username");
  const mobileEmployeeAvatar = document.getElementById(
    "mobile-employee-avatar"
  );
  const mobileEmployeeName = document.getElementById("mobile-employee");
  const emptyEmployeesWrapper = document.querySelector(
    ".empty-employees-wrapper"
  );
  const basicSearchBtn = document.getElementById("basic-search-btn");
  const advancedSearchBtn = document.getElementById("advanced-search-btn");
  const basicSearchWrapper = document.getElementById("basic-search-wrapper");
  const advancedSearchWrapper = document.getElementById(
    "advanced-search-wrapper"
  );
  const advancedNameInput = document.getElementById("advanced-name-input");
  const advancedEmailInput = document.getElementById("advanced-email-input");
  const advancedPhoneInput = document.getElementById("advanced-phone-input");
  const advancedSkypeInput = document.getElementById("advanced-skype-input");
  const advancedBuildingInput = document.getElementById(
    "advanced-building-input"
  );
  const advancedRoomInput = document.getElementById("advanced-room-input");
  const advancedDepartmentInput = document.getElementById(
    "advanced-department-input"
  );
  const advancedSearchSubmitBtn = document.getElementById(
    "advanced-search-submit-btn"
  );
  const addressBookBtn = document.querySelector(".page-title");

  let employeesData = [];
  let currentView = "grid";
  let filteredEmployees = [];
  let currentSearchMode = "basic";

  // add click handler to address book button
  if (addressBookBtn) {
    addressBookBtn.style.cursor = "pointer";
    addressBookBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // this function is used to get search parameters from url
  function getSearchParamsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      mode: urlParams.get("mode") || "basic",
      query: urlParams.get("query") || "",
      name: urlParams.get("name") || "",
      email: urlParams.get("email") || "",
      phone: urlParams.get("phone") || "",
      skype: urlParams.get("skype") || "",
      building: urlParams.get("building") || "",
      room: urlParams.get("room") || "",
      department: urlParams.get("department") || "",
    };
  }

  // this function is used to update url with search parameters
  function updateUrlWithSearchParams(params) {
    const url = new URL(window.location);
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        url.searchParams.set(key, params[key]);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.pushState({}, "", url);
  }

  // this is function to update header with employee info
  function updateHeaderEmployee(employee) {
    if (employee) {
      const fullName = `${employee.first_name} ${employee.last_name}`;
      headerEmployeeAvatar.src = employee.user_avatar;
      headerEmployeeName.textContent = fullName;
      mobileEmployeeAvatar.src = employee.user_avatar;
      mobileEmployeeName.textContent = fullName;

      // here we add click handler to header employee data to redirect to employee details
      const headerEmployeeData = document.querySelector(".user-data");
      if (headerEmployeeData) {
        headerEmployeeData.style.cursor = "pointer";
        headerEmployeeData.addEventListener("click", () => {
          window.location.href = `employee-details.html#${employee._id}`;
        });
      }
    }
  }

  // this is a fucntion to render grid view
  function renderGridView(employees) {
    gridWrapper.innerHTML = "";

    employees.forEach((emp) => {
      const card = document.createElement("div");
      card.classList.add("employee-card");

      card.innerHTML = `
        <div class="employee-data-wrapper">
          <img src="${emp.user_avatar}" alt="user-avatar" class="avatar" />
          <p class="employee-name">${emp.first_name} ${emp.last_name}</p>
        </div>
        <div class="divider-line"></div>
        <div class="work-role-and-room-wrapper">
          <div class="work-role-wrapper">
            <img src="./assets/briefcase.png" alt="briefcase-icon" />
            <p class="work-role">${emp.department}</p>
          </div>
          <div class="room-number-wrapper">
            <img src="./assets/door.png" alt="door-icon" />
            <p class="room-number">#${emp.room}</p>
          </div>
        </div>
      `;

      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        window.location.href = `employee-details.html#${emp._id}`;
      });

      gridWrapper.appendChild(card);
    });
  }

  // this is a function to render list view
  function renderListView(employees) {
    listWrapper.innerHTML = "";

    employees.forEach((emp, index) => {
      const listCard = document.createElement("div");
      listCard.classList.add("employee-list-card");

      listCard.innerHTML = `
        <div class="list-avatar-and-name-wrapper">
          <div>
            <img
              src="${emp.user_avatar}"
              alt="user-avatar"
              class="list-avatar"
            />
          </div>
          <div>
            <p>${emp.first_name} ${emp.last_name}</p>
          </div>
        </div>
        <div class="list-role-and-room-wrapper">
          <div>
            <p>${emp.department}</p>
          </div>
          <div>
            <p>#${emp.room}</p>
          </div>
        </div>
      `;

      listCard.style.cursor = "pointer";
      listCard.addEventListener("click", () => {
        window.location.href = `employee-details.html#${emp._id}`;
      });

      listWrapper.appendChild(listCard);

      if (index < employees.length - 1) {
        const divider = document.createElement("div");
        divider.classList.add("list-divider-line");
        listWrapper.appendChild(divider);
      }
    });
  }

  // this is function to perform search
  function searchEmployees(query) {
    if (!query.trim()) {
      filteredEmployees = employeesData;
    } else {
      const searchTerm = query.toLowerCase().trim();
      filteredEmployees = employeesData.filter((emp) => {
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
    }

    // update URL with search parameters
    updateUrlWithSearchParams({
      mode: "basic",
      query: query,
    });

    if (filteredEmployees.length === 0) {
      // here we hiding employee cards
      gridWrapper.style.display = "none";
      listWrapper.style.display = "none";
      employeeHeader.style.display = "none";
      emptyEmployeesWrapper.style.display = "flex";
    } else {
      emptyEmployeesWrapper.style.display = "none";
      if (currentView === "grid") {
        renderGridView(filteredEmployees);
        gridWrapper.style.display = "grid";
        listWrapper.style.display = "none";
        employeeHeader.style.display = "none";
      } else {
        renderListView(filteredEmployees);
        gridWrapper.style.display = "none";
        listWrapper.style.display = "block";
        employeeHeader.style.display = "flex";
      }
    }

    employeeCount.textContent = `${filteredEmployees.length} employees displayed`;
  }

  // this function is used to switch to grid view from list view
  function showGridView() {
    currentView = "grid";
    const dataToShow =
      filteredEmployees.length > 0 ? filteredEmployees : employeesData;

    if (dataToShow.length === 0) {
      emptyEmployeesWrapper.style.display = "flex";
      gridWrapper.style.display = "none";
    } else {
      emptyEmployeesWrapper.style.display = "none";
      renderGridView(dataToShow);
      gridWrapper.style.display = "grid";
    }

    listWrapper.style.display = "none";
    employeeHeader.style.display = "none";
    gridIcon.src = "./assets/blue-grid.png";
    listIcon.src = "./assets/list.png";
  }

  // this function is used to switch to list view from grid view
  function showListView() {
    currentView = "list";
    const dataToShow =
      filteredEmployees.length > 0 ? filteredEmployees : employeesData;

    if (dataToShow.length === 0) {
      emptyEmployeesWrapper.style.display = "flex";
      listWrapper.style.display = "none";
      employeeHeader.style.display = "none";
    } else {
      emptyEmployeesWrapper.style.display = "none";
      renderListView(dataToShow);
      listWrapper.style.display = "block";
      employeeHeader.style.display = "flex";
    }

    gridWrapper.style.display = "none";
    gridIcon.src = "./assets/grid.png";
    listIcon.src = "./assets/blue-list.png";
  }

  gridViewBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showGridView();
  });

  listViewBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showListView();
  });

  // here add search button click event
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const searchQuery = searchInput.value;
    searchEmployees(searchQuery);
  });

  // here add search on enter key press
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const searchQuery = searchInput.value;
      searchEmployees(searchQuery);
    }
  });

  // this function is used to switch to basic search mode
  function showBasicSearch() {
    currentSearchMode = "basic";
    basicSearchWrapper.style.display = "flex";
    advancedSearchWrapper.style.display = "none";
    basicSearchBtn.classList.add("basic-btn");
    basicSearchBtn.classList.remove("search-option-btn");
    advancedSearchBtn.classList.add("search-option-btn");
    advancedSearchBtn.classList.remove("advanced-btn");
  }

  // this function is used to switch to advanced search mode
  function showAdvancedSearch() {
    currentSearchMode = "advanced";
    basicSearchWrapper.style.display = "none";
    advancedSearchWrapper.style.display = "flex";
    basicSearchBtn.classList.add("search-option-btn");
    basicSearchBtn.classList.remove("basic-btn");
    advancedSearchBtn.classList.add("advanced-btn");
    advancedSearchBtn.classList.remove("search-option-btn");
  }

  // this function is used to populate building dropdown options
  function populateBuildingOptions() {
    const buildings = [...new Set(employeesData.map((emp) => emp.building))];
    advancedBuildingInput.innerHTML = '<option value="">Any</option>';
    buildings.forEach((building) => {
      const option = document.createElement("option");
      option.value = building;
      option.textContent = building;
      advancedBuildingInput.appendChild(option);
    });
  }

  // this function is used to populate department dropdown options
  function populateDepartmentOptions() {
    const departments = [
      ...new Set(employeesData.map((emp) => emp.department)),
    ];
    advancedDepartmentInput.innerHTML = '<option value="">Any</option>';
    departments.forEach((department) => {
      const option = document.createElement("option");
      option.value = department;
      option.textContent = department;
      advancedDepartmentInput.appendChild(option);
    });
  }

  // this function is used to perform advanced search
  function searchAdvancedEmployees() {
    const nameQuery = advancedNameInput.value.toLowerCase().trim();
    const emailQuery = advancedEmailInput.value.toLowerCase().trim();
    const phoneQuery = advancedPhoneInput.value.toLowerCase().trim();
    const skypeQuery = advancedSkypeInput.value.toLowerCase().trim();
    const buildingQuery = advancedBuildingInput.value.toLowerCase().trim();
    const roomQuery = advancedRoomInput.value.toLowerCase().trim();
    const departmentQuery = advancedDepartmentInput.value.toLowerCase().trim();

    // update URL with search parameters
    updateUrlWithSearchParams({
      mode: "advanced",
      name: nameQuery,
      email: emailQuery,
      phone: phoneQuery,
      skype: skypeQuery,
      building: buildingQuery,
      room: roomQuery,
      department: departmentQuery,
    });

    filteredEmployees = employeesData.filter((emp) => {
      const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
      const email = emp.email.toLowerCase();
      const phone = emp.phone.toLowerCase();
      const skype = emp.skype.toLowerCase();
      const building = emp.building.toLowerCase();
      const room = emp.room.toString().toLowerCase();
      const department = emp.department.toLowerCase();

      const nameMatch =
        !nameQuery ||
        fullName.includes(nameQuery) ||
        emp.first_name.toLowerCase().includes(nameQuery) ||
        emp.last_name.toLowerCase().includes(nameQuery);
      const emailMatch = !emailQuery || email.includes(emailQuery);
      const phoneMatch = !phoneQuery || phone.includes(phoneQuery);
      const skypeMatch = !skypeQuery || skype.includes(skypeQuery);
      const buildingMatch = !buildingQuery || building === buildingQuery;
      const roomMatch = !roomQuery || room.includes(roomQuery);
      const departmentMatch =
        !departmentQuery || department === departmentQuery;

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

    if (filteredEmployees.length === 0) {
      gridWrapper.style.display = "none";
      listWrapper.style.display = "none";
      employeeHeader.style.display = "none";
      emptyEmployeesWrapper.style.display = "flex";
    } else {
      emptyEmployeesWrapper.style.display = "none";
      if (currentView === "grid") {
        renderGridView(filteredEmployees);
        gridWrapper.style.display = "grid";
        listWrapper.style.display = "none";
        employeeHeader.style.display = "none";
      } else {
        renderListView(filteredEmployees);
        gridWrapper.style.display = "none";
        listWrapper.style.display = "block";
        employeeHeader.style.display = "flex";
      }
    }

    employeeCount.textContent = `${filteredEmployees.length} employees displayed`;
  }

  // here add basic search button click event
  basicSearchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showBasicSearch();
  });

  // here add advanced search button click event
  advancedSearchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showAdvancedSearch();
  });

  // here add advanced search submit button click event
  advancedSearchSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchAdvancedEmployees();
  });

  // API base URL for server
  const API_BASE_URL = "http://localhost:3000";

  // here we using fetch api to render employee data dynamically
  fetch(`${API_BASE_URL}/employees`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch employees");
      }
      const employees = data.employees;
      employeesData = employees;
      filteredEmployees = employees;
      updateHeaderEmployee(employees[0]); // Update header with first employee
      populateBuildingOptions();
      populateDepartmentOptions();

      // check if there are search parameters in URL and restore search
      const searchParams = getSearchParamsFromUrl();

      if (
        searchParams.mode === "advanced" &&
        (searchParams.name ||
          searchParams.email ||
          searchParams.phone ||
          searchParams.skype ||
          searchParams.building ||
          searchParams.room ||
          searchParams.department)
      ) {
        // switch to advanced search mode
        showAdvancedSearch();

        advancedNameInput.value = searchParams.name;
        advancedEmailInput.value = searchParams.email;
        advancedPhoneInput.value = searchParams.phone;
        advancedSkypeInput.value = searchParams.skype;
        advancedBuildingInput.value = searchParams.building;
        advancedRoomInput.value = searchParams.room;
        advancedDepartmentInput.value = searchParams.department;

        searchAdvancedEmployees();
      } else if (searchParams.mode === "basic" && searchParams.query) {
        searchInput.value = searchParams.query;

        searchEmployees(searchParams.query);
      } else {
        // no search parameters, display all employees
        renderGridView(employees);
        employeeCount.textContent = `${employees.length} employees displayed`;
      }
    })
    .catch((err) => console.error("Error loading employees:", err));

  // here we addd burger menu logic
  const burgerMenuWrapper = document.querySelector(".burger-menu-wrapper");
  const mobileNav = document.querySelector(".mobile-nav");
  const menuBackdrop = document.querySelector(".menu-backdrop");

  // toggle menu on burger icon click
  if (burgerMenuWrapper) {
    burgerMenuWrapper.addEventListener("click", function (e) {
      burgerMenuWrapper.classList.toggle("open");
      mobileNav.classList.toggle("open");
      menuBackdrop.classList.toggle("open");
      e.stopPropagation();
    });
  }

  // close menu when clicking backdrop
  if (menuBackdrop) {
    menuBackdrop.addEventListener("click", function () {
      burgerMenuWrapper.classList.remove("open");
      mobileNav.classList.remove("open");
      menuBackdrop.classList.remove("open");
    });
  }

  if (mobileNav) {
    mobileNav.addEventListener("click", function (e) {
      if (
        e.target.tagName === "A" ||
        e.target.classList.contains("nav-address-book")
      ) {
        burgerMenuWrapper.classList.remove("open");
        mobileNav.classList.remove("open");
        menuBackdrop.classList.remove("open");
        window.location.href = "main.html";
      }
    });
  }

  // sign out functionality
  const signOutLink = document.querySelector(".sign-out-link");
  const logoutBtn = document.querySelector(".logout-btn");

  function handleSignOut(e) {
    e.preventDefault();
    // clear session from both storages
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    window.location.href = "index.html";
  }

  if (signOutLink) {
    signOutLink.addEventListener("click", handleSignOut);
  }

  if (logoutBtn) {
    logoutBtn.style.cursor = "pointer";
    logoutBtn.addEventListener("click", handleSignOut);
  }

  // redirect to settings page when Settings button is clicked
  const settingsBtn = document.querySelector('.header-options-wrapper .page-title:nth-child(2)');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      window.location.href = 'settings.html';
    });
  }
});
