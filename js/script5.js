function updateChatLabels() {
  var toggle = document.getElementById("chatToggle");
  if (toggle) {
    toggle.innerHTML = '<i class="fa fa-comment"></i> ' + fluxrT("chat-btn");
  }

  var support = document.getElementById("chatSupportTitle");
  if (support) {
    support.textContent = fluxrT("chat-support");
  }

  var status = document.getElementById("chatStatusText");
  if (status) {
    status.textContent = fluxrT("chat-status");
  }

  var greeting = document.getElementById("chatGreetingText");
  if (greeting) {
    greeting.textContent = fluxrT("chat-greeting");
  }

  var greetingSender = document.getElementById("chatGreetingSender");
  if (greetingSender) {
    greetingSender.textContent = fluxrT("chat-support");
  }

  var input = document.getElementById("chatInput");
  if (input) {
    input.setAttribute("placeholder", fluxrT("chat-placeholder"));
  }

  var sendBtn = document.getElementById("chatSendBtn");
  if (sendBtn) {
    sendBtn.textContent = fluxrT("chat-send");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("chatToggle");
  var widget = document.getElementById("chatWidget");
  var form = document.getElementById("chatForm");
  var messages = document.getElementById("chatMessages");

  updateChatLabels();

  if (!toggle || !widget) {
    return;
  }

  function setChatOpen(open) {
    widget.classList.toggle("open", open);
    toggle.classList.toggle("open-hidden", open);
  }

  toggle.addEventListener("click", function () {
    setChatOpen(!widget.classList.contains("open"));
  });

  var closeBtn = document.getElementById("chatClose");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      setChatOpen(false);
    });
  }

  function addBubble(text, type, sender) {
    var div = document.createElement("div");
    div.className = "chat-bubble chat-bubble-" + type;
    if (sender) {
      div.innerHTML = '<span class="chat-sender">' + sender + "</span>" + text;
    } else {
      div.textContent = text;
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  if (form && messages) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("chatInput");
      var text = input.value.trim();
      if (!text) {
        return;
      }
      addBubble(text, "out", fluxrT("chat-you"));
      input.value = "";
      setTimeout(function () {
        addBubble(fluxrT("chat-reply"), "in", fluxrT("chat-support"));
      }, 900);
    });
  }
});

document.addEventListener("fluxr-lang-change", updateChatLabels);
