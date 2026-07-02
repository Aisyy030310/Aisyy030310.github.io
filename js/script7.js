function renderProfile() {
  var box = document.getElementById("profileBox");
  if (!box) {
    return;
  }

  var name = fluxrGetUser() || fluxrT("profile-guest");
  var friends = fluxrIsLoggedIn() ? fluxrGetFriends() : [];
  var posts = fluxrIsLoggedIn() ? fluxrGetMyPosts() : [];
  var suggested = fluxrIsLoggedIn() ? fluxrGetSuggestedFriends() : [];
  var friendHtml = "";
  var suggestHtml = "";
  var postHtml = "";
  var i;

  if (!fluxrIsLoggedIn()) {
    box.innerHTML =
      '<img src="assets/images/profile-default.jpg" alt="Profile" class="rounded-circle mb-3" width="80" height="80">' +
      '<h5 class="card-title">' + name + "</h5>" +
      '<p class="text-muted small mb-3">' + fluxrT("profile-login-first") + "</p>" +
      '<a href="login.html" class="btn btn-sm btn-fluxr-primary me-1">' + fluxrT("nav-login") + "</a>" +
      '<a href="join.html" class="btn btn-sm btn-outline-primary">' + fluxrT("nav-join") + "</a>";
    return;
  }

  if (friends.length === 0) {
    friendHtml = '<li class="list-group-item small text-muted">' + fluxrT("profile-no-friends") + "</li>";
  } else {
    for (i = 0; i < friends.length; i++) {
      friendHtml += '<li class="list-group-item small py-1">' + fluxrGetMemberName(friends[i]) + "</li>";
    }
  }

  if (suggested.length === 0) {
    var emptyMsg = fluxrT("profile-no-suggest");
    if (fluxrGetMemberCount() > 1) {
      emptyMsg = fluxrT("profile-all-friends");
    }
    suggestHtml = '<li class="list-group-item small text-muted">' + emptyMsg + "</li>";
    if (fluxrGetMemberCount() <= 1) {
      suggestHtml += '<li class="list-group-item small text-muted">' + fluxrT("profile-register-more") + "</li>";
    }
  } else {
    for (i = 0; i < suggested.length; i++) {
      suggestHtml +=
        '<li class="list-group-item small py-1 d-flex justify-content-between align-items-center gap-2">' +
        '<span class="text-start"><strong>' + suggested[i].name + '</strong><br><span class="text-muted">' + suggested[i].email + '</span></span>' +
        '<button type="button" class="btn btn-sm btn-outline-primary add-friend-btn flex-shrink-0" data-friend-email="' + suggested[i].email + '">' + fluxrT("profile-add-friend") + "</button></li>";
    }
  }

  if (posts.length === 0) {
    postHtml = '<li class="list-group-item small text-muted">' + fluxrT("profile-no-posts") + "</li>";
  } else {
    for (i = 0; i < posts.length && i < 3; i++) {
      postHtml += '<li class="list-group-item small py-1">' + posts[i].text + "</li>";
    }
  }

  box.innerHTML =
    '<img src="assets/images/profile-default.jpg" alt="Profile" class="rounded-circle mb-3 profile-pulse" width="80" height="80">' +
    '<h5 class="card-title">' + name + "</h5>" +
    '<p class="text-muted small">' + fluxrT("profile-member") + "</p>" +
    '<p class="mb-2 small">' + fluxrT("profile-friends") + ": " + friends.length + " &nbsp;|&nbsp; " + fluxrT("profile-posts") + ": " + posts.length + "</p>" +
    '<h6 class="small fw-bold text-start mb-1">' + fluxrT("profile-friends-title") + "</h6>" +
    '<ul class="list-group list-group-flush mb-2 text-start">' + friendHtml + "</ul>" +
    '<h6 class="small fw-bold text-start mb-1">' + fluxrT("profile-suggest-title") + " (" + suggested.length + "/" + (fluxrGetMemberCount() - 1) + ")</h6>" +
    '<ul class="list-group list-group-flush mb-2 text-start">' + suggestHtml + "</ul>" +
    '<h6 class="small fw-bold text-start mb-1">' + fluxrT("profile-posts-title") + "</h6>" +
    '<ul class="list-group list-group-flush mb-3 text-start">' + postHtml + "</ul>" +
    '<div class="d-grid gap-2">' +
    '<a href="profile.html" class="btn btn-sm btn-fluxr-primary">' + fluxrT("profile-view-btn") + "</a>" +
    '<a href="messages.html" class="btn btn-sm btn-outline-primary">' + fluxrT("profile-go-messages") + "</a>" +
    "</div>";
}

document.addEventListener("DOMContentLoaded", function () {
  renderProfile();
  var box = document.getElementById("profileBox");
  if (box) {
    box.addEventListener("click", function (e) {
      var btn = e.target.closest(".add-friend-btn");
      if (!btn) {
        return;
      }
      if (!fluxrIsLoggedIn()) {
        alert(fluxrT("profile-login-first"));
        return;
      }
      var friendEmail = btn.getAttribute("data-friend-email");
      if (friendEmail && fluxrIsRegisteredMember(friendEmail)) {
        fluxrAddFriend(friendEmail);
        renderProfile();
      }
    });
  }
});

document.addEventListener("fluxr-lang-change", renderProfile);
document.addEventListener("fluxr-auth-change", renderProfile);
