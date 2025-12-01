document.addEventListener("DOMContentLoaded", () => {
  const headerEmployeeAvatar = document.getElementById("employee-avatar");
  const headerEmployeeName = document.getElementById("employee-username");
  const mobileEmployeeAvatar = document.getElementById(
    "mobile-employee-avatar"
  );
  const mobileEmployeeName = document.getElementById("mobile-employee");
  const detailsEmployeeAvatar = document.getElementById(
    "details-employee-avatar"
  );
  const detailsEmployeeName = document.getElementById("details-employee-name");
  const detailsEmployeeNativeName = document.getElementById(
    "details-employee-native-name"
  );
  const detailsRemoteWorkIcon = document.getElementById(
    "details-remote-work-icon"
  );
  const detailsDepartment = document.getElementById("details-department");
  const detailsBuilding = document.getElementById("details-building");
  const detailsRoom = document.getElementById("details-room");
  const detailsDeskNumber = document.getElementById("details-desk-number");
  const detailsDateOfBirth = document.getElementById("details-date-of-birth");
  const detailsManager = document.getElementById("details-manager");
  const detailsPhone = document.getElementById("details-phone");
  const detailsEmail = document.getElementById("details-email");
  const detailsSkype = document.getElementById("details-skype");
  const detailsCNumber = document.getElementById("details-cnumber");
  const detailsCitizenship = document.getElementById("details-citizenship");
  const detailsVisa1 = document.getElementById("details-visa-1");
  const detailsVisa1Period = document.getElementById("details-visa-1-period");
  const detailsVisa2 = document.getElementById("details-visa-2");
  const detailsVisa2Period = document.getElementById("details-visa-2-period");
  const leftArrowIcon = document.querySelector(".left-arrow-icon");

  // this function is used to get employee id from url parameter
  function getEmployeeIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }

  // this function is used to format date from timestamp
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // this function is used to format date of birth
  function formatDateOfBirth(dateObj) {
    const day = String(dateObj.day).padStart(2, "0");
    const month = String(dateObj.month).padStart(2, "0");
    const year = dateObj.year;
    return `${day}.${month}.${year}`;
  }

  // this function is used to check if visa is expired
  function isVisaExpired(endDate) {
    const currentDate = Date.now();
    return endDate < currentDate;
  }

  // this function is used to update header with first employee
  function updateHeaderEmployee(firstEmployee) {
    if (firstEmployee) {
      const fullName = `${firstEmployee.first_name} ${firstEmployee.last_name}`;
      headerEmployeeAvatar.src = firstEmployee.user_avatar;
      headerEmployeeName.textContent = fullName;
      mobileEmployeeAvatar.src = firstEmployee.user_avatar;
      mobileEmployeeName.textContent = fullName;
    }
  }

  // this function is used to populate employee details on page
  function populateEmployeeDetails(employee) {
    if (!employee) {
      window.location.href = "404-not-found.html";
      return;
    }

    const fullName = `${employee.first_name} ${employee.last_name}`;
    const nativeFullName = `${employee.first_native_name} ${employee.middle_native_name} ${employee.last_native_name}`;
    const managerName = `${employee.manager.first_name} ${employee.manager.last_name}`;

    // update employee avatar section
    detailsEmployeeAvatar.src = employee.user_avatar;
    detailsEmployeeName.textContent = fullName;
    detailsEmployeeNativeName.textContent = nativeFullName;

    // show/hide remote work icon
    if (employee.isRemoteWork) {
      detailsRemoteWorkIcon.style.display = "block";
    } else {
      detailsRemoteWorkIcon.style.display = "none";
    }

    // update general info
    detailsDepartment.textContent = employee.department;
    detailsBuilding.textContent = employee.building;
    detailsRoom.textContent = employee.room;
    detailsDeskNumber.textContent = employee.desk_number;
    detailsDateOfBirth.textContent = formatDateOfBirth(employee.date_birth);
    detailsManager.textContent = managerName;

    // update contact info
    detailsPhone.textContent = employee.phone;
    detailsEmail.textContent = employee.email;
    detailsSkype.textContent = employee.skype;
    detailsCNumber.textContent = employee.cnumber;

    // update travel info
    detailsCitizenship.textContent = employee.citizenship;

    if (employee.visa && employee.visa.length > 0) {
      const visa1 = employee.visa[0];
      detailsVisa1.textContent = `${visa1.issuing_country} - ${visa1.type}`;
      const visa1Expired = isVisaExpired(visa1.end_date);
      detailsVisa1Period.textContent = `${formatDate(
        visa1.start_date
      )} - ${formatDate(visa1.end_date)}${visa1Expired ? " (expired)" : ""}`;

      if (employee.visa.length > 1) {
        const visa2 = employee.visa[1];
        detailsVisa2.textContent = `${visa2.issuing_country} - ${visa2.type}`;
        const visa2Expired = isVisaExpired(visa2.end_date);
        detailsVisa2Period.textContent = `${formatDate(
          visa2.start_date
        )} - ${formatDate(visa2.end_date)}${visa2Expired ? " (expired)" : ""}`;
      }
    }
  }

  // add click handler to left arrow to go back
  if (leftArrowIcon) {
    leftArrowIcon.style.cursor = "pointer";
    leftArrowIcon.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // fetch employee data and populate details
  const employeeId = getEmployeeIdFromUrl();

  if (employeeId) {
    fetch("./data/data.json")
      .then((response) => response.json())
      .then((employees) => {
        // always update header with first employee
        updateHeaderEmployee(employees[0]);
        
        const employee = employees.find((emp) => emp._id === employeeId);
        populateEmployeeDetails(employee);
      })
      .catch((err) => console.error("Error loading employee data:", err));
  } else {
    console.error("No employee ID provided in URL");
  }
});
