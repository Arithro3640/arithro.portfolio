(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Count-up numbers when the About stats scroll into view
  var counters = document.querySelectorAll('[data-count]');
  function setFinal(el) { el.textContent = el.dataset.count + el.dataset.suffix; }
  if (reduce || !('IntersectionObserver' in window)) {
    counters.forEach(setFinal);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, end = +el.dataset.count, start = null;
        io.unobserve(el);
        requestAnimationFrame(function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 900, 1);
          el.textContent = Math.round(end * p) + el.dataset.suffix;
          if (p < 1) requestAnimationFrame(step);
        });
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { io.observe(el); });
  }

  // Contact form: validate, then open the visitor's email app
  var form = document.getElementById('contactForm');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var ok = true;
    form.querySelectorAll('.form-control').forEach(function (f) {
      var valid = f.checkValidity() && f.value.trim() !== '';
      f.classList.toggle('is-invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) return;
    var name = form.name.value.trim(), email = form.email.value.trim(), msg = form.msg.value.trim();
    var subject = encodeURIComponent('Portfolio message from ' + name);
    var body = encodeURIComponent(msg + '\n\n' + name + '\n' + email);
    window.location.href = 'mailto:arithrosomodder@gmail.com?subject=' + subject + '&body=' + body;
  });
})();
