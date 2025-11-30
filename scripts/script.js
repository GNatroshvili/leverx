document.addEventListener("DOMContentLoaded", () => {
  const gridWrapper = document.querySelector(".employee-cards-wrapper");
  const listWrapper = document.querySelector(".employee-list-cards-wrapper");
  const employeeHeader = document.querySelector(".employee-header");
  const employeeCount = document.querySelector(".employee-count");
  const gridViewBtn = document.getElementById("grid-view-btn");
  const listViewBtn = document.getElementById("list-view-btn");
  const gridIcon = document.getElementById("grid-icon");
  const listIcon = document.getElementById("list-icon");

  let employeesData = [];

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

  // this function is used to switch to grid view from list view
  function showGridView() {
    currentView = "grid";
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
  }

  gridViewBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showGridView();
  });

  listViewBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showListView();
    renderListView(employeesData);
  });

  // here we using fetch api to render employee data dynamically
  fetch("./data/data.json")
    .then((response) => response.json())
    .then((employees) => {
      employeesData = employees;
      renderGridView(employees);
      employeeCount.textContent = `${employees.length} employees displayed`;
    })
    .catch((err) => console.error("Error loading employees:", err));
});
