function getGalleryCaption(el) {
  var card = el.closest(".gallery-card");
  if (!card) {
    return "";
  }
  var caption = card.querySelector(".gallery-caption");
  return caption ? caption.textContent.trim() : "";
}

function openGallery(src, title) {
  var img = document.getElementById("galleryModalImg");
  var cap = document.getElementById("galleryModalCaption");
  var modalEl = document.getElementById("galleryModal");
  var modalBody = modalEl ? modalEl.querySelector(".gallery-modal-body") : null;
  if (img) {
    img.src = src;
    img.alt = title || "Gallery image";
  }
  if (cap) {
    cap.textContent = title || "";
  }
  if (modalBody) {
    modalBody.scrollTop = 0;
  }
  if (modalEl && window.bootstrap) {
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-gallery]").forEach(function (el) {
    el.addEventListener("click", function () {
      openGallery(el.getAttribute("data-gallery"), getGalleryCaption(el));
    });
  });
});
