/**
 * MAIN APPLICATION ENTRY POINT
 * "PSSST... THIS IS FOR YOU"
 */

import { sound } from './audio.js';
import { initCursor } from './cursor.js';
import { initInteractions } from './interactions.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize custom cursor
  initCursor();

  // 2. Initialize all interactive scenes & cards
  initInteractions();

  // 3. Sound Toggle & Auto-Unlock on first touch/click
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundLabel = soundToggleBtn?.querySelector('.sound-label');

  function updateSoundUI(isPlaying) {
    if (!soundToggleBtn) return;
    if (isPlaying) {
      soundToggleBtn.classList.add('is-playing');
      if (soundLabel) soundLabel.textContent = 'Sound: On';
    } else {
      soundToggleBtn.classList.remove('is-playing');
      if (soundLabel) soundLabel.textContent = 'Sound: Off';
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isPlaying = sound.toggleMute();
      updateSoundUI(isPlaying);
    });
  }

  // Resume AudioContext on first interaction if suspended by browser autoplay policy
  const unlockAudioContext = () => {
    sound.init();
    window.removeEventListener('click', unlockAudioContext);
    window.removeEventListener('touchstart', unlockAudioContext);
  };
  window.addEventListener('click', unlockAudioContext, { once: true });
  window.addEventListener('touchstart', unlockAudioContext, { once: true });

  // 4. Scroll Progress Indicator
  const progressBar = document.getElementById('experience-progress');
  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const progress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 15), 100);
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });

  // 5. 24-Hour Expiration & Self-Destruct Controller
  // Expires exactly 24 hours from launch: 2026-10-18 08:30:00 IST
  const EXPIRATION_TIMESTAMP = new Date('2026-10-18T08:30:00+05:30').getTime();
  const countdownPill = document.getElementById('countdown-pill');
  const expiredScreen = document.getElementById('expired-screen');
  const urlParams = new URLSearchParams(window.location.search);
  const bypassExpiration = urlParams.get('bypass') === 'true';
  const forceExpired = urlParams.get('expired') === 'true';

  function updateCountdown() {
    const now = Date.now();
    const remaining = EXPIRATION_TIMESTAMP - now;

    if ((remaining <= 0 || forceExpired) && !bypassExpiration) {
      if (countdownPill) countdownPill.textContent = '⏳ Expired';
      if (expiredScreen) expiredScreen.classList.remove('hidden');
      return;
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    if (countdownPill) {
      countdownPill.textContent = `⏳ ${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 6. Playful Console Easter Egg
  console.log(
    '%c PSSST... THIS IS FOR YOU ♡ %c\nHey you menace! Peeking in the console? There are no secrets here, only an unreasonable amount of love.\nHappy birthday! ✨',
    'background: #FF496C; color: #fff; font-size: 14px; font-weight: bold; padding: 4px 10px; border-radius: 4px;',
    'color: #D98DA5; font-size: 12px; margin-top: 6px;'
  );
});

