(function () {
  if (window.__erynArtmugLightboxLoaded) return;
  window.__erynArtmugLightboxLoaded = true;

  var ALLOWED_ORIGIN = 'https://eryn0123.github.io';

  var overlay = null;
  var imageEl = null;
  var captionEl = null;
  var counterEl = null;
  var prevBtn = null;
  var nextBtn = null;
  var closeBtn = null;

  var images = [];
  var currentIndex = 0;
  var oldHtmlOverflow = '';
  var oldBodyOverflow = '';

  function button(text, label) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    b.setAttribute('aria-label', label);
    b.style.cssText =
      'position:absolute;z-index:3;display:flex;align-items:center;justify-content:center;' +
      'border:1px solid rgba(255,255,255,.24);border-radius:50%;' +
      'background:rgba(25,22,38,.72);color:#fff;cursor:pointer;' +
      'font-family:Arial,sans-serif;line-height:1;';
    return b;
  }

  function build() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483647;display:none;' +
      'align-items:center;justify-content:center;padding:28px 76px;' +
      'box-sizing:border-box;background:rgba(20,18,30,.90);';

    var content = document.createElement('div');
    content.style.cssText =
      'position:relative;width:100%;max-width:1500px;' +
      'max-height:calc(100vh - 56px);display:flex;flex-direction:column;' +
      'align-items:center;justify-content:center;';

    imageEl = document.createElement('img');
    imageEl.alt = '';
    imageEl.style.cssText =
      'display:block;max-width:100%;max-height:calc(100vh - 110px);' +
      'width:auto;height:auto;object-fit:contain;user-select:none;' +
      'box-shadow:0 10px 45px rgba(0,0,0,.38);';

    closeBtn = button('×', '닫기');
    closeBtn.style.cssText +=
      'top:-4px;right:-54px;width:42px;height:42px;font-size:25px;';

    prevBtn = button('‹', '이전 이미지');
    prevBtn.style.cssText +=
      'top:50%;left:-64px;width:48px;height:48px;' +
      'transform:translateY(-50%);font-size:30px;';

    nextBtn = button('›', '다음 이미지');
    nextBtn.style.cssText +=
      'top:50%;right:-64px;width:48px;height:48px;' +
      'transform:translateY(-50%);font-size:30px;';

    var footer = document.createElement('div');
    footer.style.cssText =
      'min-height:36px;margin-top:10px;display:flex;align-items:center;' +
      'justify-content:center;gap:12px;color:#fff;';

    captionEl = document.createElement('span');
    captionEl.style.cssText =
      'font-size:12px;color:rgba(255,255,255,.88);text-align:center;';

    counterEl = document.createElement('span');
    counterEl.style.cssText =
      'padding:4px 9px;border-radius:20px;background:rgba(255,255,255,.12);' +
      'font-size:11px;color:rgba(255,255,255,.86);white-space:nowrap;';

    footer.appendChild(captionEl);
    footer.appendChild(counterEl);

    content.appendChild(closeBtn);
    content.appendChild(prevBtn);
    content.appendChild(imageEl);
    content.appendChild(nextBtn);
    content.appendChild(footer);

    overlay.appendChild(content);
    document.body.appendChild(overlay);

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { move(-1); });
    nextBtn.addEventListener('click', function () { move(1); });

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) close();
    });

    responsive();
  }

  function responsive() {
    if (!overlay) return;

    if (window.innerWidth <= 800) {
      overlay.style.padding = '58px 14px 22px';
      imageEl.style.maxHeight = 'calc(100vh - 135px)';

      closeBtn.style.top = '-48px';
      closeBtn.style.right = '0';

      prevBtn.style.left = '8px';
      nextBtn.style.right = '8px';

      prevBtn.style.width = nextBtn.style.width = '42px';
      prevBtn.style.height = nextBtn.style.height = '42px';
      prevBtn.style.fontSize = nextBtn.style.fontSize = '25px';
    } else {
      overlay.style.padding = '28px 76px';
      imageEl.style.maxHeight = 'calc(100vh - 110px)';

      closeBtn.style.top = '-4px';
      closeBtn.style.right = '-54px';

      prevBtn.style.left = '-64px';
      nextBtn.style.right = '-64px';

      prevBtn.style.width = nextBtn.style.width = '48px';
      prevBtn.style.height = nextBtn.style.height = '48px';
      prevBtn.style.fontSize = nextBtn.style.fontSize = '30px';
    }
  }

  function render() {
    if (!images.length) return;

    currentIndex = (currentIndex + images.length) % images.length;
    var item = images[currentIndex] || {};

    imageEl.src = item.src || '';
    imageEl.alt = item.alt || '판매 모델 상세 이미지';
    captionEl.textContent = item.caption || item.alt || '';
    counterEl.textContent = (currentIndex + 1) + ' / ' + images.length;

    var show = images.length > 1;
    prevBtn.style.display = show ? 'flex' : 'none';
    nextBtn.style.display = show ? 'flex' : 'none';
  }

  function open(data) {
    build();

    images = Array.isArray(data.images)
      ? data.images.filter(function (item) { return item && item.src; })
      : [];

    if (!images.length) return;

    currentIndex = Number(data.index) || 0;
    currentIndex = (currentIndex + images.length) % images.length;

    oldHtmlOverflow = document.documentElement.style.overflow;
    oldBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    render();

    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
  }

  function close() {
    if (!overlay) return;

    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');

    document.documentElement.style.overflow = oldHtmlOverflow;
    document.body.style.overflow = oldBodyOverflow;

    imageEl.removeAttribute('src');
  }

  function move(step) {
    if (!images.length) return;
    currentIndex = (currentIndex + step + images.length) % images.length;
    render();
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== ALLOWED_ORIGIN) return;

    var data = event.data || {};
    if (data.type === 'ERYN_SALE_LIGHTBOX_OPEN') {
      open(data);
    }
  });

  window.addEventListener('resize', responsive);

  document.addEventListener('keydown', function (event) {
    if (!overlay || overlay.style.display !== 'flex') return;

    if (event.key === 'Escape') close();
    else if (event.key === 'ArrowLeft') move(-1);
    else if (event.key === 'ArrowRight') move(1);
  });
})();