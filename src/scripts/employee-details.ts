// here importing SCSS styles
import '../../styles/scss/reset.scss';
import '../../styles/scss/layout.scss';
import '../../styles/scss/header.scss';
import '../../styles/scss/employee-details.scss';

document.addEventListener("DOMContentLoaded", () => {
  // check if user is logged in (session exists in either storage)
  const currentUser =
    sessionStorage.getItem("user") || localStorage.getItem("user");
  if (!currentUser) {
    // no active session, redirect to sign-in page
    window.location.href = "index.html";
    return;
  }

  const headerEmployeeAvatar = document.getElementById(
    "employee-avatar"
  ) as HTMLImageElement;
  const headerEmployeeName = document.getElementById("employee-username");
  const mobileEmployeeAvatar = document.getElementById(
    "mobile-employee-avatar"
  ) as HTMLImageElement;
  const mobileEmployeeName = document.getElementById("mobile-employee");
  const detailsEmployeeAvatar = document.getElementById(
    "details-employee-avatar"
  ) as HTMLImageElement;
  const detailsEmployeeName = document.getElementById("details-employee-name");
  const detailsEmployeeNativeName = document.getElementById(
    "details-employee-native-name"
  );
  const detailsRemoteWorkIcon = document.getElementById(
    "details-remote-work-icon"
  ) as HTMLElement;
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
  const leftArrowIcon = document.querySelector(
    ".left-arrow-icon"
  ) as HTMLElement;
  const addressBookBtn = document.querySelector(".page-title") as HTMLElement;

  // add click handler to address book button
  if (addressBookBtn) {
    addressBookBtn.style.cursor = "pointer";
    addressBookBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // this function is used to get employee id from url hash (path parameter)
  function getEmployeeIdFromUrl() {
    // get id from hash (e.g., employee-details.html#abc123)
    return window.location.hash.substring(1); // remove the '#' prefix
  }

  // this function is used to format date from timestamp
  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // this function is used to format date of birth
  function formatDateOfBirth(dateObj: any): string {
    const day = String(dateObj.day).padStart(2, "0");
    const month = String(dateObj.month).padStart(2, "0");
    const year = dateObj.year;
    return `${day}.${month}.${year}`;
  }

  // this function is used to check if visa is expired
  function isVisaExpired(endDate: number): boolean {
    const currentDate = Date.now();
    return endDate < currentDate;
  }

  // this function is used to update header with first employee
  function updateHeaderEmployee(firstEmployee: any): void {
    if (firstEmployee) {
      const fullName = `${firstEmployee.first_name} ${firstEmployee.last_name}`;
      if (headerEmployeeAvatar)
        headerEmployeeAvatar.src = firstEmployee.user_avatar;
      if (headerEmployeeName) headerEmployeeName.textContent = fullName;
      if (mobileEmployeeAvatar)
        mobileEmployeeAvatar.src = firstEmployee.user_avatar;
      if (mobileEmployeeName) mobileEmployeeName.textContent = fullName;
    }
  }

  // this function is used to populate employee details on page
  function populateEmployeeDetails(employee: any): void {
    if (!employee) {
      window.location.href = "404-not-found.html";
      return;
    }

    const fullName = `${employee.first_name} ${employee.last_name}`;
    
    // handle native name - check if it's N/A
    const hasNativeName = employee.first_native_name !== "N/A" && 
                          employee.middle_native_name !== "N/A" && 
                          employee.last_native_name !== "N/A";
    const nativeFullName = hasNativeName 
      ? `${employee.first_native_name} ${employee.middle_native_name} ${employee.last_native_name}`
      : "N/A";
    
    // handle manager name
    const managerName = employee.manager && employee.manager.first_name !== "N/A"
      ? `${employee.manager.first_name} ${employee.manager.last_name}`
      : "N/A";

    // update employee avatar section
    if (detailsEmployeeAvatar) detailsEmployeeAvatar.src = employee.user_avatar;
    if (detailsEmployeeName) detailsEmployeeName.textContent = fullName;
    if (detailsEmployeeNativeName)
      detailsEmployeeNativeName.textContent = nativeFullName;

    // show/hide remote work icon
    if (employee.isRemoteWork) {
      if (detailsRemoteWorkIcon) detailsRemoteWorkIcon.style.display = "block";
    } else {
      if (detailsRemoteWorkIcon) detailsRemoteWorkIcon.style.display = "none";
    }

    // update general info
    if (detailsDepartment) detailsDepartment.textContent = employee.department || "N/A";
    if (detailsBuilding) detailsBuilding.textContent = employee.building || "N/A";
    if (detailsRoom) detailsRoom.textContent = employee.room || "N/A";
    if (detailsDeskNumber) detailsDeskNumber.textContent = employee.desk_number || "N/A";
    if (detailsDateOfBirth)
      detailsDateOfBirth.textContent = employee.date_birth ? formatDateOfBirth(employee.date_birth) : "N/A";
    if (detailsManager) detailsManager.textContent = managerName;

    // update contact info
    if (detailsPhone) detailsPhone.textContent = employee.phone || "N/A";
    if (detailsEmail) detailsEmail.textContent = employee.email || "N/A";
    if (detailsSkype) detailsSkype.textContent = employee.skype || "N/A";
    if (detailsCNumber) detailsCNumber.textContent = employee.cnumber || "N/A";

    // update travel info
    if (detailsCitizenship)
      detailsCitizenship.textContent = employee.citizenship || "N/A";

    if (employee.visa && employee.visa.length > 0) {
      const visa1 = employee.visa[0];
      if (detailsVisa1)
        detailsVisa1.textContent = `${visa1.issuing_country} - ${visa1.type}`;
      const visa1Expired = isVisaExpired(visa1.end_date);
      if (detailsVisa1Period)
        detailsVisa1Period.textContent = `${formatDate(
          visa1.start_date
        )} - ${formatDate(visa1.end_date)}${visa1Expired ? " (expired)" : ""}`;

      if (employee.visa.length > 1) {
        const visa2 = employee.visa[1];
        if (detailsVisa2)
          detailsVisa2.textContent = `${visa2.issuing_country} - ${visa2.type}`;
        const visa2Expired = isVisaExpired(visa2.end_date);
        if (detailsVisa2Period)
          detailsVisa2Period.textContent = `${formatDate(
            visa2.start_date
          )} - ${formatDate(visa2.end_date)}${
            visa2Expired ? " (expired)" : ""
          }`;
      }
    } else {
      // no visa data available
      if (detailsVisa1) detailsVisa1.textContent = "N/A";
      if (detailsVisa1Period) detailsVisa1Period.textContent = "";
      if (detailsVisa2) detailsVisa2.textContent = "N/A";
      if (detailsVisa2Period) detailsVisa2Period.textContent = "";
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

  // API base URL for server
  const API_BASE_URL = "http://localhost:3000";

  // fetch all employees for header and single employee for details
  fetch(`${API_BASE_URL}/employees`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch employees");
      }
      const employees = data.employees;
      // always update header with first employee
      updateHeaderEmployee(employees[0]);

      // Add click handler to header employee name and avatar
      const headerEmployeeData = document.querySelector(
        ".user-data"
      ) as HTMLElement;
      if (headerEmployeeData) {
        headerEmployeeData.style.cursor = "pointer";
        headerEmployeeData.onclick = () => {
          window.location.href = `employee-details.html#${employees[0]._id}`;
        };
      }

      if (employeeId) {
        const employee = employees.find((emp: any) => emp._id === employeeId);
        populateEmployeeDetails(employee);
      }
    })
    .catch((err) => console.error("Error loading employee data:", err));

  // here we addd burger menu logic
  const burgerMenuWrapper = document.querySelector(".burger-menu-wrapper");
  const mobileNav = document.querySelector(".mobile-nav");
  const menuBackdrop = document.querySelector(".menu-backdrop");

  // toggle menu on burger icon click
  if (burgerMenuWrapper) {
    burgerMenuWrapper.addEventListener("click", function (e) {
      burgerMenuWrapper.classList.toggle("open");
      if (mobileNav) mobileNav.classList.toggle("open");
      if (menuBackdrop) menuBackdrop.classList.toggle("open");
      e.stopPropagation();
    });
  }

  // close menu when clicking backdrop
  if (menuBackdrop) {
    menuBackdrop.addEventListener("click", function () {
      if (burgerMenuWrapper) burgerMenuWrapper.classList.remove("open");
      if (mobileNav) mobileNav.classList.remove("open");
      if (menuBackdrop) menuBackdrop.classList.remove("open");
    });
  }

  if (mobileNav) {
    mobileNav.addEventListener("click", function (e) {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "A" ||
          target.classList.contains("nav-address-book"))
      ) {
        // check if it's the sign-out link
        if (target.classList.contains("sign-out-link")) {
          e.preventDefault();
          // clear session from both storages
          sessionStorage.removeItem("user");
          localStorage.removeItem("user");
          window.location.href = "index.html";
          return;
        }
        if (burgerMenuWrapper) burgerMenuWrapper.classList.remove("open");
        if (mobileNav) mobileNav.classList.remove("open");
        if (menuBackdrop) menuBackdrop.classList.remove("open");
        window.location.href = "main.html";
      }
    });
  }

  // sign out functionality
  const signOutLink = document.querySelector(".sign-out-link") as HTMLElement;
  const logoutBtn = document.querySelector(".logout-btn") as HTMLElement;

  function handleSignOut(e: Event): void {
    e.preventDefault();
    // clear session from both storages
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    // redirect to sign-in page
    window.location.href = "index.html";
  }

  if (signOutLink) {
    signOutLink.addEventListener("click", handleSignOut);
  }

  if (logoutBtn) {
    logoutBtn.style.cursor = "pointer";
    logoutBtn.addEventListener("click", handleSignOut);
  }
});
