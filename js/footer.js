(function () {
  var year = new Date().getFullYear();
  var html =
    '<footer class="footer-bar py-4 mt-auto">' +
    '<div class="container">' +
    '<div class="row g-3 align-items-center">' +
    '<div class="col-lg-4">' +
    '<p class="footer-brand mb-1">Fluxr</p>' +
    "<p class=\"small mb-1\">&copy; " + year + " Fluxr Sdn Bhd</p>" +
    '<p class="small mb-0">Kuala Lumpur, Malaysia</p>' +
    "</div>" +
    '<div class="col-lg-8 text-lg-end">' +
    '<p class="small mb-2 footer-links">' +
    '<a href="privacy.html" data-i18n="footer-privacy">Privacy</a>' +
    '<a href="contact.html" data-i18n="footer-contact">Contact</a>' +
    '<a href="team.html" data-i18n="footer-team">Team</a>' +
    '<a href="sitemap.html" data-i18n="footer-sitemap">Sitemap</a>' +
    "</p>" +
    '<p class="small mb-0 footer-links footer-external">' +
    '<a href="https://www.facebook.com/share/1LiL6SQaoc/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" data-i18n="footer-facebook">Facebook</a>' +
    '<a href="https://www.instagram.com/fluxrsdnbhd?utm_source=qr" target="_blank" rel="noopener noreferrer" data-i18n="footer-instagram">Instagram</a>' +
    '<a href="https://www.pdp.gov.my/ppdpv1/en/main-page/" target="_blank" rel="noopener noreferrer" data-i18n="footer-pdpa">PDPA Malaysia</a>' +
    "</p></div></div></div></footer>";

  var root = document.getElementById("footer-root");
  if (root) {
    root.innerHTML = html;
  }
})();
