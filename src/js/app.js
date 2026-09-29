const APP = {
  defaultLanguage: 'es',
  currentLanguage: 'es',
  deferredInstallPrompt: null,
  currentModule: 'tally',
  soundEnabled: true,
  tally: {
    live: 0,
    dead: 0,
  },
};

const DOM = {
  // Language
  langEs: document.getElementById('lang-es'),
  langEn: document.getElementById('lang-en'),

  // Navigation tiles
  tileTally: document.getElementById('tile-tally'),
  tileCount: document.getElementById('tile-count'),
  tilePassage: document.getElementById('tile-passage'),

  // Top controls
  btnClear: document.getElementById('btn-clear'),
  btnInstall: document.getElementById('install-btn'),
  btnInfo: document.getElementById('btn-info'),

  // Sheet
  sheetBackdrop: document.getElementById('sheet-backdrop'),
  sheet: document.getElementById('info-sheet'),
  sheetClose: document.getElementById('sheet-close'),

  // Module 0: Physical Tally Counter
  cardTally: document.getElementById('card-tally'),
  dispTotal: document.getElementById('disp-total'),
  dispLive: document.getElementById('disp-live'),
  dispDead: document.getElementById('disp-dead'),
  btnTallyLive: document.getElementById('btn-tally-live'),
  btnTallyDead: document.getElementById('btn-tally-dead'),
  btnUndoLive: document.getElementById('btn-undo-live'),
  btnUndoDead: document.getElementById('btn-undo-dead'),
  btnTallyReset: document.getElementById('btn-tally-reset'),
  btnToggleSound: document.getElementById('btn-toggle-sound'),
  btnTallyNext: document.getElementById('btn-tally-next'),

  // Module 1: Count
  cardCount: document.getElementById('card-count'),
  inpVivas: document.getElementById('inpVivas'),
  inpMuertas: document.getElementById('inpMuertas'),
  inpCuadrantes: document.getElementById('inpCuadrantes'),
  inpCuadrantesCustom: document.getElementById('inpCuadrantesCustom'),
  inpDilucion: document.getElementById('inpDilucion'),
  btnCalcCount: document.getElementById('btn-calc-count'),
  btnNeubauerInfo: document.getElementById('btn-neubauer-info'),
  neubauerDetail: document.getElementById('neubauer-detail'),

  // Module 1 outputs
  boxResConteo: document.getElementById('boxResConteo'),
  outConc: document.getElementById('outConc'),
  outViability: document.getElementById('outViability'),
  outStatus: document.getElementById('outStatus'),

  // Module 2: Passage
  cardPassage: document.getElementById('card-passage'),
  inpC1: document.getElementById('inpC1'),
  inpV2: document.getElementById('inpV2'),
  inpC2: document.getElementById('inpC2'),
  btnCalcPassage: document.getElementById('btn-calc-passage'),

  // Module 2 outputs
  boxResInoculo: document.getElementById('boxResInoculo'),
  outV1: document.getElementById('outV1'),
  outFreshMedium: document.getElementById('outFreshMedium'),
};

/* =========================
   Utilities & Sound Synthesis
   ========================= */

function t(key) {
  const pack = I18N[APP.currentLanguage] || I18N[APP.defaultLanguage];
  return pack[key] ?? key;
}

function parseNumber(inputElement) {
  const value = Number.parseFloat(inputElement.value);
  return Number.isFinite(value) ? value : NaN;
}

function parseInteger(inputElement) {
  const value = Number.parseInt(inputElement.value, 10);
  return Number.isFinite(value) ? value : NaN;
}

function isFiniteNonNegative(value) {
  return Number.isFinite(value) && value >= 0;
}

function isFinitePositive(value) {
  return Number.isFinite(value) && value > 0;
}

function formatFixed(value, decimals = 2) {
  return Number.isFinite(value) ? value.toFixed(decimals) : t('err');
}

function formatDigits(num, digits = 3) {
  const safe = Math.max(0, Math.min(9999, Math.round(num || 0)));
  return String(safe).padStart(digits, '0');
}

