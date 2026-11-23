// DEMO ONLY: change these credentials before testing.
// This browser-only demo cannot securely protect administrator credentials.
const ADMIN_USERNAME = "myzenadmin";
const ADMIN_PASSWORD = "MyzenAdmin@2026";
const form = document.getElementById("adminLoginForm");
form.addEventListener("submit", event => {
  event.preventDefault();
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value;
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    const toast = document.getElementById("toast");
    toast.textContent = "Incorrect admin username or password.";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
    return;
  }
  sessionStorage.setItem("myzen_admin_authenticated", "yes");
  location.href = "admin.html";
});
