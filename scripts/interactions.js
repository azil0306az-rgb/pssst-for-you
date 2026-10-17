/**
 * COMPLETE SCENE INTERACTIONS & SCRAPBOOK LOGIC
 * "PSSST... THIS IS FOR YOU"
 */

import { sound } from './audio.js';
import { particles } from './particles.js';

export function initInteractions() {
  let isGiftOpened = false;
  let loveTapCount = 0;

  // Cache elements
  const giftBoxBtn = document.getElementById('gift-box-btn');
  const flashOverlay = document.getElementById('opening-flash');
  const scrollToLetterBtn = document.getElementById('scroll-to-letter-btn');
  const letterSheet = document.getElementById('letter-sheet');
  const paras = document.querySelectorAll('.letter-para');

  // Hidden scenes to reveal after opening the gift
  const revealScene = document.getElementById('scene-reveal');
  const letterScene = document.getElementById('scene-letter');
  const chaosScene = document.getElementById('scene-chaos');
  const wishesScene = document.getElementById('scene-wishes');
  const finaleScene = document.getElementById('scene-finale');

  // Chaos Cards
  const cardEnvelope = document.getElementById('card-envelope');
  const cardTrophy = document.getElementById('card-trophy');
  const acceptAwardBtn = document.getElementById('accept-award-btn');
  const cardSecret = document.getElementById('card-secret');
  const lockBadge = document.getElementById('lock-state-badge');
  const chestPrompt = document.getElementById('chest-prompt');
  const tapHeartBtn = document.getElementById('tap-heart-btn');
  const loveDynamicText = document.getElementById('love-dynamic-text');
  const loveBadge = document.getElementById('love-counter-badge');

  // Wishes
  const wishCards = document.querySelectorAll('.wish-card');

  // Easter Egg Modal
  const easterEggBtn = document.getElementById('easter-egg-btn');
  const easterEggModal = document.getElementById('easter-egg-modal');
  const easterModalBackdrop = document.getElementById('easter-modal-backdrop');
  const closeEasterBtn = document.getElementById('close-easter-egg-btn');

  // Finale Wish Orb
  const triggerWishBtn = document.getElementById('trigger-wish-btn');
  const wishOrbStage = document.getElementById('wish-orb-stage');
  const confirmWishBtn = document.getElementById('confirm-wish-btn');
  const wishGrantedBanner = document.getElementById('wish-granted-banner');
  const replayBtn = document.getElementById('replay-btn');

  // =========================================================================
  // 1. SCENE TWO: 3D GIFT INTERACTIONS
  // =========================================================================
  if (giftBoxBtn) {
    // 3D Tilt on Mouse Movement
    const giftWrapper = document.getElementById('gift-wrapper');
    if (giftWrapper) {
      giftWrapper.addEventListener('mousemove', (e) => {
        if (isGiftOpened) return;
        const rect = giftBoxBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        giftBoxBtn.style.transform = `rotateX(${-16 - deltaY * 12}deg) rotateY(${22 + deltaX * 16}deg) scale(1.05)`;
      });

      giftWrapper.addEventListener('mouseleave', () => {
        if (isGiftOpened) return;
        giftBoxBtn.style.transform = 'rotateX(-16deg) rotateY(22deg)';
      });
    }

    // Tap to open gift
    giftBoxBtn.addEventListener('click', () => {
      if (isGiftOpened) return;
      isGiftOpened = true;

      // Playful shake
      giftBoxBtn.classList.add('shaking');
      sound.playChime(440);

      setTimeout(() => {
        giftBoxBtn.classList.remove('shaking');
        giftBoxBtn.classList.add('opened');

        // Sound effect
        sound.playGiftOpening();

        // Particle explosion
        const rect = giftBoxBtn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        particles.triggerConfetti(x, y, 90);
        particles.triggerHeartBurst(x, y, 20);

        // Flash of warm light
        if (flashOverlay) {
          flashOverlay.classList.add('active');
          setTimeout(() => flashOverlay.classList.remove('active'), 450);
        }

        // Transform background & reveal subsequent scenes
        document.body.classList.add('theme-reveal');

        setTimeout(() => {
          [revealScene, letterScene, chaosScene, wishesScene, finaleScene].forEach(el => {
            if (el) el.classList.remove('scene-hidden');
          });

          // Smooth scroll into the reveal scene
          if (revealScene) {
            revealScene.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }, 700);
    });
  }

  // =========================================================================
  // 2. SCENE THREE & FOUR: SCROLL TO LETTER & PARAGRAPH OBSERVER
  // =========================================================================
  if (scrollToLetterBtn && letterScene) {
    scrollToLetterBtn.addEventListener('click', () => {
      sound.playChime(523.25);
      letterScene.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Reveal letter paragraphs sequentially
  if (paras.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          paras.forEach((p, idx) => {
            setTimeout(() => {
              p.classList.add('visible');
            }, idx * 450);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    if (letterSheet) {
      observer.observe(letterSheet);
    }
  }

  // =========================================================================
  // 3. SCENE FIVE: THE CHAOS ZONE
  // =========================================================================

  // Card 1: Envelope
  if (cardEnvelope) {
    cardEnvelope.addEventListener('click', (e) => {
      const isAlreadyOpen = cardEnvelope.classList.contains('open');
      if (!isAlreadyOpen) {
        cardEnvelope.classList.add('open');
        cardEnvelope.setAttribute('aria-expanded', 'true');
        sound.playEnvelope();
        const rect = cardEnvelope.getBoundingClientRect();
        particles.triggerHeartBurst(rect.left + rect.width / 2, rect.top + 60, 10);
      } else {
        cardEnvelope.classList.remove('open');
        cardEnvelope.setAttribute('aria-expanded', 'false');
      }
    });

    cardEnvelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        cardEnvelope.click();
      }
    });
  }

  // Card 2: Award Trophy
  function triggerAwardCelebration(e) {
    if (e) e.stopPropagation();
    sound.playAward();
    const rect = cardTrophy.getBoundingClientRect();
    particles.triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 75);
    
    // Add glowing animation to trophy
    const cup = cardTrophy.querySelector('.trophy-cup');
    if (cup) {
      cup.style.transform = 'scale(1.28) rotate(-10deg)';
      setTimeout(() => {
        cup.style.transform = '';
      }, 600);
    }
  }

  if (cardTrophy) {
    cardTrophy.addEventListener('click', triggerAwardCelebration);
    cardTrophy.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerAwardCelebration(e);
      }
    });
  }
  if (acceptAwardBtn) {
    acceptAwardBtn.addEventListener('click', triggerAwardCelebration);
  }

  // Card 3: Unlock Secret Chest
  if (cardSecret) {
    cardSecret.addEventListener('click', () => {
      const isUnlocked = cardSecret.classList.contains('unlocked');
      if (!isUnlocked) {
        cardSecret.classList.add('unlocked');
        cardSecret.setAttribute('aria-expanded', 'true');
        if (lockBadge) lockBadge.textContent = 'UNLOCKED 🔓';
        if (chestPrompt) chestPrompt.textContent = 'Vault unlocked with love';
        sound.playUnlock();
        
        const rect = cardSecret.getBoundingClientRect();
        particles.triggerConfetti(rect.left + rect.width / 2, rect.top + 50, 40);
      } else {
        cardSecret.classList.remove('unlocked');
        cardSecret.setAttribute('aria-expanded', 'false');
        if (lockBadge) lockBadge.textContent = 'LOCKED 🔒';
        if (chestPrompt) chestPrompt.textContent = 'Tap chest to unlock the vault';
      }
    });

    cardSecret.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        cardSecret.click();
      }
    });
  }

  // Card 4: Tap If You Love Me
  const loveMessages = [
    "I KNEW IT.",
    "ADMIT IT, I'M YOUR FAVORITE.",
    "SCREENSHOT THIS. IT'S LEGALLY BINDING.",
    "TOO LATE. BEST FRIEND CONTRACT ACTIVATED.",
    "CONGRATULATIONS. YOU ARE STUCK WITH ME FOREVER. ♡"
  ];

  if (tapHeartBtn) {
    const handleHeartTap = (e) => {
      if (e) e.stopPropagation();
      loveTapCount++;
      sound.playHeartTap(loveTapCount);

      if (loveBadge) {
        loveBadge.textContent = `Taps: ${loveTapCount}`;
      }

      // Dynamic scale bounce
      const scaleFactor = Math.min(1 + loveTapCount * 0.08, 1.6);
      tapHeartBtn.style.transform = `scale(${scaleFactor})`;
      setTimeout(() => {
        tapHeartBtn.style.transform = `scale(${Math.min(1 + loveTapCount * 0.04, 1.4)})`;
      }, 150);

      // Trigger rising hearts
      const rect = tapHeartBtn.getBoundingClientRect();
      particles.triggerHeartBurst(rect.left + rect.width / 2, rect.top, 8);

      // Update text
      if (loveDynamicText) {
        const msgIndex = Math.min(loveTapCount - 1, loveMessages.length - 1);
        loveDynamicText.textContent = loveMessages[msgIndex];
        loveDynamicText.style.color = '#FF496C';
      }
    };

    tapHeartBtn.addEventListener('click', handleHeartTap);
    const cardLove = document.getElementById('card-love-meter');
    if (cardLove) {
      cardLove.addEventListener('click', handleHeartTap);
    }
  }

  // =========================================================================
  // 4. SCENE SIX: BIRTHDAY WISH GENERATOR (3 BLESSINGS)
  // =========================================================================
  wishCards.forEach(card => {
    card.addEventListener('click', () => {
      const isRevealed = card.classList.contains('revealed');
      if (!isRevealed) {
        card.classList.add('revealed');
        card.setAttribute('aria-expanded', 'true');
        sound.playChime(783.99);
        const rect = card.getBoundingClientRect();
        particles.triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
      } else {
        card.classList.remove('revealed');
        card.setAttribute('aria-expanded', 'false');
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // =========================================================================
  // 5. SCENE SEVEN: HIDDEN EASTER EGG MODAL
  // =========================================================================
  function openEasterEgg() {
    if (!easterEggModal) return;
    easterEggModal.classList.remove('hidden');
    sound.playChime(880);
    particles.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 45);
  }

  function closeEasterEgg() {
    if (!easterEggModal) return;
    easterEggModal.classList.add('hidden');
    sound.playChime(659.25);
    particles.triggerHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 16);
  }

  if (easterEggBtn) {
    easterEggBtn.addEventListener('click', openEasterEgg);
  }
  if (closeEasterBtn) {
    closeEasterBtn.addEventListener('click', closeEasterEgg);
  }
  if (easterModalBackdrop) {
    easterModalBackdrop.addEventListener('click', closeEasterEgg);
  }

  // =========================================================================
  // 6. SCENE EIGHT: GRAND FINALE & REPLAY
  // =========================================================================
  if (triggerWishBtn && wishOrbStage) {
    triggerWishBtn.addEventListener('click', () => {
      triggerWishBtn.style.display = 'none';
      wishOrbStage.classList.remove('hidden');
      sound.playWishOrb();
      const rect = wishOrbStage.getBoundingClientRect();
      particles.triggerConfetti(rect.left + rect.width / 2, rect.top + 70, 30);
    });
  }

  if (confirmWishBtn && wishGrantedBanner) {
    confirmWishBtn.addEventListener('click', () => {
      wishOrbStage.classList.add('hidden');
      wishGrantedBanner.classList.remove('hidden');
      sound.playWishGranted();
      particles.triggerFinaleCelebration();
    });
  }

  // Smooth Replay Reset
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      sound.playChime(523.25);

      // Reset gift state
      isGiftOpened = false;
      if (giftBoxBtn) {
        giftBoxBtn.classList.remove('opened', 'shaking');
        giftBoxBtn.style.transform = 'rotateX(-16deg) rotateY(22deg)';
      }

      // Reset Chaos cards
      if (cardEnvelope) cardEnvelope.classList.remove('open');
      if (cardSecret) {
        cardSecret.classList.remove('unlocked');
        if (lockBadge) lockBadge.textContent = 'LOCKED 🔒';
        if (chestPrompt) chestPrompt.textContent = 'Tap chest to unlock the vault';
      }
      loveTapCount = 0;
      if (loveBadge) loveBadge.textContent = 'Taps: 0';
      if (tapHeartBtn) tapHeartBtn.style.transform = '';
      if (loveDynamicText) {
        loveDynamicText.textContent = "Go ahead, tap it. I dare you.";
        loveDynamicText.style.color = '';
      }

      // Reset Wishes
      wishCards.forEach(c => c.classList.remove('revealed'));

      // Reset finale wish orb
      if (triggerWishBtn) triggerWishBtn.style.display = 'inline-flex';
      if (wishOrbStage) wishOrbStage.classList.add('hidden');
      if (wishGrantedBanner) wishGrantedBanner.classList.add('hidden');

      // Scroll smoothly back to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