function showResultBox(box, { isError = false } = {}) {
  box.classList.add('visible');
  box.classList.toggle('error', isError);
}

function hideResultBox(box) {
  box.classList.remove('visible', 'error');
}

function setCardValidity(cardElement, isValid) {
  if (cardElement) cardElement.classList.toggle('invalid', !isValid);
}

function resetStatusBadge() {
  DOM.outStatus.className = 'badge';
  DOM.outStatus.textContent = t('statusDefault');
}

function setStatusBadge(statusType) {
  DOM.outStatus.className = 'badge';

  if (statusType === 'low') {
    DOM.outStatus.classList.add('low');
    DOM.outStatus.textContent = t('statLow');
    return;
  }

  if (statusType === 'high') {
    DOM.outStatus.classList.add('high');
    DOM.outStatus.textContent = t('statHigh');
    return;
  }

  DOM.outStatus.classList.add('ok');
  DOM.outStatus.textContent = t('statOpt');
}

let audioCtx = null;

function playTallySound(isDead = false) {
  if (!APP.soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const ctx = audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = isDead ? 'sawtooth' : 'triangle';
    const startFreq = isDead ? 880 : 1250;
    const endFreq   = isDead ? 280 : 450;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.035);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isDead ? 950 : 1400, now);
    filter.Q.setValueAtTime(4.0, now);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.040);
  } catch (_) {
    // Audio may be restricted until gesture, safely ignore
  }
}

/* =========================
   Module UI Navigation
   ========================= */

const MODULES = ['tally', 'count', 'passage'];

function showModule(moduleKey) {
  if (!MODULES.includes(moduleKey)) return;
  APP.currentModule = moduleKey;

  DOM.cardTally.classList.toggle('active', moduleKey === 'tally');
  DOM.cardCount.classList.toggle('active', moduleKey === 'count');
  DOM.cardPassage.classList.toggle('active', moduleKey === 'passage');

  DOM.tileTally.classList.toggle('active', moduleKey === 'tally');
  DOM.tileCount.classList.toggle('active', moduleKey === 'count');
  DOM.tilePassage.classList.toggle('active', moduleKey === 'passage');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =========================
   Module 0: Physical Tally Counter
   ========================= */

function updateTallyDisplays() {
  const live = APP.tally.live;
  const dead = APP.tally.dead;
  const total = live + dead;

  if (DOM.dispLive) DOM.dispLive.textContent = formatDigits(live, 3);
  if (DOM.dispDead) DOM.dispDead.textContent = formatDigits(dead, 3);
  if (DOM.dispTotal) DOM.dispTotal.textContent = formatDigits(total, 3);

  DOM.inpVivas.value = live > 0 ? String(live) : '';
  DOM.inpMuertas.value = dead > 0 ? String(dead) : '';

  autoCalculateCount();
}

function addLive() {
  APP.tally.live += 1;
  updateTallyDisplays();
  playTallySound(false);
  if ('vibrate' in navigator) {
    try { navigator.vibrate(18); } catch (_) {}
  }
}

function addDead() {
  APP.tally.dead += 1;
  updateTallyDisplays();
  playTallySound(true);
  if ('vibrate' in navigator) {
    try { navigator.vibrate(24); } catch (_) {}
  }
}

function undoLive() {
  if (APP.tally.live > 0) {
    APP.tally.live -= 1;
    updateTallyDisplays();
  }
}

function undoDead() {
  if (APP.tally.dead > 0) {
    APP.tally.dead -= 1;
    updateTallyDisplays();
  }
}

function resetTally() {
  APP.tally.live = 0;
  APP.tally.dead = 0;
  updateTallyDisplays();
  resetCountOutputs();
  resetPassageOutputs();
}

function toggleSound() {
  APP.soundEnabled = !APP.soundEnabled;
  DOM.btnToggleSound.classList.toggle('active', APP.soundEnabled);
  DOM.btnToggleSound.textContent = APP.soundEnabled ? '🔊' : '🔇';
}

/* =========================
   Info Sheet
   ========================= */

function openSheet() {
  DOM.sheetBackdrop.classList.add('open');
  DOM.sheetBackdrop.setAttribute('aria-hidden', 'false');
}

function closeSheet() {
  DOM.sheetBackdrop.classList.remove('open');
  DOM.sheetBackdrop.setAttribute('aria-hidden', 'true');
}

/* =========================
   Pickers
   ========================= */

function setupPicker({ pickerId, valueInputId, customInputId, onselect }) {
  const picker = document.getElementById(pickerId);
  if (!picker) return;

  const valueInput  = document.getElementById(valueInputId);
  const customInput = customInputId ? document.getElementById(customInputId) : null;
  const isDual      = customInput && customInput === valueInput;

  const btns = Array.from(picker.querySelectorAll('.picker-opt'));

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (btn.dataset.value === 'custom') {
        if (customInput) { customInput.hidden = false; customInput.focus(); }
      } else {
        if (customInput) customInput.hidden = true;
        valueInput.value = btn.dataset.value;
      }

      if (onselect) onselect();
    });
  });

  if (customInput && !isDual) {
    customInput.addEventListener('input', () => {
      valueInput.value = customInput.value;
      if (onselect) onselect();
    });
  }
  if (customInput && isDual) {
    customInput.addEventListener('input', () => { if (onselect) onselect(); });
  }
}

