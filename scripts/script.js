// fetching employee data from JSON file and rendering employee cards

document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".employee-cards-wrapper");
  const employeeCount = document.querySelector(".employee-count");

  fetch("./data/data.json")
    .then((response) => response.json())
    .then((employees) => {
      wrapper.innerHTML = "";

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

        wrapper.appendChild(card);
      });

      employeeCount.textContent = `${employees.length} employees displayed`;
    })
    .catch((err) => console.error("Error loading employees:", err));
});
