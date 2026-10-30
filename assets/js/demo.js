// The hero demo: a sample hallway with pins, like the app's photo screen.
// Positions are fractions of the photo's width and height (0 to 1), the same
// way the app stores them. Red pins open a close-up, teal pins are things.
(function () {
  "use strict";

  var PLACES = {
    hallway: {
      name: "Hallway",
      img: "assets/img/scene-hallway.svg",
      alt: "A hallway with a wardrobe, a console table and an umbrella stand",
      pins: [
        { x: 0.283, y: 0.40, open: "wardrobe", label: "Wardrobe" },
        { x: 0.606, y: 0.535, label: "Spare keys", note: "In the bowl on the console table.", align: "end" },
        { x: 0.855, y: 0.66, label: "Umbrellas", align: "end" }
      ]
    },
    wardrobe: {
      name: "Wardrobe",
      img: "assets/img/scene-wardrobe.svg",
      alt: "Inside the wardrobe: boxes on the top shelf, hanging coats and drawers",
      pins: [
        { x: 0.479, y: 0.21, open: "box", label: "Top shelf box" },
        { x: 0.785, y: 0.22, label: "Winter duvet", align: "end" },
        { x: 0.205, y: 0.60, label: "Ski jacket", align: "start" }
      ]
    },
    box: {
      name: "Top shelf box",
      img: "assets/img/scene-box.svg",
      alt: "Looking into the box: passports, a document folder, an envelope and a small pouch",
      pins: [
        { x: 0.27, y: 0.37, label: "Passports", date: { m: "MAR", d: "14", text: "Expires 14 March 2027. Your phone reminds you at 9:00 that day." } },
        { x: 0.615, y: 0.34, label: "House documents" },
        { x: 0.53, y: 0.70, label: "Warranty receipts", align: "end" },
        { x: 0.81, y: 0.70, label: "Spare car key" }
      ]
    }
  };

  // Outermost layer first, as in the app's NestedFrame.
  var LAYER_COLORS = ["#1E6E6A", "#E8452C", "#FFD84D"];

  var PIN_PATH = "M22 45 13.7 27.3A13 13 0 1 1 30.3 27.3Z";
  var DOLL_PATH = "M22 8.6a3.7 3.7 0 0 1 2.7 6.2c2 1 3.3 3 3.3 5.4v3.5H16v-3.5c0-2.4 1.3-4.4 3.3-5.4A3.7 3.7 0 0 1 22 8.6z";

  var root = document.getElementById("demo");
  if (!root) return;

  var frame = root.querySelector(".frame");
  var photo = root.querySelector(".photo");
  var clip = root.querySelector(".photo-clip");
  var pinsEl = root.querySelector(".pins");
  var crumbs = root.querySelector(".crumbs");
  var back = root.querySelector(".back");
  var sheet = root.querySelector(".sheet");
  var status = root.querySelector(".sr-status");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var path = ["hallway"];
  var busy = false;

  function svgPin(open) {
    var fill = open ? "#E8452C" : "#1E6E6A";
    var face = open
      ? '<path d="' + DOLL_PATH + '" fill="#FFD84D" stroke="#231A16" stroke-width="1.8" stroke-linejoin="round"/>'
      : '<circle cx="22" cy="17" r="4.6" fill="#fff"/>';
    return '<svg viewBox="0 0 44 50" aria-hidden="true">' +
      '<ellipse cx="22" cy="46" rx="6.5" ry="2.2" fill="rgba(0,0,0,.35)"/>' +
      '<path d="' + PIN_PATH + '" fill="' + fill + '" stroke="#231A16" stroke-width="2.6" stroke-linejoin="round"/>' +
      face + "</svg>";
  }

  function renderLayers() {
    var n = path.length - 1;
    frame.style.setProperty("--layers", n);
    var old = frame.querySelectorAll(".layer");
    for (var k = 0; k < old.length; k++) old[k].remove();
    for (var i = n; i >= 1; i--) {
      var layer = document.createElement("div");
      layer.className = "layer";
      layer.style.setProperty("--i", i);
      layer.style.background = LAYER_COLORS[(n - i) % LAYER_COLORS.length];
      frame.insertBefore(layer, photo);
    }
  }

  function renderCrumbs() {
    crumbs.innerHTML = "";
    path.forEach(function (id, idx) {
      var li = document.createElement("li");
      if (idx === path.length - 1) {
        var here = document.createElement("span");
        here.setAttribute("aria-current", "location");
        here.textContent = PLACES[id].name;
        li.appendChild(here);
      } else {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = PLACES[id].name;
        b.addEventListener("click", function () { goTo(idx); });
        li.appendChild(b);
      }
      crumbs.appendChild(li);
    });
    back.hidden = path.length === 1;
  }

  function renderPins() {
    var place = PLACES[path[path.length - 1]];
    pinsEl.innerHTML = "";
    place.pins.forEach(function (pin) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pin";
      b.style.setProperty("--x", pin.x);
      b.style.setProperty("--y", pin.y);
      if (pin.align) b.setAttribute("data-align", pin.align);
      b.setAttribute("aria-label", pin.open ? "Open close-up: " + pin.label : "Show " + pin.label);
      b.innerHTML = svgPin(!!pin.open) + '<span class="label" aria-hidden="true"></span>';
      b.querySelector(".label").textContent = pin.label;
      b.addEventListener("click", function () {
        if (pin.open) openCloseUp(pin);
        else showItem(pin, b);
      });
      pinsEl.appendChild(b);
    });
  }

  function placePath() {
    return path.map(function (id) { return PLACES[id].name; }).join(" › ");
  }

  var lastPin = null;

  function showItem(pin, button) {
    lastPin = button;
    var tile = sheet.querySelector(".date-tile");
    if (pin.date) {
      tile.hidden = false;
      tile.querySelector(".m").textContent = pin.date.m;
      tile.querySelector(".d").textContent = pin.date.d;
    } else {
      tile.hidden = true;
    }
    sheet.querySelector("h3").textContent = pin.label;
    sheet.querySelector("p").textContent = pin.date ? pin.date.text : (pin.note ? pin.note + " " : "") + placePath();
    sheet.hidden = false;
    sheet.focus({ preventScroll: true });
  }

  function hideSheet(restoreFocus) {
    if (sheet.hidden) return;
    sheet.hidden = true;
    if (restoreFocus && lastPin && document.body.contains(lastPin)) lastPin.focus({ preventScroll: true });
  }

  sheet.querySelector(".close").addEventListener("click", function () { hideSheet(true); });
  root.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hideSheet(true);
  });

  function swapScene(place, origin, direction) {
    var oldScene = clip.querySelector(".scene");
    var next = document.createElement("div");
    next.className = "scene";
    var img = document.createElement("img");
    img.src = place.img;
    img.alt = place.alt;
    next.appendChild(img);
    clip.appendChild(next);

    if (reduceMotion || !next.animate) {
      oldScene.remove();
      return Promise.resolve();
    }

    var o = (origin.x * 100) + "% " + (origin.y * 100) + "%";
    oldScene.style.transformOrigin = o;
    next.style.transformOrigin = o;
    var inward = direction === "in";
    var opts = { duration: 420, easing: "cubic-bezier(.3,.7,.2,1)", fill: "forwards" };
    var a = oldScene.animate(
      inward ? [{ transform: "scale(1)", opacity: 1 }, { transform: "scale(2.6)", opacity: 0 }]
             : [{ transform: "scale(1)", opacity: 1 }, { transform: "scale(0.4)", opacity: 0 }], opts);
    var b = next.animate(
      inward ? [{ transform: "scale(0.35)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }]
             : [{ transform: "scale(2.6)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], opts);
    return Promise.all([a.finished, b.finished]).then(function () {
      oldScene.remove();
      next.style.transform = "";
    });
  }

  function announce(text) {
    status.textContent = "";
    window.setTimeout(function () { status.textContent = text; }, 30);
  }

  function openCloseUp(pin) {
    if (busy) return;
    busy = true;
    hideSheet(false);
    pinsEl.innerHTML = "";
    path.push(pin.open);
    renderLayers();
    renderCrumbs();
    swapScene(PLACES[pin.open], pin, "in").then(function () {
      renderPins();
      busy = false;
      announce("Opened " + PLACES[pin.open].name);
      var first = pinsEl.querySelector(".pin");
      if (first && root.contains(document.activeElement) === false) first.focus({ preventScroll: true });
    });
  }

  function goTo(idx) {
    if (busy || idx >= path.length - 1) return;
    busy = true;
    hideSheet(false);
    // Zoom back out towards the pin that led here.
    var parentId = path[idx];
    var childId = path[idx + 1];
    var via = PLACES[parentId].pins.filter(function (p) { return p.open === childId; })[0] || { x: 0.5, y: 0.5 };
    path = path.slice(0, idx + 1);
    pinsEl.innerHTML = "";
    renderLayers();
    renderCrumbs();
    swapScene(PLACES[parentId], via, "out").then(function () {
      renderPins();
      busy = false;
      announce("Back to " + PLACES[parentId].name);
      if (!root.contains(document.activeElement)) {
        var target = back.hidden ? pinsEl.querySelector(".pin") : back;
        if (target) target.focus({ preventScroll: true });
      }
    });
  }

  back.addEventListener("click", function () { goTo(path.length - 2); });

  renderLayers();
  renderCrumbs();
  renderPins();
})();
