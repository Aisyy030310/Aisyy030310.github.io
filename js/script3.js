var sitePages = {
  en: [
    { title: "Home", url: "index.html" },
    { title: "About", url: "about.html" },
    { title: "Features", url: "features.html" },
    { title: "Gallery", url: "gallery.html" },
    { title: "Blog", url: "blog.html" },
    { title: "Contact", url: "contact.html" },
    { title: "Profile", url: "profile.html" },
    { title: "Messages", url: "messages.html" },
    { title: "Services", url: "services.html" },
    { title: "Products", url: "products.html" },
    { title: "Pricing", url: "pricing.html" },
    { title: "Team", url: "team.html" },
    { title: "Careers", url: "careers.html" },
    { title: "Privacy", url: "privacy.html" },
    { title: "Sitemap", url: "sitemap.html" },
    { title: "Join", url: "join.html" },
    { title: "Login", url: "login.html" }
  ],
  bm: [
    { title: "Laman Utama", url: "index.html" },
    { title: "Tentang", url: "about.html" },
    { title: "Ciri-ciri", url: "features.html" },
    { title: "Galeri", url: "gallery.html" },
    { title: "Blog", url: "blog.html" },
    { title: "Hubungi", url: "contact.html" },
    { title: "Profil", url: "profile.html" },
    { title: "Mesej", url: "messages.html" },
    { title: "Perkhidmatan", url: "services.html" },
    { title: "Produk", url: "products.html" },
    { title: "Harga", url: "pricing.html" },
    { title: "Pasukan", url: "team.html" },
    { title: "Kerjaya", url: "careers.html" },
    { title: "Privasi", url: "privacy.html" },
    { title: "Peta Laman", url: "sitemap.html" },
    { title: "Daftar", url: "join.html" },
    { title: "Log Masuk", url: "login.html" }
  ]
};

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("navSearchForm");
  var input = document.getElementById("navSearchInput");
  if (!form || !input) {
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim().toLowerCase();
    if (!q) {
      return;
    }
    var pages = sitePages[getFluxrLang()] || sitePages.en;
    var match = pages.find(function (p) {
      return p.title.toLowerCase().indexOf(q) !== -1 || p.url.toLowerCase().indexOf(q) !== -1;
    });
    if (match) {
      window.location.href = match.url;
    } else {
      alert(fluxrT("search-none") + " " + input.value);
    }
  });
});
