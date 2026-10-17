/**
 * DESKTOP CUSTOM CURSOR & SPARKLE TRAIL
 * "PSSST... THIS IS FOR YOU"
 */

export function initCursor() {
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) return;

  const cursorContainer = document.getElementById('custom-cursor');
  if (!cursorContainer) return;

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let lastTrailTime = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const now = Date.now();
    if (now - lastTrailTime > 60) {
      createCursorSparkle(mouseX, mouseY);
      lastTrailTime = now;
    }
  }, { passive: true });

  function render() {
    cursorX += (mouseX - cursorX) * 0.25;
    cursorY += (mouseY - cursorY) * 0.25;

    cursorContainer.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  function createCursorSparkle(x, y) {
    const el = document.createElement('div');
    el.className = 'cursor-trail-particle';
    el.innerHTML = Math.random() > 0.5 ? '✦' : '♥';
    el.style.position = 'fixed';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    el.style.fontSize = `${Math.random() * 8 + 8}px`;
    el.style.color = Math.random() > 0.5 ? '#FF496C' : '#F8D176';
    el.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 40 - 20}deg)`;
    el.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
    el.style.opacity = '0.9';

    document.body.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = `translate(-50%, ${-Math.random() * 20 - 10}px) scale(0.4) rotate(${Math.random() * 60 - 30}deg)`;
      el.style.opacity = '0';
    });

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 650);
  }
}

