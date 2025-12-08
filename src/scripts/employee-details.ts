// here importing SCSS styles
import "../../styles/scss/reset.scss";
import "../../styles/scss/layout.scss";
import "../../styles/scss/header.scss";
import "../../styles/scss/employee-details.scss";

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
  const editBtn = document.querySelector(".edit-btn") as HTMLButtonElement;

  let currentEmployee: any = null;
  let isEditMode = false;
  let currentUserData: any = null;

  if (editBtn) {
    editBtn.classList.add("action-btn", "edit-btn");
  }

  // add click handler to address book button
  if (addressBookBtn) {
    addressBookBtn.style.cursor = "pointer";
    addressBookBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // click handler on manager name to navigate to manager's details
  if (detailsManager) {
    detailsManager.style.cursor = 'default';
    detailsManager.addEventListener('click', (e) => {
      if (isEditMode) return;
      const mgrId = (detailsManager as HTMLElement).dataset.managerId;
      if (mgrId && mgrId !== 'null' && mgrId !== '') {
        window.location.href = `employee-details.html#${mgrId}`;
      }
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
    const hasNativeName =
      employee.first_native_name !== "N/A" &&
      employee.middle_native_name !== "N/A" &&
      employee.last_native_name !== "N/A";
    const nativeFullName = hasNativeName
      ? `${employee.first_native_name} ${employee.middle_native_name} ${employee.last_native_name}`
      : "N/A";

    // handle manager name
    const managerName =
      employee.manager && employee.manager.first_name !== "N/A"
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
    if (detailsDepartment)
      detailsDepartment.textContent = employee.department || "N/A";
    if (detailsBuilding)
      detailsBuilding.textContent = employee.building || "N/A";
    if (detailsRoom) detailsRoom.textContent = employee.room || "N/A";
    if (detailsDeskNumber)
      detailsDeskNumber.textContent = employee.desk_number || "N/A";
    if (detailsDateOfBirth)
      detailsDateOfBirth.textContent = employee.date_birth
        ? formatDateOfBirth(employee.date_birth)
        : "N/A";
    if (detailsManager) {
      detailsManager.textContent = managerName;
      const mgrId = employee.manager && employee.manager.id ? String(employee.manager.id) : '';
      (detailsManager as HTMLElement).dataset.managerId = mgrId;
      (detailsManager as HTMLElement).style.cursor = mgrId ? 'pointer' : 'default';
    }

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

  // API base URL for server
  const API_BASE_URL = "http://localhost:3000";

  // parse current user data
  currentUserData = JSON.parse(currentUser);
  const userIsAdmin =
    currentUserData?.isAdmin === true || currentUserData?.isAdmin === 1;
  const userRole = currentUserData?.role || "employee";
  const userIsHR = userRole === "manager";

  // fetch employee data and populate details
  const employeeId = getEmployeeIdFromUrl();

  // fetch all employees for header and single employee for details
  fetch(`${API_BASE_URL}/employees`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch employees");
      }
      const employees = data.employees;

      // find and update header with currently logged-in user
      const userData = JSON.parse(currentUser);
      const loggedInUser = employees.find(
        (emp: any) => emp.email === userData.email
      );
      if (loggedInUser) {
        updateHeaderEmployee(loggedInUser);

        // Add click handler to header employee name and avatar to navigate to logged-in user's details
        const headerEmployeeData = document.querySelector(
          ".user-data"
        ) as HTMLElement;
        if (headerEmployeeData) {
          headerEmployeeData.style.cursor = "pointer";
          headerEmployeeData.onclick = () => {
            window.location.href = `employee-details.html#${loggedInUser._id}`;
          };
        }
      }

      if (employeeId) {
        const employee = employees.find((emp: any) => emp._id === employeeId);
        currentEmployee = employee;
        populateEmployeeDetails(employee);

        // determine if edit button should be visible
        if (editBtn) {
          const canEdit = determineEditAccess(employee, loggedInUser);
          if (canEdit) {
            editBtn.style.display = "flex";
            editBtn.addEventListener("click", handleEditClick);
          } else {
            editBtn.style.display = "none";
          }
        }
      }
    })
    .catch((err) => console.error("Error loading employee data:", err));

  // function to determine if user can edit this employee
  function determineEditAccess(employee: any, loggedInUser: any): boolean {
    if (!employee || !loggedInUser) return false;

    // admin can edit anyone
    if (userIsAdmin) return true;

    // HR can edit their subordinates
    if (
      userIsHR &&
      employee.manager &&
      employee.manager.id === loggedInUser._id
    ) {
      return true;
    }

    // employee cannot edit
    return false;
  }

  // function to handle edit button click
  async function handleEditClick() {
    if (!isEditMode) {
      await enableEditMode();
    } else {
      saveChanges();
    }
  }

  // function to enable edit mode
  async function enableEditMode() {
    isEditMode = true;
    if (editBtn) {
      editBtn.innerHTML =
        '<img src="./assets/save-icon.png" alt="save-icon" class="btn-icon" onerror="this.style.display=\'none\'" />SAVE';
      // switch classes: use shared action-btn and mark as save state
      editBtn.classList.remove("edit-btn");
      editBtn.classList.add("save-btn");
    }

    // make name fields editable
    makeNameFieldsEditable();
    makeNativeNameFieldsEditable();
    makeDateOfBirthEditable();
    await makeManagerFieldEditable();

    // make general info fields editable
    makeFieldEditable(detailsDepartment, "text", "Enter department");
    makeFieldEditable(detailsBuilding, "text", "Enter building");
    makeFieldEditable(detailsRoom, "text", "Enter room");
    makeFieldEditable(detailsDeskNumber, "number", "Enter desk number");

    // make contact fields editable
    makeFieldEditable(detailsPhone, "tel", "Enter phone number");
    makeFieldEditable(detailsEmail, "email", "Enter email");
    makeFieldEditable(detailsSkype, "text", "Enter Skype ID");
    makeFieldEditable(detailsCNumber, "text", "Enter C-number");

    // make travel info fields editable
    makeFieldEditable(detailsCitizenship, "text", "Enter citizenship");

    // add cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel-btn action-btn";
    cancelBtn.innerHTML = "CANCEL";
    cancelBtn.addEventListener("click", cancelEdit);
    editBtn?.parentElement?.appendChild(cancelBtn);
  }

  // function to make a field editable
  function makeFieldEditable(
    element: HTMLElement | null,
    type: string = "text",
    placeholder: string = ""
  ) {
    if (!element) return;

    const currentValue = element.textContent || "";
    const isNA = currentValue === "N/A" || currentValue.trim() === "";

    const input = document.createElement("input");
    input.type = type;
    input.value = isNA ? "" : currentValue;
    input.placeholder = placeholder || (isNA ? "Enter value" : "");
    input.className = "edit-input";
    input.style.cssText =
      "width: 100%; padding: 4px 8px; border: 1px solid #5591ff; border-radius: 4px; font-size: inherit;";
    input.dataset.originalValue = currentValue;
    input.dataset.fieldId = element.id;

    element.innerHTML = "";
    element.appendChild(input);
  }

  // function to make name fields editable (split into first and last name)
  function makeNameFieldsEditable() {
    const nameElement = document.getElementById("details-employee-name");
    if (!nameElement || !currentEmployee) return;

    const firstName = currentEmployee.first_name || "";
    const lastName = currentEmployee.last_name || "";

    const wrapper = document.createElement("div");
    wrapper.style.cssText = "display: flex; gap: 8px; width: 100%;";

    const firstNameInput = document.createElement("input");
    firstNameInput.type = "text";
    firstNameInput.value = firstName;
    firstNameInput.placeholder = "First Name";
    firstNameInput.className = "edit-input";
    firstNameInput.style.cssText =
      "flex: 1; padding: 4px 8px; border: 1px solid #5591ff; border-radius: 4px; font-size: inherit;";
    firstNameInput.dataset.originalValue = firstName;
    firstNameInput.dataset.fieldId = "first_name";

    const lastNameInput = document.createElement("input");
    lastNameInput.type = "text";
    lastNameInput.value = lastName;
    lastNameInput.placeholder = "Last Name";
    lastNameInput.className = "edit-input";
    lastNameInput.style.cssText =
      "flex: 1; padding: 4px 8px; border: 1px solid #5591ff; border-radius: 4px; font-size: inherit;";
    lastNameInput.dataset.originalValue = lastName;
    lastNameInput.dataset.fieldId = "last_name";

    wrapper.appendChild(firstNameInput);
    wrapper.appendChild(lastNameInput);

    nameElement.innerHTML = "";
    nameElement.appendChild(wrapper);
  }

  // function to make native name fields editable
  function makeNativeNameFieldsEditable() {
    const nativeNameElement = document.getElementById(
      "details-employee-native-name"
    );
    if (!nativeNameElement || !currentEmployee) return;

    const firstNative =
      currentEmployee.first_native_name === "N/A"
        ? ""
        : currentEmployee.first_native_name || "";
    const middleNative =
      currentEmployee.middle_native_name === "N/A"
        ? ""
        : currentEmployee.middle_native_name || "";
    const lastNative =
      currentEmployee.last_native_name === "N/A"
        ? ""
        : currentEmployee.last_native_name || "";

    const wrapper = document.createElement("div");
    wrapper.style.cssText =
      "display: flex; gap: 6px; width: 100%; flex-wrap: wrap;";

    const inputs = [
      {
        value: firstNative,
        placeholder: "First Native",
        field: "first_native_name",
      },
      {
        value: middleNative,
        placeholder: "Middle Native",
        field: "middle_native_name",
      },
      {
        value: lastNative,
        placeholder: "Last Native",
        field: "last_native_name",
      },
    ];

    inputs.forEach(({ value, placeholder, field }) => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = value;
      input.placeholder = placeholder;
      input.className = "edit-input";
      input.style.cssText =
        "flex: 1; min-width: 100px; padding: 4px 8px; border: 1px solid #5591ff; border-radius: 4px; font-size: inherit;";
      input.dataset.originalValue = value;
      input.dataset.fieldId = field;
      wrapper.appendChild(input);
    });

    nativeNameElement.innerHTML = "";
    nativeNameElement.appendChild(wrapper);
  }

  // function to make manager field editable with dropdown
  async function makeManagerFieldEditable() {
    const managerElement = document.getElementById("details-manager");
    if (!managerElement || !currentEmployee) return;

    try {
      // fetch all employees who are managers
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();

      if (data.success) {
        const managers = data.employees.filter(
          (emp: any) => emp.role === "manager"
        );

        const select = document.createElement("select");
        select.className = "edit-input";
        select.style.cssText =
          "width: 100%; padding: 4px 8px; border: 1px solid #5591ff; border-radius: 4px; font-size: inherit; cursor: pointer;";
        select.dataset.fieldId = "manager_id";

        // here i have current manager ID - for handling both null and n/a cases
        const currentManagerId =
          currentEmployee.manager?.id && currentEmployee.manager.id !== null
            ? String(currentEmployee.manager.id)
            : "";
        select.dataset.originalValue = currentManagerId;

        console.log("Current manager ID:", currentManagerId);

        // add empty option
        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "No Manager";
        if (!currentManagerId) {
          emptyOption.selected = true;
        }
        select.appendChild(emptyOption);

        // add manager options
        managers.forEach((manager: any) => {
          const option = document.createElement("option");
          option.value = manager._id;
          option.textContent = `${manager.first_name} ${manager.last_name}`;
          if (manager._id === currentManagerId) {
            option.selected = true;
          }
          select.appendChild(option);
        });

        managerElement.innerHTML = "";
        managerElement.appendChild(select);
      }
    } catch (error) {
      console.error("Error loading managers:", error);
    }
  }

  // function to make date of birth editable
  function makeDateOfBirthEditable() {
    const dobElement = document.getElementById("details-date-of-birth");
    if (!dobElement || !currentEmployee) return;

    const dateObj = currentEmployee.date_birth;
    let dateValue = "";
    if (dateObj && dateObj.year) {
      const year = dateObj.year;
      const month = String(dateObj.month).padStart(2, "0");
      const day = String(dateObj.day).padStart(2, "0");
      dateValue = `${year}-${month}-${day}`;
    }

    const input = document.createElement("input");
    input.type = "date";
    input.value = dateValue;
    input.className = "edit-input";
    input.style.cssText =
      "width: 100%; padding: 4px 8px; border: 1px solid #5591ff; border-radius: 4px; font-size: inherit;";
    input.dataset.originalValue = dateValue;
    input.dataset.fieldId = "date_birth";

    dobElement.innerHTML = "";
    dobElement.appendChild(input);
  }

  // function to cancel edit mode
  function cancelEdit() {
    isEditMode = false;
    if (currentEmployee) {
      populateEmployeeDetails(currentEmployee);
    }

    if (editBtn) {
      editBtn.innerHTML =
        '<img src="./assets/pencil.png" alt="edit-icon" class="btn-icon" />EDIT';
      editBtn.classList.remove("save-btn");
      editBtn.classList.add("edit-btn");
    }

    // remove cancel button
    const cancelBtn = document.querySelector(".cancel-btn");
    if (cancelBtn) cancelBtn.remove();
  }

  // function to save changes
  async function saveChanges() {
    if (!currentEmployee) return;

    // collect changed values from both inputs and selects
    const updates: any = {};
    const editableElements = document.querySelectorAll(
      ".edit-input"
    ) as NodeListOf<HTMLInputElement | HTMLSelectElement>;

    console.log("Collecting changes from", editableElements.length, "elements");

    editableElements.forEach((element) => {
      const fieldId = element.dataset.fieldId;
      const newValue = element.value;
      const originalValue = element.dataset.originalValue || "";

      console.log(`Field ${fieldId}: "${originalValue}" -> "${newValue}"`);

      if (fieldId && newValue !== originalValue) {
        if (fieldId === "date_birth" && newValue) {
          const [year, month, day] = newValue.split("-");
          if (year && month && day) {
            updates.date_birth_year = parseInt(year);
            updates.date_birth_month = parseInt(month);
            updates.date_birth_day = parseInt(day);
          }
        }
        // handle direct field mappings (including manager_id)
        else if (
          [
            "first_name",
            "last_name",
            "first_native_name",
            "middle_native_name",
            "last_native_name",
            "manager_id",
          ].includes(fieldId)
        ) {
          if (fieldId === "manager_id") {
            updates[fieldId] = newValue || null;
            console.log("Manager ID update:", newValue || null);
          } else if (newValue.trim()) {
            updates[fieldId] = newValue.trim();
          }
        } else {
          const fieldMap: { [key: string]: string } = {
            "details-department": "department",
            "details-building": "building",
            "details-room": "room",
            "details-desk-number": "desk_number",
            "details-phone": "phone",
            "details-email": "email",
            "details-skype": "skype",
            "details-cnumber": "cnumber",
            "details-citizenship": "citizenship",
          };

          const apiFieldName = fieldMap[fieldId];
          if (apiFieldName && newValue.trim()) {
            updates[apiFieldName] = newValue.trim();
          }
        }
      }
    });

    console.log("Updates to send:", updates);

    if (Object.keys(updates).length === 0) {
      alert("No changes to save");
      cancelEdit();
      return;
    }

    // send update request to server
    try {
      const response = await fetch(
        `${API_BASE_URL}/employees/${currentEmployee._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            updates,
            requestingUserEmail: currentUserData.email,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Changes saved successfully!");
        // reload employee data from server
        const employeeResponse = await fetch(
          `${API_BASE_URL}/employees/${currentEmployee._id}`
        );
        const employeeData = await employeeResponse.json();
        if (employeeData.success) {
          currentEmployee = employeeData.employee;
          isEditMode = false;
          populateEmployeeDetails(currentEmployee);

          if (editBtn) {
            editBtn.innerHTML =
              '<img src="./assets/pencil.png" alt="edit-icon" class="btn-icon" />EDIT';
            editBtn.classList.remove("save-btn");
            editBtn.classList.add("edit-btn");
          }

          // remove cancel button
          const cancelBtn = document.querySelector(".cancel-btn");
          if (cancelBtn) cancelBtn.remove();
        }
      } else {
        alert(data.message || "Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  }

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

  // redirect to settings page when Settings button is clicked
  const settingsBtn = document.querySelector(
    ".header-options-wrapper .page-title:nth-child(2)"
  );
  if (settingsBtn) {
    const stored =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        const isAdmin =
          user?.isAdmin === true ||
          user?.isAdmin === 1 ||
          user?.isAdmin === "1";
        if (!isAdmin) {
          (settingsBtn as HTMLElement).style.display = "none";
        } else {
          settingsBtn.addEventListener("click", () => {
            window.location.href = "settings.html";
          });
        }
      } catch (e) {
        (settingsBtn as HTMLElement).style.display = "none";
      }
    } else {
      (settingsBtn as HTMLElement).style.display = "none";
    }
  }
});
