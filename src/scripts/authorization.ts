document.addEventListener("DOMContentLoaded", () => {
  // Tab elements
  const signinTab = document.getElementById("signin-tab") as HTMLButtonElement;
  const signupTab = document.getElementById("signup-tab") as HTMLButtonElement;

  // Form wrapper elements
  const signinFormWrapper = document.getElementById("signin-form-wrapper") as HTMLElement;
  const signupFormWrapper = document.getElementById("signup-form-wrapper") as HTMLElement;

  // Form elements
  const signinForm = document.getElementById("signin-form") as HTMLFormElement;
  const signupForm = document.getElementById("signup-form") as HTMLFormElement;

  // Switch links
  const goToSignup = document.getElementById("go-to-signup") as HTMLAnchorElement;
  const goToSignin = document.getElementById("go-to-signin") as HTMLAnchorElement;

  // Burger menu elements
  const burgerMenuWrapper = document.querySelector(".burger-menu-wrapper") as HTMLElement;
  const mobileNav = document.querySelector(".mobile-nav") as HTMLElement;
  const menuBackdrop = document.querySelector(".menu-backdrop") as HTMLElement;

  // Function to show sign in form
  function showSignIn(): void {
    signinTab.classList.add("active");
    signupTab.classList.remove("active");
    signinFormWrapper.style.display = "block";
    signupFormWrapper.style.display = "none";
  }

  // Function to show sign up form
  function showSignUp(): void {
    signupTab.classList.add("active");
    signinTab.classList.remove("active");
    signupFormWrapper.style.display = "block";
    signinFormWrapper.style.display = "none";
  }

  // Tab click handlers
  if (signinTab) {
    signinTab.addEventListener("click", showSignIn);
  }

  if (signupTab) {
    signupTab.addEventListener("click", showSignUp);
  }

  // Switch link handlers
  if (goToSignup) {
    goToSignup.addEventListener("click", (e: Event) => {
      e.preventDefault();
      showSignUp();
    });
  }

  if (goToSignin) {
    goToSignin.addEventListener("click", (e: Event) => {
      e.preventDefault();
      showSignIn();
    });
  }

  // Sign in form submission
  if (signinForm) {
    signinForm.addEventListener("submit", (e: Event) => {
      e.preventDefault();

      const username = (document.getElementById("signin-username") as HTMLInputElement).value;
      const password = (document.getElementById("signin-password") as HTMLInputElement).value;

      // Basic validation
      if (!username || !password) {
        alert("Please fill in all fields");
        return;
      }

      // Here you would typically make an API call to authenticate the user
      console.log("Sign in attempt:", { username, password: "***" });

      // For demo purposes, redirect to index page
      alert("Sign in successful!");
      window.location.href = "index.html";
    });
  }

  // Sign up form submission
  if (signupForm) {
    signupForm.addEventListener("submit", (e: Event) => {
      e.preventDefault();

      const username = (document.getElementById("signup-username") as HTMLInputElement).value;
      const password = (document.getElementById("signup-password") as HTMLInputElement).value;
      const firstName = (document.getElementById("signup-firstname") as HTMLInputElement).value;
      const lastName = (document.getElementById("signup-lastname") as HTMLInputElement).value;
      const phone = (document.getElementById("signup-phone") as HTMLInputElement).value;

      // Basic validation
      if (!username || !password || !firstName || !lastName || !phone) {
        alert("Please fill in all fields");
        return;
      }

      // Here you would typically make an API call to register the user
      console.log("Sign up attempt:", {
        username,
        password: "***",
        firstName,
        lastName,
        phone,
      });

      // For demo purposes, show success and switch to sign in
      alert("Sign up successful! Please sign in.");
      showSignIn();
    });
  }

  // Burger menu toggle
  if (burgerMenuWrapper) {
    burgerMenuWrapper.addEventListener("click", function (e: Event) {
      burgerMenuWrapper.classList.toggle("open");
      if (mobileNav) mobileNav.classList.toggle("open");
      if (menuBackdrop) menuBackdrop.classList.toggle("open");
      e.stopPropagation();
    });
  }

  // Close menu when clicking backdrop
  if (menuBackdrop) {
    menuBackdrop.addEventListener("click", function () {
      if (burgerMenuWrapper) burgerMenuWrapper.classList.remove("open");
      if (mobileNav) mobileNav.classList.remove("open");
      if (menuBackdrop) menuBackdrop.classList.remove("open");
    });
  }
});
