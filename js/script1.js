document.addEventListener("DOMContentLoaded", function () {
  var darkBtn = document.getElementById("darkModeBtn");
  if (darkBtn) {
    if (localStorage.getItem("fluxr-dark") === "1") {
      document.body.classList.add("dark-mode");
      darkBtn.innerHTML = '<i class="fa fa-sun-o"></i>';
    }
    darkBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      var on = document.body.classList.contains("dark-mode");
      localStorage.setItem("fluxr-dark", on ? "1" : "0");
      darkBtn.innerHTML = on ? '<i class="fa fa-sun-o"></i>' : '<i class="fa fa-moon-o"></i>';
    });
  }

  var scrollBtn = document.createElement("button");
  scrollBtn.type = "button";
  scrollBtn.className = "scroll-top-btn";
  scrollBtn.innerHTML = '<i class="fa fa-chevron-up"></i>';
  scrollBtn.setAttribute("aria-label", "Back to top");
  document.body.appendChild(scrollBtn);

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  });

  scrollBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
