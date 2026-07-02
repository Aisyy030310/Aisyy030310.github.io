function renderFeed() {
  var list = document.getElementById("feedList");
  if (!list) {
    return;
  }

  list.innerHTML = "";
  var posts = fluxrGetFeedPosts();
  var me = fluxrGetUser();
  var i;

  if (posts.length === 0) {
    list.innerHTML = '<div class="list-group-item text-muted small">' + fluxrT("feed-empty") + "</div>";
    return;
  }

  posts.forEach(function (p, i) {
    var div = document.createElement("div");
    var isMe = fluxrIsLoggedIn() && p.user === me;
    var badge = isMe ? ' <span class="badge bg-primary">' + fluxrT("feed-you-badge") + "</span>" : "";

    div.className = "list-group-item feed-item";
    div.style.animationDelay = i * 0.1 + "s";
    div.innerHTML =
      '<div class="d-flex w-100 justify-content-between">' +
      "<h6 class=\"mb-1\">" + p.user + badge + "</h6>" +
      '<small class="text-muted">' + p.time + "</small></div>" +
      '<p class="mb-0">' + p.text + "</p>";
    list.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderFeed();

  var postForm = document.getElementById("postForm");
  if (postForm) {
    postForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!fluxrIsLoggedIn()) {
        alert(fluxrT("profile-login-first"));
        return;
      }
      var input = document.getElementById("postInput");
      var text = input.value.trim();
      if (text.length < 2) {
        return;
      }
      fluxrAddPost(text);
      input.value = "";
      renderFeed();
      if (typeof renderProfile === "function") {
        renderProfile();
      }
    });
  }
});

document.addEventListener("fluxr-lang-change", renderFeed);
document.addEventListener("fluxr-auth-change", renderFeed);
