document.addEventListener("DOMContentLoaded", () => {
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
  const mobileEmployeeAvatar = document.getElementById("mobile-employee-avatar");
  const mobileEmployeeName = document.getElementById("mobile-employee");

  let employeesData = [];
  let currentView = "grid";
  let filteredEmployees = [];

  // this is function to update header with employee info
  function updateHeaderEmployee(employee) {
    if (employee) {
      const fullName = `${employee.first_name} ${employee.last_name}`;
      headerEmployeeAvatar.src = employee.user_avatar;
      headerEmployeeName.textContent = fullName;
      mobileEmployeeAvatar.src = employee.user_avatar;
      mobileEmployeeName.textContent = fullName;
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

    if (currentView === "grid") {
      renderGridView(filteredEmployees);
    } else {
      renderListView(filteredEmployees);
    }

    employeeCount.textContent = `${filteredEmployees.length} employees displayed`;
  }

  // this function is used to switch to grid view from list view
  function showGridView() {
    currentView = "grid";
    renderGridView(
      filteredEmployees.length > 0 ? filteredEmployees : employeesData
    );
    gridWrapper.style.display = "grid";
    listWrapper.style.display = "none";
    employeeHeader.style.display = "none";
    gridIcon.src = "./assets/blue-grid.png";
    listIcon.src = "./assets/list.png";
  }

  // this function is used to switch to list view from grid view
  function showListView() {
    currentView = "list";
    gridWrapper.style.display = "none";
    listWrapper.style.display = "block";
    employeeHeader.style.display = "flex";
    gridIcon.src = "./assets/grid.png";
    listIcon.src = "./assets/blue-list.png";
    renderListView(
      filteredEmployees.length > 0 ? filteredEmployees : employeesData
    );
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

  // here we using fetch api to render employee data dynamically
  fetch("./data/data.json")
    .then((response) => response.json())
    .then((employees) => {
      employeesData = employees;
      filteredEmployees = employees;
      updateHeaderEmployee(employees[0]); // Update header with first employee
      renderGridView(employees);
      employeeCount.textContent = `${employees.length} employees displayed`;
    })
    .catch((err) => console.error("Error loading employees:", err));
});
