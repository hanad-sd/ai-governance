/* ============================================================
   YOUR DETAILS. EDIT HERE.
   Change the words between the quotation marks, save, and upload.
   They update everywhere on the site. Leave a value as "" to hide it.
   Do not remove the quotation marks or the commas at the end of lines.
   ============================================================ */
window.SITE = {
  name:      "Answerable",
  tagline:   "AI risk & compliance · Hanad Sahardeed",
  person:    "Hanad Sahardeed",
  email:     "hanad.s@icloud.com",
  phone:     "",
  linkedin:  "https://www.linkedin.com/in/hanads/",
  address:   "Toronto, Ontario",
  replyTime: "three working days"
};

/* Nothing below this line needs editing. */
(function () {
  function fill() {
    var s = window.SITE || {};
    document.querySelectorAll("[data-site]").forEach(function (el) {
      var v = s[el.getAttribute("data-site")];
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-site-href='email']").forEach(function (el) {
      if (s.email) el.setAttribute("href", "mailto:" + s.email);
    });
    document.querySelectorAll("[data-site-href='linkedin']").forEach(function (el) {
      if (s.linkedin) el.setAttribute("href", s.linkedin); else el.hidden = true;
    });
    document.querySelectorAll("[data-site-row]").forEach(function (el) {
      el.hidden = !s[el.getAttribute("data-site-row")];
    });
    if (s.name) document.title = document.title.replace("Answerable", s.name);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill); else fill();
})();
