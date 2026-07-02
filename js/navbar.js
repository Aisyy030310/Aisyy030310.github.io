(function () {
  var page = location.pathname.split("/").pop() || "index.html";
  var morePages = ["services.html", "products.html", "pricing.html", "team.html", "careers.html", "privacy.html"];
  var isMore = morePages.indexOf(page) !== -1;

  function navClass(href) {
    return page === href ? " active" : "";
  }

  var html =
    '<nav class="navbar navbar-expand-lg navbar-dark navbar-fluxr sticky-top">' +
    '<div class="container">' +
    '<a class="navbar-brand d-flex align-items-center gap-2" href="index.html">' +
    '<img src="assets/images/fluxr-logo.png" alt="Fluxr logo">' +
    '<span class="fw-bold">Fluxr</span></a>' +
    '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">' +
    '<span class="navbar-toggler-icon"></span></button>' +
    '<div class="collapse navbar-collapse" id="mainNav">' +
    '<ul class="navbar-nav me-auto">' +
    '<li class="nav-item"><a class="nav-link' + navClass("index.html") + '" href="index.html" data-i18n="nav-home">Home</a></li>' +
    '<li class="nav-item"><a class="nav-link' + navClass("about.html") + '" href="about.html" data-i18n="nav-about">About</a></li>' +
    '<li class="nav-item"><a class="nav-link' + navClass("features.html") + '" href="features.html" data-i18n="nav-features">Features</a></li>' +
    '<li class="nav-item"><a class="nav-link' + navClass("gallery.html") + '" href="gallery.html" data-i18n="nav-gallery">Gallery</a></li>' +
    '<li class="nav-item"><a class="nav-link' + navClass("blog.html") + '" href="blog.html" data-i18n="nav-blog">Blog</a></li>' +
    '<li class="nav-item"><a class="nav-link' + navClass("contact.html") + '" href="contact.html" data-i18n="nav-contact">Contact</a></li>' +
    '<li class="nav-item"><a class="nav-link' + navClass("profile.html") + '" href="profile.html" data-i18n="nav-profile">Profile</a></li>' +
    '<li class="nav-item"><a class="nav-link' + navClass("messages.html") + '" href="messages.html" data-i18n="nav-messages">Messages</a></li>' +
    '<li class="nav-item dropdown">' +
    '<a class="nav-link dropdown-toggle' + (isMore ? " active" : "") + '" href="#" data-bs-toggle="dropdown" data-i18n="nav-more">More</a>' +
    '<ul class="dropdown-menu">' +
    '<li><a class="dropdown-item' + navClass("services.html") + '" href="services.html" data-i18n="nav-services">Services</a></li>' +
    '<li><a class="dropdown-item' + navClass("products.html") + '" href="products.html" data-i18n="nav-products">Products</a></li>' +
    '<li><a class="dropdown-item' + navClass("pricing.html") + '" href="pricing.html" data-i18n="nav-pricing">Pricing</a></li>' +
    '<li><a class="dropdown-item' + navClass("team.html") + '" href="team.html" data-i18n="nav-team">Team</a></li>' +
    '<li><a class="dropdown-item' + navClass("careers.html") + '" href="careers.html" data-i18n="nav-careers">Careers</a></li>' +
    '<li><a class="dropdown-item' + navClass("privacy.html") + '" href="privacy.html" data-i18n="nav-privacy">Privacy</a></li>' +
    "</ul></li></ul>" +
    '<form class="d-flex me-2 nav-search" id="navSearchForm" role="search">' +
    '<input class="form-control form-control-sm" type="search" id="navSearchInput" data-i18n-placeholder="search-placeholder" placeholder="Search..." aria-label="Search">' +
    "</form>" +
    '<div class="dropdown me-2">' +
    '<button class="btn btn-outline-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" id="langBtn">EN</button>' +
    '<ul class="dropdown-menu dropdown-menu-end">' +
    '<li><a class="dropdown-item lang-option" href="#" data-lang="en">English</a></li>' +
    '<li><a class="dropdown-item lang-option" href="#" data-lang="bm">Bahasa Melayu</a></li>' +
    "</ul></div>" +
    '<button type="button" class="btn btn-outline-light btn-sm me-2" id="darkModeBtn" title="Dark mode"><i class="fa fa-moon-o"></i></button>' +
    '<div class="dropdown me-2">' +
    '<button class="btn btn-outline-light btn-sm btn-notif dropdown-toggle" type="button" data-bs-toggle="dropdown" id="notifBtn">' +
    '<i class="fa fa-bell"></i><span class="notif-dot"></span></button>' +
    '<ul class="dropdown-menu dropdown-menu-end notif-dropdown" id="notifList"></ul></div>' +
    '<div class="d-flex align-items-center flex-wrap gap-2" id="navAuthArea"></div>' +
    "</div></div></nav>";

  var root = document.getElementById("nav-root");
  if (root) {
    root.innerHTML = html;
  }

  function renderNavAuth() {
    var area = document.getElementById("navAuthArea");
    if (!area) {
      return;
    }
    var user = localStorage.getItem("fluxr-user") || "";
    var loggedIn = localStorage.getItem("fluxr-logged-in") === "1" && user !== "";
    var logoutText = typeof fluxrT === "function" ? fluxrT("nav-logout") : "Logout";
    var joinText = typeof fluxrT === "function" ? fluxrT("nav-join") : "Join";
    var loginText = typeof fluxrT === "function" ? fluxrT("nav-login") : "Login";

    if (loggedIn) {
      area.innerHTML =
        '<a href="profile.html" class="btn btn-outline-light btn-sm"><i class="fa fa-user me-1"></i>' + user + "</a>" +
        '<button type="button" class="btn btn-fluxr-accent btn-sm" id="navLogoutBtn">' + logoutText + "</button>";
      var logoutBtn = document.getElementById("navLogoutBtn");
      if (logoutBtn) {
        logoutBtn.onclick = function () {
          if (typeof fluxrLogout === "function") {
            fluxrLogout();
          } else {
            localStorage.removeItem("fluxr-logged-in");
            localStorage.removeItem("fluxr-user");
            localStorage.removeItem("fluxr-user-email");
            localStorage.removeItem("fluxr-bio");
          }
          window.location.href = "index.html";
        };
      }
    } else {
      area.innerHTML =
        '<a href="join.html" class="btn btn-fluxr-accent btn-sm">' + joinText + "</a>" +
        '<a href="login.html" class="btn btn-outline-light btn-sm">' + loginText + "</a>";
    }
  }

  window.renderNavAuth = renderNavAuth;

  function getNotifLabel(key) {
    if (typeof fluxrT === "function") {
      return fluxrT(key);
    }
    if (key === "notif-login") {
      return "Login to see your notifications.";
    }
    if (key === "notif-empty") {
      return "No notifications yet.";
    }
    return "";
  }

  function formatNotifHtml(n) {
    var name = n.fromName || "Someone";
    var template = getNotifLabel("notif-" + n.type);
    if (!template) {
      template = getNotifLabel("notif-info");
    }
    var html = template.replace("{name}", "<strong>" + name + "</strong>");
    if (n.type === "post" && n.text) {
      var preview = n.text.length > 50 ? n.text.substring(0, 50) + "..." : n.text;
      html += ' <span class="text-muted d-block mt-1">"' + preview + '"</span>';
    }
    if (n.type === "message" && n.text) {
      var msgPreview = n.text.length > 40 ? n.text.substring(0, 40) + "..." : n.text;
      html += ' <span class="text-muted d-block mt-1">"' + msgPreview + '"</span>';
    }
    return html;
  }

  function renderNavNotifications() {
    var list = document.getElementById("notifList");
    var dot = document.querySelector(".notif-dot");
    if (!list) {
      return;
    }

    var loggedIn = localStorage.getItem("fluxr-logged-in") === "1";
    var myEmail = (localStorage.getItem("fluxr-user-email") || "").trim().toLowerCase();

    if (!loggedIn || !myEmail) {
      list.innerHTML = '<li><span class="dropdown-item small text-muted">' + getNotifLabel("notif-login") + "</span></li>";
      if (dot) {
        dot.style.display = "none";
      }
      return;
    }

    var raw = localStorage.getItem("fluxr-notifications");
    var all = [];
    var mine = [];
    var unread = 0;
    var i;

    try {
      all = JSON.parse(raw || "[]");
    } catch (e) {
      all = [];
    }

    for (i = 0; i < all.length; i++) {
      if (all[i].toEmail === myEmail) {
        mine.push(all[i]);
        if (!all[i].read) {
          unread += 1;
        }
      }
    }

    mine.sort(function (a, b) {
      return (b.at || 0) - (a.at || 0);
    });

    if (dot) {
      dot.style.display = unread > 0 ? "block" : "none";
    }

    if (mine.length === 0) {
      list.innerHTML = '<li><span class="dropdown-item small text-muted">' + getNotifLabel("notif-empty") + "</span></li>";
      return;
    }

    list.innerHTML = "";
    mine.slice(0, 10).forEach(function (n) {
      var li = document.createElement("li");
      var span = document.createElement("span");
      span.className = "dropdown-item small" + (n.read ? "" : " fw-semibold");
      span.innerHTML = formatNotifHtml(n) + '<small class="text-muted d-block mt-1">' + n.time + "</small>";
      li.appendChild(span);
      list.appendChild(li);
    });
  }

  function markNavNotificationsRead() {
    if (typeof fluxrMarkNotificationsRead === "function") {
      fluxrMarkNotificationsRead();
      return;
    }

    var myEmail = (localStorage.getItem("fluxr-user-email") || "").trim().toLowerCase();
    if (!myEmail) {
      return;
    }

    var raw = localStorage.getItem("fluxr-notifications");
    var all = [];
    var changed = false;
    var i;

    try {
      all = JSON.parse(raw || "[]");
    } catch (e) {
      return;
    }

    for (i = 0; i < all.length; i++) {
      if (all[i].toEmail === myEmail && !all[i].read) {
        all[i].read = true;
        changed = true;
      }
    }

    if (changed) {
      localStorage.setItem("fluxr-notifications", JSON.stringify(all));
      renderNavNotifications();
    }
  }

  window.renderNavNotifications = renderNavNotifications;

  document.addEventListener("DOMContentLoaded", function () {
    renderNavAuth();
    renderNavNotifications();

    var notifBtn = document.getElementById("notifBtn");
    if (notifBtn) {
      notifBtn.addEventListener("show.bs.dropdown", markNavNotificationsRead);
    }
  });
  document.addEventListener("fluxr-lang-change", function () {
    renderNavAuth();
    renderNavNotifications();
  });
  document.addEventListener("fluxr-auth-change", function () {
    renderNavAuth();
    renderNavNotifications();
  });
  document.addEventListener("fluxr-notif-change", renderNavNotifications);
})();
