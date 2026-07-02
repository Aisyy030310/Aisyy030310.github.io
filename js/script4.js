document.addEventListener("DOMContentLoaded", function () {
  var audioUnlocked = false;

  function getSiteAudio() {
    var audio = document.getElementById("siteAudio");
    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "siteAudio";
      audio.src = "assets/audio/notification.mp3";
      audio.preload = "auto";
      document.body.appendChild(audio);
    }
    return audio;
  }

  function getLastPlayedAt() {
    return parseInt(sessionStorage.getItem("fluxr-last-notif-sound-at") || "0", 10) || 0;
  }

  function setLastPlayedAt(at) {
    sessionStorage.setItem("fluxr-last-notif-sound-at", String(at));
  }

  function getNewestUnreadForMe() {
    var myEmail = (localStorage.getItem("fluxr-user-email") || "").trim().toLowerCase();
    if (!myEmail || localStorage.getItem("fluxr-logged-in") !== "1") {
      return null;
    }

    var all = [];
    try {
      all = JSON.parse(localStorage.getItem("fluxr-notifications") || "[]");
    } catch (e) {
      return null;
    }

    var newest = null;
    var i;

    for (i = 0; i < all.length; i++) {
      if (all[i].toEmail === myEmail && !all[i].read) {
        if (!newest || (all[i].at || 0) > (newest.at || 0)) {
          newest = all[i];
        }
      }
    }

    return newest;
  }

  function playNotificationSound() {
    var audio = getSiteAudio();
    audio.currentTime = 0;
    return audio.play();
  }

  function maybePlayNotificationSound() {
    if (!audioUnlocked) {
      return;
    }

    var newest = getNewestUnreadForMe();
    if (!newest || (newest.at || 0) <= getLastPlayedAt()) {
      return;
    }

    setLastPlayedAt(newest.at || Date.now());
    playNotificationSound().catch(function () {});
  }

  function unlockAudio() {
    if (audioUnlocked) {
      return;
    }

    var audio = getSiteAudio();
    var unlock = audio.play();

    if (!unlock) {
      audioUnlocked = true;
      maybePlayNotificationSound();
      return;
    }

    unlock.then(function () {
      audio.pause();
      audio.currentTime = 0;
      audioUnlocked = true;
      maybePlayNotificationSound();
    }).catch(function () {});
  }

  ["click", "keydown", "touchstart"].forEach(function (eventName) {
    document.addEventListener(eventName, unlockAudio, { passive: true });
  });

  document.addEventListener("fluxr-notif-change", maybePlayNotificationSound);

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
