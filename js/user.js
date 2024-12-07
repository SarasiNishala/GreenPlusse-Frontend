// Base URL of the backend
const BASE_URL = "http://localhost:8080/backend/user";

document.addEventListener("DOMContentLoaded", () => {
  // Elements for Registration
  const createAccountButton = document.querySelector("#register-button"); // Adjusted ID
  const loginButton = document.querySelector("#login-button"); // For login

  // Handle Registration
  if (createAccountButton) {
    createAccountButton.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent default form submission

      const fullName = document.querySelector("#username").value;
      const role = document.querySelector("#role").value;
      const password = document.querySelector("#password").value;
      const confirmPassword = document.querySelector("#confirm-password").value;

      if (!fullName || !role || !password || !confirmPassword) {
        alert("Please fill out all fields.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/register`, {
          method: "POST",
          body: createFormData({
            email: fullName,
            password: password,
            role: role,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Account created successfully! Redirecting to login page...");
          window.location.href = "/index.html";
        } else {
          alert(result.message || "Failed to create account. Please try again.");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    });
  }

  // Handle Login
  if (loginButton) {
    loginButton.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent default form submission

      const email = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;

      if (!email || !password) {
        alert("Please fill out all fields.");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/authenticate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          // Successful login
          alert("Login successful!");
          // Store token in localStorage or sessionStorage
          localStorage.setItem("authToken", result.data.token);

          // Redirect user based on role
          if (result.data.role === "MANAGER") {
            window.location.href = "../pages/dashboard_admin.html";
          } else if (result.data.role === "ADMINISTRATIVE") {
            window.location.href = "../pages/dashboard_manager.html";
          } else if (result.data.role === "SCIENTIST") {
            window.location.href = "../pages/dashboard_scientist.html";
          }
        } else {
          alert(result.message || "Login failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    });
  }
});

// Helper Function: Create FormData
function createFormData(data) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return formData;
}
