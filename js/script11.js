var msgActiveFriend = "";

function showLoginMsg(boxId, text) {
  var box = document.getElementById(boxId);
  if (!box) {
    return;
  }
  box.innerHTML = text + ' <a href="login.html">' + fluxrT("nav-login") + "</a> | <a href=\"join.html\">" + fluxrT("nav-join") + "</a>";
  box.classList.remove("d-none");
}

function renderProfilePage() {
  if (!document.getElementById("profileName")) {
    return;
  }

  if (!fluxrIsLoggedIn()) {
    showLoginMsg("profileLoginMsg", fluxrT("profile-login-first"));
    document.getElementById("profileContent").classList.add("d-none");
    return;
  }

  var name = fluxrGetUser();
  var bio = fluxrGetBio();
  document.getElementById("profileName").textContent = name;
  document.getElementById("profileBioText").textContent = bio || fluxrT("profile-no-bio");
  document.getElementById("bioInput").value = bio;

  var friendList = document.getElementById("profileFriendList");
  var suggestList = document.getElementById("profileSuggestList");
  var friends = fluxrGetFriends();
  var suggested = fluxrGetSuggestedFriends();

  friendList.innerHTML = "";
  if (friends.length === 0) {
    friendList.innerHTML = '<li class="list-group-item text-muted small">' + fluxrT("profile-no-friends") + "</li>";
  } else {
    friends.forEach(function (f) {
      var li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = "<span>" + fluxrGetMemberName(f) + '</span><a href="messages.html?friend=' + encodeURIComponent(f) + '" class="btn btn-sm btn-outline-primary">' + fluxrT("profile-msg-btn") + "</a>";
      friendList.appendChild(li);
    });
  }

  if (suggestList) {
    var suggestTitle = document.getElementById("profileSuggestTitle");
    if (suggestTitle) {
      suggestTitle.textContent = fluxrT("profile-suggest-title") + " (" + suggested.length + "/" + Math.max(fluxrGetMemberCount() - 1, 0) + ")";
    }

    suggestList.innerHTML = "";
    if (suggested.length === 0) {
      var emptyMsg = fluxrT("profile-no-suggest");
      if (fluxrGetMemberCount() > 1) {
        emptyMsg = fluxrT("profile-all-friends");
      }
      suggestList.innerHTML = '<li class="list-group-item text-muted small">' + emptyMsg + "</li>";
      if (fluxrGetMemberCount() <= 1) {
        suggestList.innerHTML += '<li class="list-group-item text-muted small">' + fluxrT("profile-register-more") + "</li>";
      }
    } else {
      suggested.forEach(function (m) {
        var li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center gap-2";
        li.innerHTML = '<span><strong>' + m.name + '</strong><br><span class="text-muted small">' + m.email + '</span></span><button type="button" class="btn btn-sm btn-fluxr-primary add-friend-btn flex-shrink-0" data-friend-email="' + m.email + '">' + fluxrT("profile-add-friend") + "</button>";
        suggestList.appendChild(li);
      });
    }
  }

  var postList = document.getElementById("profilePostList");
  var posts = fluxrGetMyPosts();
  postList.innerHTML = "";
  if (posts.length === 0) {
    postList.innerHTML = '<li class="list-group-item text-muted small">' + fluxrT("profile-no-posts") + "</li>";
  } else {
    posts.forEach(function (p) {
      var li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = "<p class=\"mb-1 small\">" + p.text + "</p><small class=\"text-muted\">" + p.time + "</small>";
      postList.appendChild(li);
    });
  }
}

