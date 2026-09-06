(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lines = document.querySelectorAll('.er-line');

  if (prefersReduced) {
    lines.forEach(function (line) { line.classList.add('is-drawn'); });
    return;
  }

  // Single orchestrated reveal: draw connecting lines in sequence on load.
  window.addEventListener('load', function () {
    lines.forEach(function (line, i) {
      setTimeout(function () {
        line.classList.add('is-drawn');
      }, 150 + i * 110);
    });
  });
})();