function resetPicker(pickerId, defaultVal, customInput) {
  const picker = document.getElementById(pickerId);
  if (!picker) return;
  picker.querySelectorAll('.picker-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === String(defaultVal));
  });
  if (customInput) { customInput.hidden = true; customInput.value = ''; }
}

function setupPickers() {
  setupPicker({ pickerId: 'pickerCuadrantes', valueInputId: 'inpCuadrantes', customInputId: 'inpCuadrantesCustom', onselect: autoCalculateCount   });
  setupPicker({ pickerId: 'pickerDilucion',   valueInputId: 'inpDilucion',   customInputId: 'inpDilucion',         onselect: autoCalculateCount   });
  setupPicker({ pickerId: 'pickerV2',         valueInputId: 'inpV2',         customInputId: 'inpV2',               onselect: autoCalculatePassage });
}

/* =========================
   Reset
   ========================= */

function resetCountOutputs() {
  DOM.outConc.textContent = '---';
  DOM.outViability.textContent = '---';
  resetStatusBadge();
  hideResultBox(DOM.boxResConteo);
  setCardValidity(DOM.cardCount, true);
}

function resetPassageOutputs() {
  DOM.outV1.textContent = '---';
  DOM.outFreshMedium.textContent = '---';
  hideResultBox(DOM.boxResInoculo);
  setCardValidity(DOM.cardPassage, true);
}

function resetAllOutputs() {
  resetCountOutputs();
  resetPassageOutputs();
}

function resetInputs() {
  APP.tally.live = 0;
  APP.tally.dead = 0;
  if (DOM.dispLive) DOM.dispLive.textContent = '000';
  if (DOM.dispDead) DOM.dispDead.textContent = '000';
  if (DOM.dispTotal) DOM.dispTotal.textContent = '000';

  DOM.inpVivas.value   = '';
  DOM.inpMuertas.value = '';

  resetPicker('pickerCuadrantes', '10', DOM.inpCuadrantesCustom);
  DOM.inpCuadrantes.value = '10';

  resetPicker('pickerDilucion', '2', DOM.inpDilucion);
  DOM.inpDilucion.value = '2';

  DOM.inpC1.value = '';
  DOM.inpC1.placeholder = t('placeholderC1');

  resetPicker('pickerV2', '25', DOM.inpV2);
  DOM.inpV2.value = '25';

  DOM.inpC2.value = '0.3';
}

function resetApp() {
  resetInputs();
  resetAllOutputs();
  showModule('tally');
}