function renderMessagesPage() {
  if (!document.getElementById("msgFriendList")) {
    return;
  }

  if (!fluxrIsLoggedIn()) {
    showLoginMsg("msgLoginMsg", fluxrT("profile-login-first"));
    document.getElementById("msgContent").classList.add("d-none");
    return;
  }

  var friends = fluxrGetFriends();
  var list = document.getElementById("msgFriendList");
  list.innerHTML = "";

  if (friends.length === 0) {
    list.innerHTML = '<p class="text-muted small mb-0">' + fluxrT("profile-no-friends") + "</p>";
    return;
  }

  friends.forEach(function (f) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "list-group-item list-group-item-action msg-friend-btn";
    btn.setAttribute("data-friend", f);
    btn.textContent = fluxrGetMemberName(f);
    list.appendChild(btn);
  });

  var params = new URLSearchParams(window.location.search);
  var startFriend = params.get("friend");
  if (startFriend) {
    var normalizedStart = fluxrNormalizeEmail(startFriend);
    var match = friends.filter(function (f) {
      return f === normalizedStart || f === startFriend;
    })[0];
    if (match) {
      openMsgChat(match);
    } else {
      var byName = fluxrFindMemberByName(startFriend);
      if (byName && friends.indexOf(fluxrNormalizeEmail(byName.email)) !== -1) {
        openMsgChat(byName.email);
      }
    }
  }
}

function openMsgChat(friendEmail) {
  msgActiveFriend = fluxrNormalizeEmail(friendEmail);
  document.getElementById("msgChatTitle").textContent = fluxrT("msg-chat-with") + " " + fluxrGetMemberName(msgActiveFriend);
  document.getElementById("msgInput").disabled = false;
  document.getElementById("msgSendBtn").disabled = false;

  document.querySelectorAll(".msg-friend-btn").forEach(function (btn) {
    btn.classList.toggle("active", fluxrNormalizeEmail(btn.getAttribute("data-friend")) === msgActiveFriend);
  });

  var box = document.getElementById("msgChatBox");
  var msgs = fluxrGetMessages(msgActiveFriend);
  box.innerHTML = "";

  if (msgs.length === 0) {
    box.innerHTML = '<p class="text-muted small">' + fluxrT("msg-start") + "</p>";
    return;
  }

  msgs.forEach(function (m) {
    var div = document.createElement("div");
    var isMe = m.fromEmail ? m.fromEmail === fluxrGetUserEmail() : m.from === fluxrGetUser();
    div.className = "msg-bubble " + (isMe ? "msg-bubble-out" : "msg-bubble-in");
    div.innerHTML = "<strong class=\"small d-block\">" + m.from + "</strong>" + m.text + '<small class="d-block text-muted mt-1">' + m.time + "</small>";
    box.appendChild(div);
  });
  box.scrollTop = box.scrollHeight;
}

document.addEventListener("DOMContentLoaded", function () {
  renderProfilePage();
  renderMessagesPage();

  var bioForm = document.getElementById("bioForm");
  if (bioForm) {
    bioForm.addEventListener("submit", function (e) {
      e.preventDefault();
      fluxrSaveBio(document.getElementById("bioInput").value.trim());
      renderProfilePage();
    });
  }

  var addBtn = document.getElementById("profileContent");
  if (addBtn) {
    addBtn.addEventListener("click", function (e) {
      var btn = e.target.closest(".add-friend-btn");
      if (!btn) {
        return;
      }
      var friendEmail = btn.getAttribute("data-friend-email");
      if (friendEmail && fluxrIsRegisteredMember(friendEmail)) {
        fluxrAddFriend(friendEmail);
        renderProfilePage();
      }
    });
  }

  var friendList = document.getElementById("msgFriendList");
  if (friendList) {
    friendList.addEventListener("click", function (e) {
      var btn = e.target.closest(".msg-friend-btn");
      if (btn) {
        openMsgChat(btn.getAttribute("data-friend"));
      }
    });
  }

  var msgForm = document.getElementById("msgForm");
  if (msgForm) {
    msgForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!msgActiveFriend) {
        return;
      }
      var input = document.getElementById("msgInput");
      var text = input.value.trim();
      if (!text) {
        return;
      }
      fluxrSendMessage(msgActiveFriend, fluxrGetUser(), text);
      input.value = "";
      openMsgChat(msgActiveFriend);
    });
  }
});

document.addEventListener("fluxr-lang-change", function () {
  renderProfilePage();
  renderMessagesPage();
  if (msgActiveFriend) {
    openMsgChat(msgActiveFriend);
  }
});
document.addEventListener("fluxr-auth-change", function () {
  renderProfilePage();
  renderMessagesPage();
});
