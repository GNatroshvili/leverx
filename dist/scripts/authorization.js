document.addEventListener("DOMContentLoaded", () => {
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
        signinForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("signin-username").value;
            const password = document.getElementById("signin-password").value;
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
        signupForm.addEventListener("submit", (e) => {
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