/* =========================
   Module 1: Cell Count
   =========================
   Neubauer 0.1mm:
   cell/mL = (cells/squares) × dilution × 10,000
   report in x10^6 cells/mL:
   x10^6 cell/mL = (cells/squares) × dilution × 0.01
*/
function analyzeCount() {
  const live     = parseInteger(DOM.inpVivas);
  const dead     = parseInteger(DOM.inpMuertas);
  const squares  = parseInteger(DOM.inpCuadrantes);
  const dilution = parseNumber(DOM.inpDilucion);

  const inputsValid =
    isFiniteNonNegative(live) &&
    isFiniteNonNegative(dead) &&
    isFinitePositive(squares) &&
    isFinitePositive(dilution);

  setCardValidity(DOM.cardCount, inputsValid);

  if (!inputsValid) {
    DOM.outConc.textContent = t('err');
    DOM.outViability.textContent = t('err');
    resetStatusBadge();
    showResultBox(DOM.boxResConteo, { isError: true });
    return;
  }

  const total = live + dead;
  if (total <= 0) {
    DOM.outConc.textContent = t('err');
    DOM.outViability.textContent = t('err');
    resetStatusBadge();
    showResultBox(DOM.boxResConteo, { isError: true });
    return;
  }

  const viableConc    = (live / squares) * dilution * 0.01; // x10^6 cells/mL
  const viabilityPct  = (live / total) * 100;

  DOM.outConc.textContent       = formatFixed(viableConc, 2);
  DOM.outViability.textContent  = `${formatFixed(viabilityPct, 1)}%`;

  const minTotal = squares * 10;
  const maxTotal = squares * 50;

  if (total < minTotal)       setStatusBadge('low');
  else if (total > maxTotal)  setStatusBadge('high');
  else                        setStatusBadge('ok');

  // Auto-transfer concentration to module 2 and recalculate passage
  DOM.inpC1.value = viableConc.toFixed(2);
  calculatePassage();

  showResultBox(DOM.boxResConteo, { isError: false });
}

function autoCalculateCount() {
  setCardValidity(DOM.cardCount, true);
  DOM.boxResConteo.classList.remove('error');

  const liveStr = DOM.inpVivas.value.trim();
  const deadStr = DOM.inpMuertas.value.trim();

  // Keep tally displays in sync if input changed manually
  const liveInt = parseInteger(DOM.inpVivas) || 0;
  const deadInt = parseInteger(DOM.inpMuertas) || 0;
  APP.tally.live = liveInt;
  APP.tally.dead = deadInt;
  if (DOM.dispLive) DOM.dispLive.textContent = formatDigits(liveInt, 3);
  if (DOM.dispDead) DOM.dispDead.textContent = formatDigits(deadInt, 3);
  if (DOM.dispTotal) DOM.dispTotal.textContent = formatDigits(liveInt + deadInt, 3);

  // If both inputs are blank, keep outputs clean
  if (liveStr === '' && deadStr === '') {
    resetCountOutputs();
    return;
  }

  const squares = parseInteger(DOM.inpCuadrantes);
  const dilution = parseNumber(DOM.inpDilucion);

  const inputsValid =
    isFiniteNonNegative(liveInt) &&
    isFiniteNonNegative(deadInt) &&
    isFinitePositive(squares) &&
    isFinitePositive(dilution);

  if (!inputsValid) return;

  const total = liveInt + deadInt;
  if (total <= 0) return;

  analyzeCount();
}

/* =========================
   Module 2: Passage / Inoculum
   =========================
   C1V1 = C2V2  =>  V1 = (C2 × V2) / C1
*/
function calculatePassage() {
  const c1 = parseNumber(DOM.inpC1);
  const v2 = parseNumber(DOM.inpV2);
  const c2 = parseNumber(DOM.inpC2);

  const basicInputsValid = isFinitePositive(c1) && isFinitePositive(v2) && isFinitePositive(c2);
  setCardValidity(DOM.cardPassage, basicInputsValid);

  if (!basicInputsValid) {
    DOM.outV1.textContent = t('err');
    DOM.outFreshMedium.textContent = t('err');
    showResultBox(DOM.boxResInoculo, { isError: true });
    return;
  }

  if (c1 <= c2) {
    DOM.outV1.textContent = t('err');
    DOM.outFreshMedium.textContent = t('err');
    setCardValidity(DOM.cardPassage, false);
    showResultBox(DOM.boxResInoculo, { isError: true });
    return;
  }

  const v1          = (c2 * v2) / c1;
  const freshMedium = v2 - v1;

  DOM.outV1.textContent          = formatFixed(v1, 3);
  DOM.outFreshMedium.textContent = formatFixed(freshMedium, 3);

  showResultBox(DOM.boxResInoculo, { isError: false });
}

