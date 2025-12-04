document.addEventListener("DOMContentLoaded", () => {
  // API base URL - change this if server runs on different port
  const API_BASE_URL = "http://localhost:3000";

  // check if user is already logged in (session exists in either storage)
  const existingUser =
    sessionStorage.getItem("user") || localStorage.getItem("user");
  if (existingUser) {
    // user has active session, redirect to main page
    window.location.href = "main.html";
    return;
  }

  // Tab elements
  const signinTab = document.getElementById("signin-tab") as HTMLButtonElement;
  const signupTab = document.getElementById("signup-tab") as HTMLButtonElement;

  // Form wrapper elements
  const signinFormWrapper = document.getElementById(
    "signin-form-wrapper"
  ) as HTMLElement;
  const signupFormWrapper = document.getElementById(
    "signup-form-wrapper"
  ) as HTMLElement;

  // Form elements
  const signinForm = document.getElementById("signin-form") as HTMLFormElement;
  const signupForm = document.getElementById("signup-form") as HTMLFormElement;

  // Switch links
  const goToSignup = document.getElementById(
    "go-to-signup"
  ) as HTMLAnchorElement;
  const goToSignin = document.getElementById(
    "go-to-signin"
  ) as HTMLAnchorElement;

  // Burger menu elements
  const burgerMenuWrapper = document.querySelector(
    ".burger-menu-wrapper"
  ) as HTMLElement;
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
    signinForm.addEventListener("submit", async (e: Event) => {
      e.preventDefault();

      const username = (
        document.getElementById("signin-username") as HTMLInputElement
      ).value;
      const password = (
        document.getElementById("signin-password") as HTMLInputElement
      ).value;

      // Basic validation
      if (!username || !password) {
        alert("Please fill in all fields");
        return;
      }

      try {
        // make API call to sign-in endpoint
        const response = await fetch(`${API_BASE_URL}/sign-in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
          // check if "Remember me" checkbox is checked
          const rememberMe = (
            document.getElementById("signin-remember") as HTMLInputElement
          )?.checked;

          // store user data in appropriate storage
          // localStorage persists even after browser is closed
          // sessionStorage is cleared when the browser tab is closed
          if (rememberMe) {
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            sessionStorage.setItem("user", JSON.stringify(data.user));
          }
          console.log("Sign in successful:", data.user);
          alert("Sign in successful!");
          window.location.href = "main.html";
        } else {
          alert(data.message || "Sign in failed. Please try again.");
        }
      } catch (error) {
        console.error("Sign in error:", error);
        alert(
          "Unable to connect to server. Please make sure the server is running."
        );
      }
    });
  }

  // sign up form submission
  if (signupForm) {
    signupForm.addEventListener("submit", async (e: Event) => {
      e.preventDefault();

      const username = (
        document.getElementById("signup-username") as HTMLInputElement
      ).value;
      const password = (
        document.getElementById("signup-password") as HTMLInputElement
      ).value;
      const firstName = (
        document.getElementById("signup-firstname") as HTMLInputElement
      ).value;
      const lastName = (
        document.getElementById("signup-lastname") as HTMLInputElement
      ).value;
      const phone = (
        document.getElementById("signup-phone") as HTMLInputElement
      ).value;

      // Basic validation
      if (!username || !password || !firstName || !lastName || !phone) {
        alert("Please fill in all fields");
        return;
      }

      try {
        // make API call to sign-up endpoint
        const response = await fetch(`${API_BASE_URL}/sign-up`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            firstName,
            lastName,
            phone,
          }),
        });

        const data = await response.json();

        if (data.success) {
          console.log("Sign up successful:", data.user);
          alert("Sign up successful! Please sign in.");
          // clear form fields
          signupForm.reset();
          // switch to sign in form
          showSignIn();
        } else {
          alert(data.message || "Sign up failed. Please try again.");
        }
      } catch (error) {
        console.error("Sign up error:", error);
        alert(
          "Unable to connect to server. Please make sure the server is running."
        );
      }
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
