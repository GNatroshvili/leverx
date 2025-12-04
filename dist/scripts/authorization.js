var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => {
    // API base URL - change this if server runs on different port
    const API_BASE_URL = "http://localhost:3000";
    // check if user is already logged in (session exists)
    const existingUser = sessionStorage.getItem("user");
    if (existingUser) {
        // user has active session, redirect to main page
        window.location.href = "main.html";
        return;
    }
    // Tab elements
    const signinTab = document.getElementById("signin-tab");
    const signupTab = document.getElementById("signup-tab");
    // Form wrapper elements
    const signinFormWrapper = document.getElementById("signin-form-wrapper");
    const signupFormWrapper = document.getElementById("signup-form-wrapper");
    // Form elements
    const signinForm = document.getElementById("signin-form");
    const signupForm = document.getElementById("signup-form");
    // Switch links
    const goToSignup = document.getElementById("go-to-signup");
    const goToSignin = document.getElementById("go-to-signin");
    // Burger menu elements
    const burgerMenuWrapper = document.querySelector(".burger-menu-wrapper");
    const mobileNav = document.querySelector(".mobile-nav");
    const menuBackdrop = document.querySelector(".menu-backdrop");
    // Function to show sign in form
    function showSignIn() {
        signinTab.classList.add("active");
        signupTab.classList.remove("active");
        signinFormWrapper.style.display = "block";
        signupFormWrapper.style.display = "none";
    }
    // Function to show sign up form
    function showSignUp() {
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
        goToSignup.addEventListener("click", (e) => {
            e.preventDefault();
            showSignUp();
        });
    }
    if (goToSignin) {
        goToSignin.addEventListener("click", (e) => {
            e.preventDefault();
            showSignIn();
        });
    }
    // Sign in form submission
    if (signinForm) {
        signinForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
            e.preventDefault();
            const username = document.getElementById("signin-username").value;
            const password = document.getElementById("signin-password").value;
            // Basic validation
            if (!username || !password) {
                alert("Please fill in all fields");
                return;
            }
            try {
                // make API call to sign-in endpoint
                const response = yield fetch(`${API_BASE_URL}/sign-in`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });
                const data = yield response.json();
                if (data.success) {
                    // store user data in sessionStorage for session management
                    // sessionStorage is cleared when the browser tab is closed
                    sessionStorage.setItem("user", JSON.stringify(data.user));
                    console.log("Sign in successful:", data.user);
                    alert("Sign in successful!");
                    window.location.href = "main.html";
                }
                else {
                    alert(data.message || "Sign in failed. Please try again.");
                }
            }
            catch (error) {
                console.error("Sign in error:", error);
                alert("Unable to connect to server. Please make sure the server is running.");
            }
        }));
    }
    // sign up form submission
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
            e.preventDefault();
            const username = document.getElementById("signup-username").value;
            const password = document.getElementById("signup-password").value;
            const firstName = document.getElementById("signup-firstname").value;
            const lastName = document.getElementById("signup-lastname").value;
            const phone = document.getElementById("signup-phone").value;
            // Basic validation
            if (!username || !password || !firstName || !lastName || !phone) {
                alert("Please fill in all fields");
                return;
            }
            try {
                // make API call to sign-up endpoint
                const response = yield fetch(`${API_BASE_URL}/sign-up`, {
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
                const data = yield response.json();
                if (data.success) {
                    console.log("Sign up successful:", data.user);
                    alert("Sign up successful! Please sign in.");
                    // clear form fields
                    signupForm.reset();
                    // switch to sign in form
                    showSignIn();
                }
                else {
                    alert(data.message || "Sign up failed. Please try again.");
                }
            }
            catch (error) {
                console.error("Sign up error:", error);
                alert("Unable to connect to server. Please make sure the server is running.");
            }
        }));
    }
    // Burger menu toggle
    if (burgerMenuWrapper) {
        burgerMenuWrapper.addEventListener("click", function (e) {
            burgerMenuWrapper.classList.toggle("open");
            if (mobileNav)
                mobileNav.classList.toggle("open");
            if (menuBackdrop)
                menuBackdrop.classList.toggle("open");
            e.stopPropagation();
        });
    }
    // Close menu when clicking backdrop
    if (menuBackdrop) {
        menuBackdrop.addEventListener("click", function () {
            if (burgerMenuWrapper)
                burgerMenuWrapper.classList.remove("open");
            if (mobileNav)
                mobileNav.classList.remove("open");
            if (menuBackdrop)
                menuBackdrop.classList.remove("open");
        });
    }
});
export {};
//# sourceMappingURL=authorization.js.map