function autoCalculatePassage() {
  setCardValidity(DOM.cardPassage, true);
  DOM.boxResInoculo.classList.remove('error');

  const c1 = parseNumber(DOM.inpC1);
  const v2 = parseNumber(DOM.inpV2);
  const c2 = parseNumber(DOM.inpC2);

  if (isFinitePositive(c1) && isFinitePositive(v2) && isFinitePositive(c2) && c1 > c2) {
    calculatePassage();
  }
}

/* =========================
   Internationalization (i18n)
   ========================= */

function applyTranslations(language) {
  const pack = I18N[language] || I18N[APP.defaultLanguage];

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    if (pack[key]) node.innerHTML = pack[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    const key = node.getAttribute('data-i18n-placeholder');
    if (pack[key]) node.setAttribute('placeholder', pack[key]);
  });

  DOM.langEs.classList.toggle('active', language === 'es');
  DOM.langEn.classList.toggle('active', language === 'en');
  DOM.langEs.setAttribute('aria-selected', String(language === 'es'));
  DOM.langEn.setAttribute('aria-selected', String(language === 'en'));

  DOM.inpC1.placeholder = pack.placeholderC1 || '';
}

function setLanguage(language) {
  if (!I18N[language]) return;
  APP.currentLanguage = language;
  applyTranslations(language);

  try { localStorage.setItem('cellsplit_lang', language); } catch (_) { /* no-op */ }
}

function loadSavedLanguage() {
  try {
    const saved = localStorage.getItem('cellsplit_lang');
    if (saved && I18N[saved]) APP.currentLanguage = saved;
  } catch (_) { /* no-op */ }
}

/* =========================
   PWA Install + Service Worker
   ========================= */

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    APP.deferredInstallPrompt = event;
    DOM.btnInstall.hidden = false;
  });

  DOM.btnInstall.addEventListener('click', async () => {
    if (!APP.deferredInstallPrompt) return;
    APP.deferredInstallPrompt.prompt();
    APP.deferredInstallPrompt = null;
    DOM.btnInstall.hidden = true;
  });
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.warn('SW registration failed:', error);
    });
  });
}

/* =========================
   iOS Install Banner
   ========================= */

function setupiOSInstallBanner() {
  const isIOS       = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = navigator.standalone === true;
  const dismissed   = (() => { try { return localStorage.getItem('cs_ios_banner'); } catch (_) {} return null; })();

  if (!isIOS || isStandalone || dismissed) return;

  const banner = document.getElementById('ios-install-banner');
  if (banner) banner.classList.add('visible');

  document.getElementById('btn-ios-dismiss')?.addEventListener('click', () => {
    banner?.classList.remove('visible');
    try { localStorage.setItem('cs_ios_banner', '1'); } catch (_) {}
  });
}

/* =========================
   Event Binding
   ========================= */

