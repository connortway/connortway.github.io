/* ============================================================
   CT-OS  —  shared runtime
   Menu, keyboard navigation, boot, slide viewer, palettes,
   and the snake that runs behind the whole site.
   Pure vanilla JS, no build step, GitHub Pages friendly.
   ============================================================ */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     MENU DEFINITION — single source of truth for every page
     panel:  a screen that lives on index.html
     href:   its own page or an external destination
     --------------------------------------------------------- */
  var MENU = [
    { label: "readme.txt",  kind: "--FILE->",  panel: "readme" },
    { label: "WORK",        kind: ">FOLDER<",  panel: "work" },
    { label: "about.txt",   kind: "--FILE->",  panel: "about" },
    { label: "contact.txt", kind: "--FILE->",  panel: "contact" },
    { label: "resume.pdf",  kind: "--FILE->",  href: "resume.html", page: "resume" },
    { label: "snake.exe",   kind: "--RUN-->",  panel: "snake" },
    { label: "settings",    kind: "--CFG-->",  panel: "settings" },
    { rule: true },
    { label: "WSET",        kind: ">FOLDER<",  href: "wset/index.html" },
    { label: "DOTS",        kind: ">FOLDER<",  href: "dots/dots.html" },
    { rule: true },
    { label: "github",      kind: "--LINK->",  href: "https://github.com/connortway", external: true },
    { label: "linkedin",    kind: "--LINK->",  href: "https://www.linkedin.com/in/william-tway-90895a2b3/", external: true },
    { label: "instagram",   kind: "--LINK->",  href: "https://www.instagram.com/connortway/", external: true },
    { label: "email",       kind: "--SEND->",  href: "mailto:twayconnor@gmail.com", external: true }
  ];

  var THEMES = [
    { id: "slate", label: "slate.pal", note: "grey / violet", swatch: ["#b8c7d6", "#9a8cff"] },
    { id: "ice",   label: "ice.pal",   note: "cyan / gold",   swatch: ["#86d5f7", "#e8a33f"] },
    { id: "amber", label: "amber.pal", note: "amber / cyan",  swatch: ["#f2b350", "#63cfe0"] },
    { id: "mono",  label: "mono.pal",  note: "pong",          swatch: ["#ededed", "#ffffff"] }
  ];

  var body = document.body;
  var PAGE = body.dataset.page || "home";        // home | resume | project
  var IS_HOME = PAGE === "home";
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (err) { /* private mode — carry on */ }
    return null;
  }

  /* ---------------------------------------------------------
     PALETTES
     --------------------------------------------------------- */
  var Theme = (function () {
    function current() {
      return document.documentElement.dataset.theme || "slate";
    }

    function apply(id) {
      document.documentElement.dataset.theme = id;
      store("ctos-theme", id);
      mark();
      Snake.refreshColors();
    }

    function mark() {
      var list = document.getElementById("paletteList");
      if (!list) return;
      list.querySelectorAll("button").forEach(function (b) {
        var on = b.dataset.theme === current();
        b.setAttribute("aria-current", on ? "true" : "false");
        b.querySelector(".mark").textContent = on ? ">" : " ";
      });
    }

    function render() {
      var list = document.getElementById("paletteList");
      if (!list) return;

      THEMES.forEach(function (t) {
        var li = document.createElement("li");
        var b = document.createElement("button");
        b.type = "button";
        b.dataset.theme = t.id;

        var mark = document.createElement("span");
        mark.className = "mark";

        var name = document.createElement("span");
        name.textContent = t.label + "  " + t.note;

        var sw = document.createElement("span");
        sw.className = "swatch";
        t.swatch.forEach(function (c) {
          var i = document.createElement("i");
          i.style.background = c;
          sw.appendChild(i);
        });

        b.appendChild(mark);
        b.appendChild(name);
        b.appendChild(sw);
        b.addEventListener("click", function () { apply(t.id); });

        li.appendChild(b);
        list.appendChild(li);
      });

      mark();
    }

    return { render: render, apply: apply };
  })();

  /* ---------------------------------------------------------
     SNAKE — runs behind the entire site, on every page
     --------------------------------------------------------- */
  var Snake = (function () {
    var canvas, ctx;
    var cell = 22, cols = 0, rows = 0, dpr = 1;
    var snake, dir, nextDir, food;
    var playing = false, score = 0, best = 0;
    var timer = null;
    var colors = { body: "#86d5f7", head: "#ffffff", food: "#e8a33f" };

    function init() {
      canvas = document.getElementById("snakeField");
      if (!canvas) return;
      ctx = canvas.getContext("2d");

      best = parseInt(store("ctos-snake-best") || "0", 10) || 0;
      refreshColors();
      resize();
      reset();
      updateHud();

      window.addEventListener("resize", debounce(resize, 150));
      document.addEventListener("keydown", onKey);

      var startBtn = document.getElementById("snakeStart");
      if (startBtn) startBtn.addEventListener("click", function () { toggle(); });

      if (REDUCED) { draw(); return; }   // still life for reduced-motion
      timer = setInterval(step, 110);
    }

    function debounce(fn, ms) {
      var t;
      return function () {
        clearTimeout(t);
        t = setTimeout(fn, ms);
      };
    }

    function refreshColors() {
      if (!canvas) return;
      var cs = getComputedStyle(document.documentElement);
      colors.body = cs.getPropertyValue("--phos").trim() || colors.body;
      colors.head = cs.getPropertyValue("--ink").trim() || colors.head;
      colors.food = cs.getPropertyValue("--sel").trim() || colors.food;
      draw();
    }

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = window.innerWidth;
      var h = window.innerHeight;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(8, Math.floor(w / cell));
      rows = Math.max(8, Math.floor(h / cell));

      if (snake) {
        // keep the snake inside the new grid rather than killing the run
        snake = snake.map(function (p) {
          return { x: Math.min(p.x, cols - 1), y: Math.min(p.y, rows - 1) };
        });
        if (food.x >= cols || food.y >= rows) food = randomFood();
      }
      draw();
    }

    function reset() {
      var midY = Math.floor(rows / 2);
      snake = [{ x: 6, y: midY }, { x: 5, y: midY }, { x: 4, y: midY }];
      dir = { x: 1, y: 0 };
      nextDir = dir;
      food = randomFood();
      score = 0;
      updateHud();
    }

    function randomFood() {
      var p, guard = 0;
      do {
        p = { x: (Math.random() * cols) | 0, y: (Math.random() * rows) | 0 };
        guard++;
      } while (guard < 200 && snake && snake.some(function (s) { return s.x === p.x && s.y === p.y; }));
      return p;
    }

    function toggle() { playing ? stop() : start(); }

    function start() {
      if (!canvas) return;
      playing = true;
      body.classList.add("snake-live");
      reset();
      syncUi();
      if (REDUCED && !timer) timer = setInterval(step, 110);
    }

    function stop() {
      playing = false;
      body.classList.remove("snake-live");
      syncUi();
      if (REDUCED && timer) { clearInterval(timer); timer = null; }
    }

    function syncUi() {
      var btn = document.getElementById("snakeStart");
      if (btn) btn.textContent = playing ? "RELEASE CONTROL" : "TAKE CONTROL";

      var mode = document.getElementById("snakeMode");
      if (mode) mode.textContent = playing ? "PLAYER" : "ATTRACT";

      var hint = document.getElementById("statusHint");
      if (hint) {
        hint.textContent = playing
          ? "SNAKE: " + String(score).padStart(4, "0") + " \u00B7 ESC RELEASES"
          : hint.dataset.idle || "";
      }
    }

    function capturesKeys() { return playing; }

    function onKey(e) {
      var map = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 }
      };

      if (!playing) {
        // "s" anywhere hands the snake over to the player
        if ((e.key === "s" || e.key === "S") && !isTyping(e)) {
          e.preventDefault();
          start();
        }
        return;
      }

      if (e.key === "Escape") { stop(); return; }

      var d = map[e.key];
      if (!d) return;
      e.preventDefault();
      if (d.x === -dir.x && d.y === -dir.y) return;   // no instant reversal
      nextDir = d;
    }

    function isTyping(e) {
      return e.target && e.target.matches && e.target.matches("input, textarea, select");
    }

    /* attract-mode driver: greedy toward food, refuses obvious suicide */
    function autoPilot() {
      var head = snake[0];
      var options = [
        { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }
      ].filter(function (d) {
        if (d.x === -dir.x && d.y === -dir.y) return false;
        var nx = head.x + d.x, ny = head.y + d.y;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return false;
        return !snake.slice(0, -1).some(function (s) { return s.x === nx && s.y === ny; });
      });
      if (!options.length) return;
      options.sort(function (a, b) { return dist(head, a) - dist(head, b); });
      nextDir = options[0];
    }

    function dist(head, d) {
      return Math.abs(head.x + d.x - food.x) + Math.abs(head.y + d.y - food.y);
    }

    function step() {
      if (!playing) autoPilot();
      dir = nextDir;

      var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      var hitWall = head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows;
      var hitSelf = snake.some(function (s) { return s.x === head.x && s.y === head.y; });

      if (hitWall || hitSelf) {
        if (playing) {
          if (score > best) {
            best = score;
            store("ctos-snake-best", String(best));
          }
          stop();
        }
        reset();
        draw();
        return;
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        food = randomFood();
        if (playing) { score += 10; updateHud(); syncUi(); }
      } else {
        snake.pop();
      }
      draw();
    }

    function updateHud() {
      var s = document.getElementById("snakeScore");
      var b = document.getElementById("snakeBest");
      if (s) s.textContent = String(score).padStart(4, "0");
      if (b) b.textContent = String(best).padStart(4, "0");
    }

    function draw() {
      if (!ctx || !snake) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = colors.food;
      ctx.fillRect(food.x * cell + 5, food.y * cell + 5, cell - 10, cell - 10);

      snake.forEach(function (part, i) {
        ctx.fillStyle = i === 0 ? colors.head : colors.body;
        ctx.globalAlpha = i === 0 ? 1 : Math.max(0.28, 1 - i / (snake.length + 8));
        ctx.fillRect(part.x * cell + 2, part.y * cell + 2, cell - 4, cell - 4);
      });
      ctx.globalAlpha = 1;
    }

    return {
      init: init,
      refreshColors: refreshColors,
      capturesKeys: capturesKeys,
      toggle: toggle
    };
  })();

  /* ---------------------------------------------------------
     CLOCK
     --------------------------------------------------------- */
  function startClock() {
    var el = document.getElementById("clock");
    if (!el) return;
    function tick() {
      var d = new Date();
      el.textContent =
        String(d.getHours()).padStart(2, "0") + ":" +
        String(d.getMinutes()).padStart(2, "0");
    }
    tick();
    setInterval(tick, 10000);
  }

  /* ---------------------------------------------------------
     MENU
     --------------------------------------------------------- */
  var items = [];
  var cursor = 0;
  var menuEl = document.getElementById("crtMenu");

  function currentPanel() {
    var hash = location.hash.replace("#", "");
    if (IS_HOME && hash) return hash;
    return body.dataset.panel || "readme";
  }

  function renderMenu() {
    if (!menuEl) return;

    var heading = document.createElement("div");
    heading.className = "menu-heading";
    heading.textContent = "C:\\CONNORTWAY";
    menuEl.appendChild(heading);

    MENU.forEach(function (entry) {
      if (entry.rule) {
        var hr = document.createElement("div");
        hr.className = "menu-rule";
        menuEl.appendChild(hr);
        return;
      }

      var a = document.createElement("a");
      a.className = "menu-item";
      a.href = entry.href || (IS_HOME ? "#" + entry.panel : "index.html#" + entry.panel);
      if (entry.external) {
        a.target = "_blank";
        a.rel = "noopener";
      }

      var name = document.createElement("span");
      name.className = "name";
      name.textContent = entry.label;

      var kind = document.createElement("span");
      kind.className = "kind";
      kind.textContent = entry.kind;

      a.appendChild(name);
      a.appendChild(kind);
      menuEl.appendChild(a);

      var index = items.length;
      entry.el = a;
      items.push(entry);

      a.addEventListener("mouseenter", function () { setCursor(index); });
      a.addEventListener("focus", function () { setCursor(index); });
      a.addEventListener("click", function (e) {
        if (entry.panel && IS_HOME) {
          e.preventDefault();
          openPanel(entry.panel);
        }
        setCursor(index);
      });
    });
  }

  function setCursor(i) {
    if (!items.length) return;
    cursor = (i + items.length) % items.length;
    items.forEach(function (entry, n) {
      entry.el.classList.toggle("is-active", n === cursor);
    });
    items[cursor].el.scrollIntoView({ block: "nearest" });
  }

  function syncCursorToLocation() {
    var panel = currentPanel();
    var match = -1;
    items.forEach(function (entry, n) {
      if (entry.page && entry.page === PAGE) match = n;
      else if (match === -1 && entry.panel === panel) match = n;
    });
    setCursor(match === -1 ? 0 : match);
  }

  function openPanel(name) {
    var screens = document.querySelectorAll(".screen");
    var found = false;

    screens.forEach(function (s) {
      var on = s.dataset.screen === name;
      s.hidden = !on;
      if (on) found = true;
    });

    if (!found) return;

    if (location.hash.replace("#", "") !== name) {
      history.replaceState(null, "", "#" + name);
    }
    setStatusPath(name);
    var panelEl = document.getElementById("crtPanel");
    if (panelEl) panelEl.scrollTop = 0;
  }

  function setStatusPath(name) {
    var el = document.getElementById("statusPath");
    if (!el) return;
    el.textContent = name ? "C:\\CONNORTWAY\\" + name.toUpperCase() : "C:\\CONNORTWAY";
  }

  /* ---------------------------------------------------------
     KEYBOARD — arrows move the cursor, Enter opens
     --------------------------------------------------------- */
  function bindKeys() {
    document.addEventListener("keydown", function (e) {
      if (Snake.capturesKeys()) return;           // snake owns the keys while you play
      if (e.target && e.target.matches && e.target.matches("input, textarea, select")) return;

      var k = e.key;
      if (k === "ArrowDown" || k === "j") {
        e.preventDefault();
        setCursor(cursor + 1);
      } else if (k === "ArrowUp" || k === "k") {
        e.preventDefault();
        setCursor(cursor - 1);
      } else if (k === "Enter") {
        if (!items.length) return;
        e.preventDefault();
        items[cursor].el.click();
      } else if (k === "Escape" && PAGE !== "home") {
        location.href = "index.html";
      }
    });
  }

  /* ---------------------------------------------------------
     SLIDE VIEWER — project screenshots
     --------------------------------------------------------- */
  function initViewers() {
    document.querySelectorAll("[data-viewer]").forEach(function (viewer) {
      var slides = Array.prototype.slice.call(viewer.querySelectorAll(".slide"));
      if (!slides.length) return;

      var titleEl = viewer.querySelector(".v-title");
      var textEl = viewer.querySelector(".v-text");
      var countEl = viewer.querySelector(".counter");
      var dotList = viewer.querySelector(".viewer-dots");
      var index = 0;
      var timer;

      var dots = slides.map(function (slide, i) {
        var li = document.createElement("li");
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Frame " + (i + 1) + ": " + (slide.dataset.title || ""));
        b.addEventListener("click", function () { show(i); restart(); });
        li.appendChild(b);
        dotList.appendChild(li);
        return b;
      });

      function show(i) {
        index = (i + slides.length) % slides.length;
        slides.forEach(function (s, n) { s.classList.toggle("is-active", n === index); });
        dots.forEach(function (d, n) { d.setAttribute("aria-current", n === index ? "true" : "false"); });
        var active = slides[index];
        if (titleEl) titleEl.textContent = active.dataset.title || "";
        if (textEl) textEl.textContent = active.dataset.text || "";
        if (countEl) {
          countEl.textContent =
            "FRAME " + String(index + 1).padStart(2, "0") + "/" + String(slides.length).padStart(2, "0");
        }
      }

      function restart() {
        clearInterval(timer);
        timer = setInterval(function () { show(index + 1); }, 12000);
      }

      viewer.querySelector(".vbtn.prev").addEventListener("click", function () { show(index - 1); restart(); });
      viewer.querySelector(".vbtn.next").addEventListener("click", function () { show(index + 1); restart(); });

      var startX = 0;
      var stage = viewer.querySelector(".viewer-stage");
      stage.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
      stage.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) { show(index + (dx < 0 ? 1 : -1)); restart(); }
      });

      show(0);
      restart();
    });
  }

  /* ---------------------------------------------------------
     BOOT SEQUENCE — once per browser session
     --------------------------------------------------------- */
  function boot() {
    var el = document.getElementById("boot");
    if (!el) return;

    var seen = false;
    try { seen = sessionStorage.getItem("ctos-booted") === "1"; } catch (err) { seen = false; }

    if (seen || REDUCED) { el.remove(); return; }

    var lines = [
      "CT-OS  v2.1.01p",
      "(c) CONNOR TWAY  \u2014  PACE UNIVERSITY",
      "",
      "POST .................... OK",
      "PHOSPHOR ARRAY .......... OK",
      "INPUT DEVICE ............ KEYBOARD",
      "MOUNTING C:\\CONNORTWAY .. OK",
      "SNAKE DAEMON ............ RUNNING",
      "",
      "LOADING MENU_"
    ];

    var i = 0, j = 0, out = "";
    var typer = setInterval(function () {
      if (i >= lines.length) {
        clearInterval(typer);
        finish();
        return;
      }
      if (j >= lines[i].length) {
        out += "\n";
        i++;
        j = 0;
      } else {
        out += lines[i][j++];
      }
      el.textContent = out;
    }, 9);

    function done() {
      try { sessionStorage.setItem("ctos-booted", "1"); } catch (err) { /* ignore */ }
    }

    function finish() {
      setTimeout(function () {
        el.classList.add("is-done");
        setTimeout(function () { el.remove(); }, 460);
      }, 260);
      done();
    }

    function skip() {
      clearInterval(typer);
      if (el.parentNode) el.remove();
      done();
    }

    el.addEventListener("click", skip);
    document.addEventListener("keydown", skip, { once: true });
  }

  /* ---------------------------------------------------------
     START
     --------------------------------------------------------- */
  var hintEl = document.getElementById("statusHint");
  if (hintEl) hintEl.dataset.idle = hintEl.textContent;

  startClock();
  renderMenu();
  initViewers();
  Theme.render();
  Snake.init();
  bindKeys();

  if (IS_HOME) {
    openPanel(currentPanel());
    window.addEventListener("hashchange", function () {
      openPanel(currentPanel());
      syncCursorToLocation();
    });
  } else {
    var pathEl = document.getElementById("statusPath");
    if (pathEl && body.dataset.path) pathEl.textContent = body.dataset.path;
  }

  syncCursorToLocation();
  boot();
})();
