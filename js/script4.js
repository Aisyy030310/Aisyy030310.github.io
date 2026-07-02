document.addEventListener("DOMContentLoaded", function () {
  var audioUnlocked = false;
  var MUSIC_SRC = "assets/audio/keys-of-moon-white-petals(chosic.com).mp3";

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

  function getBackgroundMusic() {
    var audio = document.getElementById("siteMusic");
    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "siteMusic";
      audio.src = MUSIC_SRC;
      audio.preload = "auto";
      audio.loop = true;
      document.body.appendChild(audio);
    }
    return audio;
  }

  function getMusicVolume() {
    var saved = parseInt(localStorage.getItem("fluxr-music-volume") || "40", 10);
    if (isNaN(saved)) {
      saved = 40;
    }
    return Math.min(100, Math.max(0, saved));
  }

  function isMusicPausedByUser() {
    return sessionStorage.getItem("fluxr-music-user-paused") === "1";
  }

  function setMusicPausedByUser(paused) {
    if (paused) {
      sessionStorage.setItem("fluxr-music-user-paused", "1");
    } else {
      sessionStorage.removeItem("fluxr-music-user-paused");
    }
  }

  function applyMusicVolume() {
    var music = getBackgroundMusic();
    music.volume = getMusicVolume() / 100;
    var slider = document.getElementById("footerMusicVolume");
    if (slider) {
      slider.value = String(getMusicVolume());
    }
  }

  function getMusicLabel(key) {
    if (window.fluxrI18n && window.fluxrI18n[key]) {
      return window.fluxrI18n[key];
    }
    if (key === "footer-music-pause") {
      return "Pause music";
    }
    return "Play music";
  }

  function updateMusicButton(playing) {
    var btn = document.getElementById("footerMusicBtn");
    var icon = document.getElementById("footerMusicIcon");
    if (!btn || !icon) {
      return;
    }
    icon.className = playing ? "fa fa-pause" : "fa fa-play";
    btn.setAttribute("aria-label", getMusicLabel(playing ? "footer-music-pause" : "footer-music-play"));
    btn.setAttribute("data-i18n-aria", playing ? "footer-music-pause" : "footer-music-play");
  }

  function playBackgroundMusic() {
    applyMusicVolume();
    return getBackgroundMusic().play().then(function () {
      updateMusicButton(true);
    });
  }

  function pauseBackgroundMusic() {
    getBackgroundMusic().pause();
    updateMusicButton(false);
  }

  function startBackgroundMusicIfAllowed() {
    if (!audioUnlocked || isMusicPausedByUser()) {
      return;
    }

    var music = getBackgroundMusic();
    if (!music.paused) {
      updateMusicButton(true);
      return;
    }

    playBackgroundMusic().catch(function () {});
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
      startBackgroundMusicIfAllowed();
      return;
    }

    var audio = getSiteAudio();
    var unlock = audio.play();

    if (!unlock) {
      audioUnlocked = true;
      maybePlayNotificationSound();
      startBackgroundMusicIfAllowed();
      return;
    }

    unlock.then(function () {
      audio.pause();
      audio.currentTime = 0;
      audioUnlocked = true;
      maybePlayNotificationSound();
      startBackgroundMusicIfAllowed();
    }).catch(function () {});
  }

  function initFooterMusicPlayer() {
    var btn = document.getElementById("footerMusicBtn");
    var slider = document.getElementById("footerMusicVolume");
    if (!btn || !slider) {
      return;
    }

    applyMusicVolume();
    updateMusicButton(false);

    btn.addEventListener("click", function () {
      var music = getBackgroundMusic();

      if (!audioUnlocked) {
        audioUnlocked = true;
      }

      if (music.paused) {
        setMusicPausedByUser(false);
        playBackgroundMusic().catch(function () {});
      } else {
        setMusicPausedByUser(true);
        pauseBackgroundMusic();
      }
    });

    slider.addEventListener("input", function () {
      var value = parseInt(slider.value, 10) || 0;
      localStorage.setItem("fluxr-music-volume", String(value));
      getBackgroundMusic().volume = value / 100;
    });
  }

  ["click", "keydown", "touchstart"].forEach(function (eventName) {
    document.addEventListener(eventName, unlockAudio, { passive: true });
  });

  document.addEventListener("fluxr-notif-change", maybePlayNotificationSound);
  document.addEventListener("fluxr-lang-change", function () {
    var music = getBackgroundMusic();
    updateMusicButton(!music.paused);
  });

  initFooterMusicPlayer();

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
