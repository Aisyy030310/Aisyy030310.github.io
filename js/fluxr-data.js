function fluxrGetMembers() {
  var raw = localStorage.getItem("fluxr-members");
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function fluxrNormalizeName(name) {
  return (name || "").trim().replace(/\s+/g, " ");
}

function fluxrNormalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

function fluxrFindMemberByEmail(email) {
  var members = fluxrGetMembers();
  var target = fluxrNormalizeEmail(email);
  var i;
  for (i = 0; i < members.length; i++) {
    if (fluxrNormalizeEmail(members[i].email) === target) {
      return members[i];
    }
  }
  return null;
}

function fluxrFindMemberByName(name) {
  var members = fluxrGetMembers();
  var target = fluxrNormalizeName(name);
  var i;
  for (i = 0; i < members.length; i++) {
    if (fluxrNormalizeName(members[i].name) === target) {
      return members[i];
    }
  }
  return null;
}

function fluxrGetMemberName(email) {
  var member = fluxrFindMemberByEmail(email);
  return member ? member.name : email;
}

function fluxrRegisterMember(name, email, password) {
  var members = fluxrGetMembers();
  var cleanName = fluxrNormalizeName(name);
  var cleanEmail = fluxrNormalizeEmail(email);
  var i;

  if (!cleanName || !cleanEmail) {
    return false;
  }

  for (i = 0; i < members.length; i++) {
    if (fluxrNormalizeEmail(members[i].email) === cleanEmail) {
      return false;
    }
  }

  members.push({
    name: cleanName,
    email: cleanEmail,
    password: password
  });
  localStorage.setItem("fluxr-members", JSON.stringify(members));
  return true;
}

function fluxrLoginMember(email, password) {
  var members = fluxrGetMembers();
  var target = fluxrNormalizeEmail(email);
  var i;
  for (i = 0; i < members.length; i++) {
    if (fluxrNormalizeEmail(members[i].email) === target && members[i].password === password) {
      return members[i];
    }
  }
  return null;
}

function fluxrGetUser() {
  return fluxrNormalizeName(localStorage.getItem("fluxr-user") || "");
}

function fluxrGetUserEmail() {
  return fluxrNormalizeEmail(localStorage.getItem("fluxr-user-email") || "");
}

function fluxrIsLoggedIn() {
  return localStorage.getItem("fluxr-logged-in") === "1" && fluxrGetUser() !== "";
}

function fluxrGetBio() {
  return localStorage.getItem("fluxr-bio") || "";
}

function fluxrSaveBio(text) {
  localStorage.setItem("fluxr-bio", text);
}

function fluxrGetFriendsData() {
  var raw = localStorage.getItem("fluxr-friends-data");
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function fluxrResolveUserStorageKey(key) {
  if (!key) {
    return "";
  }
  if (key.indexOf("@") !== -1) {
    return fluxrNormalizeEmail(key);
  }
  var member = fluxrFindMemberByName(key);
  if (member) {
    return fluxrNormalizeEmail(member.email);
  }
  return fluxrNormalizeName(key);
}

function fluxrGetFriendsStorageKey() {
  return fluxrGetUserEmail() || fluxrGetUser();
}

function fluxrGetFriends() {
  var key = fluxrGetFriendsStorageKey();
  if (!key) {
    return [];
  }
  var data = fluxrGetFriendsData();
  var list = data[key] || [];
  if (list.length === 0 && fluxrGetUser() && fluxrGetUser() !== key) {
    list = data[fluxrGetUser()] || [];
  }
  var out = [];
  var i;

  for (i = 0; i < list.length; i++) {
    if (list[i].indexOf("@") !== -1) {
      out.push(fluxrNormalizeEmail(list[i]));
    } else {
      var member = fluxrFindMemberByName(list[i]);
      if (member) {
        out.push(fluxrNormalizeEmail(member.email));
      }
    }
  }
  return out;
}

function fluxrAddFriendToAccount(accountEmail, friendEmail) {
  var data = fluxrGetFriendsData();
  var ownerKey = fluxrResolveUserStorageKey(accountEmail);
  var friendKey = fluxrNormalizeEmail(friendEmail);
  if (!ownerKey || !friendKey || ownerKey === friendKey) {
    return;
  }
  if (!data[ownerKey]) {
    data[ownerKey] = [];
  }
  if (data[ownerKey].indexOf(friendKey) === -1) {
    data[ownerKey].push(friendKey);
  }
  localStorage.setItem("fluxr-friends-data", JSON.stringify(data));
}

function fluxrSaveFriends(list) {
  var key = fluxrGetFriendsStorageKey();
  if (!key) {
    return;
  }
  var data = fluxrGetFriendsData();
  data[key] = list;
  localStorage.setItem("fluxr-friends-data", JSON.stringify(data));
  localStorage.setItem("fluxr-friends", list.length);
}

function fluxrAddFriend(email) {
  var friends = fluxrGetFriends();
  var cleanEmail = fluxrNormalizeEmail(email);
  var myEmail = fluxrGetUserEmail();
  if (!cleanEmail || !myEmail || !fluxrFindMemberByEmail(cleanEmail)) {
    return friends;
  }
  if (friends.indexOf(cleanEmail) === -1) {
    friends.push(cleanEmail);
    fluxrAddFriendToAccount(myEmail, cleanEmail);
    fluxrAddFriendToAccount(cleanEmail, myEmail);
    fluxrAddNotification(cleanEmail, {
      type: "friend",
      fromName: fluxrGetUser(),
      fromEmail: myEmail
    });
  }
  return fluxrGetFriends();
}

function fluxrIsRegisteredMember(email) {
  return fluxrFindMemberByEmail(email) !== null;
}

function fluxrGetSuggestedFriends() {
  var myEmail = fluxrGetUserEmail();
  var friends = fluxrGetFriends();
  var members = fluxrGetMembers();
  var list = [];
  var i;

  for (i = 0; i < members.length; i++) {
    var memberEmail = fluxrNormalizeEmail(members[i].email);
    if (memberEmail !== myEmail && friends.indexOf(memberEmail) === -1) {
      list.push({
        name: fluxrNormalizeName(members[i].name),
        email: memberEmail
      });
    }
  }
  return list;
}

function fluxrGetMemberCount() {
  return fluxrGetMembers().length;
}

function fluxrGetPostsData() {
  var raw = localStorage.getItem("fluxr-posts-data");
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function fluxrGetMyPosts() {
  var user = fluxrGetUser();
  if (!user) {
    return [];
  }
  var data = fluxrGetPostsData();
  return data[user] || [];
}

function fluxrAddPost(text) {
  var user = fluxrGetUser();
  if (!user) {
    return [];
  }
  var data = fluxrGetPostsData();
  if (!data[user]) {
    data[user] = [];
  }
  data[user].unshift({
    text: text,
    time: new Date().toLocaleString(),
    at: Date.now()
  });
  localStorage.setItem("fluxr-posts-data", JSON.stringify(data));
  localStorage.setItem("fluxr-posts", data[user].length);

  fluxrGetFriends().forEach(function (friendEmail) {
    fluxrAddNotification(friendEmail, {
      type: "post",
      fromName: user,
      fromEmail: fluxrGetUserEmail(),
      text: text
    });
  });

  return data[user];
}

function fluxrGetFeedPosts() {
  var data = fluxrGetPostsData();
  var members = fluxrGetMembers();
  var memberNames = {};
  var feed = [];
  var user;
  var i;

  for (i = 0; i < members.length; i++) {
    memberNames[fluxrNormalizeName(members[i].name)] = true;
  }

  for (user in data) {
    if (!Object.prototype.hasOwnProperty.call(data, user)) {
      continue;
    }
    var cleanUser = fluxrNormalizeName(user);
    if (!memberNames[cleanUser]) {
      continue;
    }
    var posts = data[user];
    for (i = 0; i < posts.length; i++) {
      feed.push({
        user: cleanUser,
        text: posts[i].text,
        time: posts[i].time,
        at: posts[i].at || 0
      });
    }
  }

  feed.sort(function (a, b) {
    return b.at - a.at;
  });

  return feed;
}

function fluxrGetAllMessages() {
  var raw = localStorage.getItem("fluxr-messages");
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function fluxrGetThreadKey(emailA, emailB) {
  var a = fluxrNormalizeEmail(emailA);
  var b = fluxrNormalizeEmail(emailB);
  if (!a || !b) {
    return "";
  }
  return a < b ? a + "|" + b : b + "|" + a;
}

function fluxrGetMessages(friendEmail) {
  var all = fluxrGetAllMessages();
  var myEmail = fluxrGetUserEmail();
  var friend = fluxrNormalizeEmail(friendEmail);
  var threadKey = fluxrGetThreadKey(myEmail, friend);

  if (threadKey && all[threadKey]) {
    return fluxrSortMessages(all[threadKey]);
  }

  if (all[friend]) {
    return fluxrSortMessages(all[friend]);
  }

  return [];
}

function fluxrSortMessages(msgs) {
  return msgs.slice().sort(function (a, b) {
    return (a.at || 0) - (b.at || 0);
  });
}

function fluxrSendMessage(friendEmail, fromName, text) {
  var all = fluxrGetAllMessages();
  var myEmail = fluxrGetUserEmail();
  var friend = fluxrNormalizeEmail(friendEmail);
  var key = fluxrGetThreadKey(myEmail, friend);

  if (!key) {
    return [];
  }

  if (!all[key]) {
    all[key] = [];
  }

  all[key].push({
    from: fromName,
    fromEmail: myEmail,
    text: text,
    time: new Date().toLocaleString(),
    at: Date.now()
  });
  localStorage.setItem("fluxr-messages", JSON.stringify(all));

  if (friend !== myEmail) {
    fluxrAddFriendToAccount(myEmail, friend);
    fluxrAddFriendToAccount(friend, myEmail);

    fluxrAddNotification(friend, {
      type: "message",
      fromName: fromName,
      fromEmail: myEmail,
      text: text
    });
  }

  return all[key];
}

function fluxrGetAllNotifications() {
  var raw = localStorage.getItem("fluxr-notifications");
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function fluxrGetMyNotifications() {
  if (!fluxrIsLoggedIn()) {
    return [];
  }
  var myEmail = fluxrGetUserEmail();
  var all = fluxrGetAllNotifications();
  var list = [];
  var i;

  for (i = 0; i < all.length; i++) {
    if (all[i].toEmail === myEmail) {
      list.push(all[i]);
    }
  }

  list.sort(function (a, b) {
    return (b.at || 0) - (a.at || 0);
  });

  return list;
}

function fluxrAddNotification(toEmail, item) {
  var cleanEmail = fluxrNormalizeEmail(toEmail);
  var myEmail = fluxrGetUserEmail();
  if (!cleanEmail || (myEmail && cleanEmail === myEmail)) {
    return;
  }

  var all = fluxrGetAllNotifications();
  all.unshift({
    toEmail: cleanEmail,
    fromName: item.fromName || "",
    fromEmail: fluxrNormalizeEmail(item.fromEmail || ""),
    type: item.type || "info",
    text: item.text || "",
    time: new Date().toLocaleString(),
    at: Date.now(),
    read: false
  });

  if (all.length > 50) {
    all = all.slice(0, 50);
  }

  localStorage.setItem("fluxr-notifications", JSON.stringify(all));
  document.dispatchEvent(new CustomEvent("fluxr-notif-change"));
}

function fluxrMarkNotificationsRead() {
  if (!fluxrIsLoggedIn()) {
    return;
  }
  var myEmail = fluxrGetUserEmail();
  var all = fluxrGetAllNotifications();
  var changed = false;
  var i;

  for (i = 0; i < all.length; i++) {
    if (all[i].toEmail === myEmail && !all[i].read) {
      all[i].read = true;
      changed = true;
    }
  }

  if (changed) {
    localStorage.setItem("fluxr-notifications", JSON.stringify(all));
    document.dispatchEvent(new CustomEvent("fluxr-notif-change"));
  }
}

function fluxrLogout() {
  localStorage.removeItem("fluxr-logged-in");
  localStorage.removeItem("fluxr-user");
  localStorage.removeItem("fluxr-user-email");
  localStorage.removeItem("fluxr-bio");
  if (typeof renderNavAuth === "function") {
    renderNavAuth();
  }
  document.dispatchEvent(new CustomEvent("fluxr-auth-change"));
}

function fluxrSetupNewUser(name, email) {
  var cleanName = fluxrNormalizeName(name);
  localStorage.setItem("fluxr-user", cleanName);
  localStorage.setItem("fluxr-user-email", fluxrNormalizeEmail(email));
  localStorage.setItem("fluxr-logged-in", "1");
  if (fluxrGetMyPosts().length === 0) {
    var data = fluxrGetPostsData();
    if (!data[cleanName]) {
      data[cleanName] = [];
      localStorage.setItem("fluxr-posts-data", JSON.stringify(data));
      localStorage.setItem("fluxr-posts", "0");
    }
  }
  if (typeof renderNavAuth === "function") {
    renderNavAuth();
  }
  document.dispatchEvent(new CustomEvent("fluxr-auth-change"));
}

function fluxrMigrateFriendsData() {
  var data = fluxrGetFriendsData();
  var merged = {};
  var changed = false;
  var userKey;
  var i;

  for (userKey in data) {
    if (!Object.prototype.hasOwnProperty.call(data, userKey)) {
      continue;
    }
    var ownerKey = fluxrResolveUserStorageKey(userKey);
    if (ownerKey !== userKey) {
      changed = true;
    }
    if (!merged[ownerKey]) {
      merged[ownerKey] = [];
    }
    var list = data[userKey];
    for (i = 0; i < list.length; i++) {
      var item = list[i];
      var friendEmail = item.indexOf("@") !== -1 ? fluxrNormalizeEmail(item) : "";
      if (!friendEmail) {
        var member = fluxrFindMemberByName(item);
        if (member) {
          friendEmail = fluxrNormalizeEmail(member.email);
          changed = true;
        }
      }
      if (friendEmail && merged[ownerKey].indexOf(friendEmail) === -1) {
        merged[ownerKey].push(friendEmail);
      }
    }
  }

  for (userKey in merged) {
    if (!Object.prototype.hasOwnProperty.call(merged, userKey)) {
      continue;
    }
    var friends = merged[userKey];
    for (i = 0; i < friends.length; i++) {
      var friendEmail = friends[i];
      if (!merged[friendEmail]) {
        merged[friendEmail] = [];
      }
      if (merged[friendEmail].indexOf(userKey) === -1) {
        merged[friendEmail].push(userKey);
        changed = true;
      }
    }
  }

  if (changed) {
    localStorage.setItem("fluxr-friends-data", JSON.stringify(merged));
  }
}

function fluxrMigrateMessages() {
  var all = fluxrGetAllMessages();
  var merged = {};
  var changed = false;
  var key;
  var i;

  for (key in all) {
    if (!Object.prototype.hasOwnProperty.call(all, key)) {
      continue;
    }
    if (key.indexOf("|") !== -1) {
      merged[key] = all[key];
      continue;
    }

    var msgs = all[key];
    var sideEmail = fluxrNormalizeEmail(key);
    for (i = 0; i < msgs.length; i++) {
      var senderEmail = msgs[i].fromEmail || "";
      if (!senderEmail && msgs[i].from) {
        var sender = fluxrFindMemberByName(msgs[i].from);
        if (sender) {
          senderEmail = fluxrNormalizeEmail(sender.email);
        }
      }
      if (!senderEmail) {
        senderEmail = sideEmail;
      }
      var threadKey = fluxrGetThreadKey(senderEmail, sideEmail);
      if (!merged[threadKey]) {
        merged[threadKey] = [];
      }
      merged[threadKey].push(msgs[i]);
      changed = true;
    }
  }

  if (changed) {
    localStorage.setItem("fluxr-messages", JSON.stringify(merged));
  }
}

function fluxrEnsureCurrentUserInRegistry() {
  if (!fluxrIsLoggedIn()) {
    return;
  }

  var email = fluxrGetUserEmail();
  var name = fluxrGetUser();
  if (email && fluxrFindMemberByEmail(email)) {
    return;
  }

  if (name) {
    var found = fluxrFindMemberByName(name);
    if (found) {
      localStorage.setItem("fluxr-user-email", fluxrNormalizeEmail(found.email));
      return;
    }
    fluxrRegisterMember(name, name.toLowerCase().replace(/\s+/g, "") + "@fluxr.local", "fluxr123");
  }
}

function fluxrInitData() {
  var members = fluxrGetMembers();
  var changed = false;
  var i;

  for (i = 0; i < members.length; i++) {
    var cleanName = fluxrNormalizeName(members[i].name);
    var cleanEmail = fluxrNormalizeEmail(members[i].email);
    if (cleanName !== members[i].name || cleanEmail !== members[i].email) {
      members[i].name = cleanName;
      members[i].email = cleanEmail;
      changed = true;
    }
  }

  if (changed) {
    localStorage.setItem("fluxr-members", JSON.stringify(members));
  }

  fluxrMigrateFriendsData();
  fluxrMigrateMessages();
  fluxrEnsureCurrentUserInRegistry();
  document.dispatchEvent(new CustomEvent("fluxr-auth-change"));
}

document.addEventListener("DOMContentLoaded", fluxrInitData);
