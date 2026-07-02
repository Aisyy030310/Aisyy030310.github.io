document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("siteAudio")) {
    var el = document.createElement("audio");
    el.id = "siteAudio";
    el.src = "assets/audio/notification.mp3";
    el.preload = "auto";
    document.body.appendChild(el);
  }

  document.addEventListener("fluxr-notif-change", function () {
    var myEmail = (localStorage.getItem("fluxr-user-email") || "").trim().toLowerCase();
    if (!myEmail) {
      return;
    }
    var raw = localStorage.getItem("fluxr-notifications");
    var all = [];
    try {
      all = JSON.parse(raw || "[]");
    } catch (e) {
      return;
    }
    if (all.length > 0 && all[0].toEmail === myEmail && !all[0].read) {
      var audio = document.getElementById("siteAudio");
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(function () {});
      }
    }
  });

  var alertBox = document.getElementById("siteAlert");

  if (alertBox) {
    var closeBtn = alertBox.querySelector(".btn-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        sessionStorage.setItem("fluxr-alert-closed", "1");
      });
    }
    if (sessionStorage.getItem("fluxr-alert-closed") === "1") {
      alertBox.remove();
    }
  }
});
