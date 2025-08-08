(function () {
  "use strict";

  // Configure your defaults here
  // defaultImage: relative path within KoalasToTheMax/img or an absolute URL
  var defaultImage = "img/olivia.jpg";
  // optional background image for the letter theme
  // place a paper/canvas texture under KoalasToTheMax/img (or use your own URL)
  var letterBackground = null; // e.g. "img/letter-paper.jpg" or any URL

  function getParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      img: params.get("img"),
      bg: params.get("bg"),
      msg: params.get("msg")
    };
  }

  function setLetterBackground(url) {
    if (!url) return;
    var body = document.body;
    body.classList.add("has-letter-bg");
    body.style.backgroundImage = "url('" + url + "')";
  }

  function startPixelized(src) {
    if (!koala || !koala.supportsCanvas() || !koala.supportsSVG()) {
      alert("Your browser does not support the required features (Canvas + SVG).");
      return;
    }

    // If remote URL, proxy through image-server.php to avoid tainting canvas
    var file = src;
    if (/^https?:/.test(file)) {
      file = "image-server.php?url=" + encodeURIComponent(file);
    }

    var messageShown = false;
    function onEvent(type, value) {
      if (type === 'PercentClear' && typeof value === 'number') {
        if (!messageShown && value >= 13) {
          var msgEl = document.querySelector('.message');
          if (msgEl) {
            msgEl.classList.add('visible');
          }
          messageShown = true;
        }
      }
    }

    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      var colorData;
      try {
        colorData = koala.loadImage(this);
      } catch (e) {
        alert("Could not load the image for pixelization.");
        return;
      }
      // Render into our custom container
      koala.makeCircles("#pixelized", colorData, onEvent);
    };
    img.src = file;
  }

  // Apply background and start the pixelized view with defaults or URL params
  var qp = getParams();
  var bg = qp.bg || letterBackground;
  var src = qp.img || defaultImage;
  var msg = qp.msg;

  if (bg) setLetterBackground(bg);
  if (msg) {
    var heading = document.querySelector('.message h1');
    if (heading) heading.textContent = msg;
  }
  startPixelized(src);
})();

