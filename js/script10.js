function showFormMessage(form, message, isError) {
  var existing = form.querySelector(".form-msg");
  if (existing) {
    existing.remove();
  }
  var p = document.createElement("p");
  p.className = "form-msg " + (isError ? "form-error" : "form-success");
  p.textContent = message;
  form.insertBefore(p, form.firstChild);
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function handleContactForm(e) {
  e.preventDefault();
  var form = e.target;
  var name = form.querySelector("#contactName").value.trim();
  var email = form.querySelector("#contactEmail").value.trim();
  var subject = form.querySelector("#contactSubject").value.trim();
  var message = form.querySelector("#contactMessage").value.trim();

  if (name.length < 2) {
    showFormMessage(form, fluxrT("msg-name-short"), true);
    return;
  }
  if (!validateEmail(email)) {
    showFormMessage(form, fluxrT("msg-email-invalid"), true);
    return;
  }
  if (subject.length < 3) {
    showFormMessage(form, fluxrT("msg-subject-short"), true);
    return;
  }
  if (message.length < 10) {
    showFormMessage(form, fluxrT("msg-message-short"), true);
    return;
  }
  showFormMessage(form, fluxrT("msg-sent"), false);
  form.reset();
}

function handleLoginForm(e) {
  e.preventDefault();
  var form = e.target;
  var email = form.querySelector("#loginEmail").value.trim();
  var password = form.querySelector("#loginPassword").value;

  if (!validateEmail(email)) {
    showFormMessage(form, fluxrT("msg-login-email"), true);
    return;
  }
  if (password.length < 6) {
    showFormMessage(form, fluxrT("msg-password-short"), true);
    return;
  }
  var member = fluxrLoginMember(email, password);
  if (!member) {
    showFormMessage(form, fluxrT("msg-login-fail"), true);
    return;
  }
  fluxrSetupNewUser(member.name, member.email);
  window.location.href = "index.html";
}

function handleJoinForm(e) {
  e.preventDefault();
  var form = e.target;
  var fullName = form.querySelector("#fullName").value.trim();
  var email = form.querySelector("#email").value.trim();
  var password = form.querySelector("#password").value;
  var confirm = form.querySelector("#confirmPassword").value;

  if (fullName.length < 2) {
    showFormMessage(form, fluxrT("msg-name-short"), true);
    return;
  }
  if (!validateEmail(email)) {
    showFormMessage(form, fluxrT("msg-login-email"), true);
    return;
  }
  if (password.length < 6) {
    showFormMessage(form, fluxrT("msg-password-short"), true);
    return;
  }
  if (password !== confirm) {
    showFormMessage(form, fluxrT("msg-password-match"), true);
    return;
  }
  if (!fluxrRegisterMember(fullName, email, password)) {
    showFormMessage(form, fluxrT("msg-email-exists"), true);
    return;
  }
  fluxrSetupNewUser(fullName, email);
  window.location.href = "index.html";
}

function blockAuthPagesIfLoggedIn() {
  if (typeof fluxrIsLoggedIn !== "function" || !fluxrIsLoggedIn()) {
    return false;
  }
  var page = location.pathname.split("/").pop() || "index.html";
  if (page === "login.html" || page === "join.html") {
    window.location.replace("index.html");
    return true;
  }
  return false;
}

document.addEventListener("DOMContentLoaded", function () {
  if (blockAuthPagesIfLoggedIn()) {
    return;
  }

  var contact = document.getElementById("contactForm");
  if (contact) {
    contact.addEventListener("submit", handleContactForm);
  }

  var login = document.getElementById("loginForm");
  if (login) {
    login.addEventListener("submit", handleLoginForm);
  }

  var join = document.getElementById("joinForm");
  if (join) {
    join.addEventListener("submit", handleJoinForm);
  }
});

