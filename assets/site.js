/* ra-th.de — Skript
   Vier Aufgaben: Menü auf kleinen Bildschirmen, aktuelle Seite im Menü markieren,
   Videos erst nach Klick laden (Zwei-Klick-Lösung), Kontaktformular per E-Mail. */
(function () {
  "use strict";

  /* Menü */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* Aktuelle Seite markieren. Pfade werden normalisiert, damit
     /arbeitsrecht, /arbeitsrecht.html und /blog/ vs. /blog/index.html gleich gelten. */
  var norm = function (p) {
    return p.replace(/index\.html$/, "").replace(/\.html$/, "").replace(/\/+$/, "") || "/";
  };
  var here = norm(location.pathname);
  document.querySelectorAll(".nav a").forEach(function (a) {
    var target = norm(new URL(a.getAttribute("href"), location.href).pathname);
    if (target === here) { a.setAttribute("aria-current", "page"); }
  });

  /* Videos: Zwei-Klick. Vor dem Klick wird nichts von YouTube geladen. */
  document.querySelectorAll(".video-ph").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-id");
      var box = btn.parentElement;
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      f.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
      f.setAttribute("allowfullscreen", "");
      f.setAttribute("title", btn.getAttribute("data-title") || "Video");
      box.replaceChild(f, btn);
    });
  });

  /* Videofilter */
  var filters = document.querySelectorAll(".filters button");
  filters.forEach(function (b) {
    b.addEventListener("click", function () {
      filters.forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
      var cat = b.getAttribute("data-cat");
      document.querySelectorAll(".vcard").forEach(function (c) {
        c.classList.toggle("is-hidden", cat !== "alle" && c.getAttribute("data-cat") !== cat);
      });
    });
  });

  /* Kontaktformular: öffnet das E-Mail-Programm des Besuchers mit fertiger Nachricht.
     Kein Server beteiligt. Für den Live-Betrieb durch einen Formulardienst ersetzbar. */
  var form = document.querySelector(".form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (n) { var el = form.querySelector("[name=" + n + "]"); return el ? el.value.trim() : ""; };
      var betreff = "Anfrage über ra-th.de" + (v("thema") ? " – " + v("thema") : "");
      var text = "Name: " + v("name") + "\nTelefon: " + v("telefon") + "\nE-Mail: " + v("email") +
        "\nThema: " + v("thema") + "\n\n" + v("nachricht") + "\n";
      location.href = "mailto:mail@ra-th.de?subject=" + encodeURIComponent(betreff) + "&body=" + encodeURIComponent(text);
      form.classList.add("is-sent");
    });
  }
})();
