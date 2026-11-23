/* Muhammad Arman Nazari — MightArm
   Vanilla JS only. No dependencies, no build step. */

(function () {
  "use strict";

  // Mark that JS is running so CSS can hide typewriter words until revealed.
  document.documentElement.classList.add("js-ready");

  // ------------------------------------------------------------
  // Sound (Web Audio API, no audio files, off by default)
  // ------------------------------------------------------------
  var soundToggle = document.querySelector(".sound-toggle");
  var soundState = soundToggle.querySelector(".sound-state");
  var soundEnabled = false;
  var audioCtx = null;

  function ensureAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function blip() {
    if (!soundEnabled) return;
    ensureAudio();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    var now = audioCtx.currentTime;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  function updateSoundUI() {
    soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    soundToggle.title = soundEnabled ? "Sound on" : "Sound off";
    soundState.textContent = soundEnabled ? "on" : "off";
  }

  soundToggle.addEventListener("click", function () {
    soundEnabled = !soundEnabled;
    updateSoundUI();
    blip();
  });

  // ------------------------------------------------------------
  // Starfield background (generated with JS, positioned with CSS)
  // ------------------------------------------------------------
  var starfield = document.getElementById("starfield");
  var starCount = 55;
  var stars = [];

  function createStars() {
    starfield.innerHTML = "";
    stars = [];
    for (var i = 0; i < starCount; i++) {
      var star = document.createElement("div");
      star.className = "star";
      var x = Math.floor(Math.random() * 100);
      var y = Math.floor(Math.random() * 100);
      var size = 1 + Math.random() * 2.5;
      var opacity = 0.4 + Math.random() * 0.6;
      star.style.insetInlineStart = x + "%";
      star.style.insetBlockStart = y + "%";
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.style.opacity = opacity;
      starfield.appendChild(star);
      stars.push({ el: star, speed: 0.03 + Math.random() * 0.07, y: y });
    }
  }
  createStars();
  window.addEventListener("resize", createStars);
  // ------------------------------------------------------------
  // Scroll progress heart + parallax (transform only, rAF throttled)
  // ------------------------------------------------------------
  var heart = document.querySelector(".scroll-indicator");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }

  function updateScroll() {
    var doc = document.documentElement;
    var body = document.body;
    var scrolled = doc.scrollTop || body.scrollTop;
    var max = Math.max(doc.scrollHeight, body.scrollHeight) - doc.clientHeight;
    var pct = max === 0 ? 0 : scrolled / max;
    var vh = window.innerHeight;
    var travel = vh - 24; // roughly viewport minus heart size

    heart.style.transform = "translatey(" + (pct * travel) + "px)";

    if (!reduced.matches) {
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var y = pct * -120 * s.speed;
        s.el.style.transform = "translatey(" + y + "px)";
      }
    }

    ticking = false;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateScroll);
  onScroll();

  // ------------------------------------------------------------
  // Typewriter by whole words, triggered by IntersectionObserver
  // ------------------------------------------------------------
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var room = entry.target;
          var textEl = room.querySelector(".dialogue-text");
          if (textEl && !textEl.dataset.revealed) {
            revealWords(textEl);
            textEl.dataset.revealed = "1";
            observer.unobserve(room);
          }
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".room").forEach(function (room) {
    observer.observe(room);
  });

  function revealWords(el) {
    var text = el.textContent.trim();
    if (!text) return;
    var words = text.split(/\s+/);
    el.innerHTML = "";
    words.forEach(function (w, i) {
      var span = document.createElement("span");
      span.className = "word";
      span.textContent = w;
      el.appendChild(span);
      if (i !== words.length - 1) {
        el.appendChild(document.createTextNode(" "));
      }
    });

    var spans = el.querySelectorAll(".word");

    if (reduced.matches) {
      spans.forEach(function (s) { s.classList.add("reveal"); });
      return;
    }

    var i = 0;
    function next() {
      if (i >= spans.length) return;
      spans[i].classList.add("reveal");
      i++;
      if (i < spans.length) {
        setTimeout(next, 55);
      }
    }
    next();
  }

  // ------------------------------------------------------------
  // Save-point stars: sparkle + "Saved" message
  // ------------------------------------------------------------
  document.querySelectorAll(".save-point").forEach(function (button) {
    function activate() {
      button.classList.add("saved");
      blip();

      var sparkle = document.createElement("span");
      sparkle.className = "sparkle";
      button.appendChild(sparkle);
      setTimeout(function () { sparkle.remove(); }, 500);

      setTimeout(function () {
        button.classList.remove("saved");
      }, 900);
    }

    button.addEventListener("click", activate);

    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });
})();
/* === hero v2 === */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var hero = document.getElementById("hero");
  var heading = hero.querySelector(".hero-heading");
  var typing = hero.querySelector(".hero-typing");
  var scrollHint = hero.querySelector(".hero-scroll-hint");

  if (reduced.matches) {
    if (typing) typing.style.display = "none";
    return;
  }

  // Type heading by whole words after the typing indicator (~700 ms)
  setTimeout(function () {
    if (typing) typing.style.display = "none";

    var fullText = heading.textContent.trim();
    var typeText = fullText.replace(/·\s*$/, "").trim();
    var fullstopEl = heading.querySelector(".hero-fullstop");

    heading.innerHTML = "";
    var words = typeText.split(/\s+/);
    words.forEach(function (w, i) {
      var span = document.createElement("span");
      span.className = "word";
      span.textContent = w;
      heading.appendChild(span);
      if (i !== words.length - 1) {
        heading.appendChild(document.createTextNode(" "));
      }
    });
    if (fullstopEl) {
      heading.appendChild(document.createTextNode(" "));
      heading.appendChild(fullstopEl);
    }

    var spans = heading.querySelectorAll(".word");
    var i = 0;
    function next() {
      if (i >= spans.length) return;
      spans[i].classList.add("reveal");
      i++;
      if (i < spans.length) {
        setTimeout(next, 55);
      }
    }
    next();
  }, 1300);

  // Scroll drift: hero drifts up and fades as user scrolls away
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateDrift);
      ticking = true;
    }
  }

  function updateDrift() {
    var scrolled = window.pageYOffset;
    if (scrolled > 40) {
      hero.classList.add("hero-drift");
    } else {
      hero.classList.remove("hero-drift");
    }
    ticking = false;
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Fade out scroll hint after the first scroll
  window.addEventListener(
    "scroll",
    function () {
      scrollHint.style.opacity = "0";
      scrollHint.style.pointerEvents = "none";
    },
    { once: true }
  );
})();