function bindEvents() {
  // Language toggles
  DOM.langEs.addEventListener('click', () => setLanguage('es'));
  DOM.langEn.addEventListener('click', () => setLanguage('en'));

  // Module switch via tiles
  [DOM.tileTally, DOM.tileCount, DOM.tilePassage].filter(Boolean).forEach((btn) => {
    btn.addEventListener('click', () => showModule(btn.dataset.module));
  });

  // Module 0 Tally clickers & controls
  DOM.btnTallyLive?.addEventListener('click', addLive);
  DOM.btnTallyDead?.addEventListener('click', addDead);
  DOM.btnUndoLive?.addEventListener('click', undoLive);
  DOM.btnUndoDead?.addEventListener('click', undoDead);
  DOM.btnTallyReset?.addEventListener('click', resetTally);
  DOM.btnToggleSound?.addEventListener('click', toggleSound);
  DOM.btnTallyNext?.addEventListener('click', () => showModule('count'));

  // Actions
  DOM.btnClear.addEventListener('click', resetApp);
  DOM.btnCalcCount.addEventListener('click', analyzeCount);
  DOM.btnCalcPassage.addEventListener('click', calculatePassage);

  // Enter key inside cards
  DOM.cardCount.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); analyzeCount(); }
  });
  DOM.cardPassage.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); calculatePassage(); }
  });

  // Sheet
  DOM.btnInfo.addEventListener('click', openSheet);
  DOM.sheetClose.addEventListener('click', closeSheet);
  DOM.sheetBackdrop.addEventListener('click', (e) => { if (e.target === DOM.sheetBackdrop) closeSheet(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

  // Neubauer detail toggle
  DOM.btnNeubauerInfo.addEventListener('click', () => {
    const isHidden = DOM.neubauerDetail.hidden;
    DOM.neubauerDetail.hidden = !isHidden;
    DOM.btnNeubauerInfo.setAttribute('aria-expanded', String(isHidden));
  });

  // Live reactive calculations
  [DOM.inpVivas, DOM.inpMuertas].forEach((field) => {
    field.addEventListener('input', autoCalculateCount);
  });

  [DOM.inpC1, DOM.inpV2, DOM.inpC2].forEach((field) => {
    field.addEventListener('input', autoCalculatePassage);
  });

  // Keyboard counting shortcuts when on tally screen
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

    if (APP.currentModule === 'tally') {
      if (e.key === 'v' || e.key === 'V' || e.key === 'l' || e.key === 'L' || e.key === '1' || e.key === 'ArrowUp') {
        e.preventDefault();
        addLive();
      } else if (e.key === 'm' || e.key === 'M' || e.key === 'd' || e.key === 'D' || e.key === '2' || e.key === 'ArrowDown') {
        e.preventDefault();
        addDead();
      } else if (e.key === 'z' || e.key === 'Z' || e.key === 'Backspace') {
        e.preventDefault();
        undoLive();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        showModule('count');
      }
    }
  });
}

/* =========================
   Touch Swipe Navigation (with boundaries / topes)
   ========================= */

function triggerTopeBounce(element, direction) {
  if (!element) return;
  const cls = direction === 'left' ? 'tope-bounce-left' : 'tope-bounce-right';
  element.classList.remove('tope-bounce-left', 'tope-bounce-right');
  void element.offsetWidth; // trigger reflow
  element.classList.add(cls);
}

function setupSwipeNavigation() {
  let startX = 0;
  let startY = 0;
  let startTime = 0;

  document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (e.changedTouches.length !== 1) return;
    if (DOM.sheetBackdrop && DOM.sheetBackdrop.classList.contains('open')) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = Date.now() - startTime;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Require horizontal swipe: >= 45px distance, predominantly horizontal, within 800ms
    if (deltaTime > 800) return;
    if (absX < 45 || absX <= absY * 1.35) return;

    if (APP.currentModule === 'tally') {
      if (deltaX < -45) {
        // Swipe left -> advance to Module 2 (Count)
        showModule('count');
      } else if (deltaX > 45) {
        // Swipe right -> TOPE (already on leftmost module)
        triggerTopeBounce(DOM.cardTally, 'left');
      }
    } else if (APP.currentModule === 'count') {
      if (deltaX < -45) {
        // Swipe left -> advance to Module 3 (Passage)
        showModule('passage');
      } else if (deltaX > 45) {
        // Swipe right -> return to Module 1 (Tally)
        showModule('tally');
      }
    } else if (APP.currentModule === 'passage') {
      if (deltaX > 45) {
        // Swipe right -> return to Module 2 (Count)
        showModule('count');
      } else if (deltaX < -45) {
        // Swipe left -> TOPE (already on rightmost module)
        triggerTopeBounce(DOM.cardPassage, 'right');
      }
    }
  }, { passive: true });
}

/* =========================
   App Init
   ========================= */

function init() {
  loadSavedLanguage();
  applyTranslations(APP.currentLanguage);
  resetAllOutputs();
  setupPickers();
  bindEvents();
  setupSwipeNavigation();
  setupInstallPrompt();
  setupiOSInstallBanner();
  registerServiceWorker();
  showModule('tally');
}

init();
