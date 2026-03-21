const APP = {
  defaultLanguage: 'es',
  currentLanguage: 'es',
  deferredInstallPrompt: null,
  currentModule: 'count',
};

const DOM = {
  // language
  langEs: document.getElementById('lang-es'),
  langEn: document.getElementById('lang-en'),

  // navigation
  tileCount: document.getElementById('tile-count'),
  tilePassage: document.getElementById('tile-passage'),

  // top controls
  btnClear: document.getElementById('btn-clear'),
  btnInstall: document.getElementById('install-btn'),
  btnInfo: document.getElementById('btn-info'),

  // sheet
  sheetBackdrop: document.getElementById('sheet-backdrop'),
  sheet: document.getElementById('info-sheet'),
  sheetClose: document.getElementById('sheet-close'),

  // cards
  cardCount: document.getElementById('card-count'),
  cardPassage: document.getElementById('card-passage'),

  // module 1 inputs
  inpVivas: document.getElementById('inpVivas'),
  inpMuertas: document.getElementById('inpMuertas'),
  inpCuadrantes: document.getElementById('inpCuadrantes'),
  inpCuadrantesCustom: document.getElementById('inpCuadrantesCustom'),
  inpDilucion: document.getElementById('inpDilucion'),
  btnCalcCount: document.getElementById('btn-calc-count'),
  btnNeubauerInfo: document.getElementById('btn-neubauer-info'),
  neubauerDetail: document.getElementById('neubauer-detail'),

  // module 1 outputs
  boxResConteo: document.getElementById('boxResConteo'),
  outConc: document.getElementById('outConc'),
  outViability: document.getElementById('outViability'),
  outStatus: document.getElementById('outStatus'),

  // module 2 inputs
  inpC1: document.getElementById('inpC1'),
  inpV2: document.getElementById('inpV2'),
  inpC2: document.getElementById('inpC2'),
  btnCalcPassage: document.getElementById('btn-calc-passage'),

  // module 2 outputs
  boxResInoculo: document.getElementById('boxResInoculo'),
  outV1: document.getElementById('outV1'),
  outFreshMedium: document.getElementById('outFreshMedium'),
};

/* =========================
   Utilities
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

function showResultBox(box, { isError = false } = {}) {
  box.classList.add('visible');
  box.classList.toggle('error', isError);
}

function hideResultBox(box) {
  box.classList.remove('visible', 'error');
}

function setCardValidity(cardElement, isValid) {
  cardElement.classList.toggle('invalid', !isValid);
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

/* =========================
   Module UI
   ========================= */
function showModule(moduleKey) {
  APP.currentModule = moduleKey;

  const isCount = moduleKey === 'count';

  DOM.cardCount.classList.toggle('active', isCount);
  DOM.cardPassage.classList.toggle('active', !isCount);

  DOM.tileCount.classList.toggle('active', isCount);
  DOM.tilePassage.classList.toggle('active', !isCount);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =========================
   Info sheet
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
  const clearCount = () => {
    setCardValidity(DOM.cardCount, true);
    DOM.boxResConteo.classList.remove('error');
  };
  const clearPassage = () => {
    setCardValidity(DOM.cardPassage, true);
    DOM.boxResInoculo.classList.remove('error');
  };

  setupPicker({ pickerId: 'pickerCuadrantes', valueInputId: 'inpCuadrantes',  customInputId: 'inpCuadrantesCustom', onselect: clearCount   });
  setupPicker({ pickerId: 'pickerDilucion',   valueInputId: 'inpDilucion',    customInputId: 'inpDilucion',         onselect: clearCount   });
  setupPicker({ pickerId: 'pickerV2',          valueInputId: 'inpV2',          customInputId: 'inpV2',               onselect: clearPassage });
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
  showModule('count');
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

  // Auto-transfer concentration to module 2
  DOM.inpC1.value = viableConc.toFixed(2);

  showResultBox(DOM.boxResConteo, { isError: false });
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

  // Module switch (tiles only)
  [DOM.tileCount, DOM.tilePassage].filter(Boolean).forEach((btn) => {
    btn.addEventListener('click', () => showModule(btn.dataset.module));
  });

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

  // Clear error styles while typing
  [DOM.inpVivas, DOM.inpMuertas, DOM.inpDilucion].forEach((field) => {
    field.addEventListener('input', () => {
      setCardValidity(DOM.cardCount, true);
      DOM.boxResConteo.classList.remove('error');
    });
  });

  [DOM.inpC1, DOM.inpV2, DOM.inpC2].forEach((field) => {
    field.addEventListener('input', () => {
      setCardValidity(DOM.cardPassage, true);
      DOM.boxResInoculo.classList.remove('error');
    });
  });
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
  setupInstallPrompt();
  setupiOSInstallBanner();
  registerServiceWorker();
  showModule('count');
}

init();
