import LoginPage from "./pages/Login.js";
import HomePage from "./pages/Home.js";
import ProfilePage from "./pages/Profile.js";
import NotFoundPage from "./pages/NotFound.js";
import Layout from "./layout/Layout.js";

const renderPage = (path) => {
  const currentRoute = path || window.location.pathname;
  let currentPage;

  switch (currentRoute) {
    case "/":
      currentPage = Layout(HomePage());
      break;

    case "/login":
      if (localStorage.getItem("user")) {
        return navigate("/");
      }
      currentPage = LoginPage();
      break;

    case "/profile":
      if (!localStorage.getItem("user")) {
        currentPage = LoginPage();
      } else {
        currentPage = Layout(ProfilePage());
      }
      break;

    default:
      currentPage = NotFoundPage();
  }

  document.querySelector("#root").innerHTML = currentPage;
  handleTabClick();
};

const navigate = (path) => {
  window.history.pushState({}, "", path);
  renderPage(path);
};

const handleLinkClick = (event) => {
  if (event.target.tagName === "A" && event.target.href) {
    event.preventDefault();
    const href = event.target.getAttribute("href");
    navigate(href);
  }
};

const handleTabClick = () => {
  const tabs = document.querySelectorAll("a.tab");
  tabs.forEach((tab) => {
    tab.classList.remove("text-blue-600");
    tab.classList.remove("font-bold");
    tab.classList.add("text-gray-600");
  });
  const currentTab = window.location.pathname;
  const tab = document.querySelector(`a[href="${currentTab}"]`);
  if (!tab) return;
  tab.classList.remove("text-gray-600");
  tab.classList.add("text-blue-600");
  tab.classList.add("font-bold");
};

const handleLogin = () => {
  const username = document.querySelector("#username").value;
  localStorage.setItem(
    "user",
    JSON.stringify({ username, email: "", bio: "" })
  );
  navigate("/profile");
};

const handleLogout = (event) => {
  if (event.target.tagName === "A" && event.target.id === "logout") {
    event.preventDefault();
    localStorage.removeItem("user");
    navigate("/");
  }
};

document.addEventListener("click", (event) => {
  handleLinkClick(event);
  handleLogout(event);
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "login-form") {
    event.preventDefault();
    handleLogin();
  }
  if (event.target.id === "profile-form") {
    event.preventDefault();
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const bio = document.querySelector("#bio").value;
    localStorage.setItem("user", JSON.stringify({ username, email, bio }));
    navigate("/profile");
  }
});

window.addEventListener("popstate", () => {
  renderPage();
});

document.addEventListener("DOMContentLoaded", () => {
  renderPage();
});
