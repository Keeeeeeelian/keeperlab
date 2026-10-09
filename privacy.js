(() => {
  'use strict';
  const KEY = 'keeperlab-privacy-v1';
  const VERSION = 1;
  const LIFETIME = 180 * 24 * 60 * 60 * 1000;
  const WEBSITE_ID = 'c8ce7437-1e59-4e97-854e-5eff5654879c';
  let choice = null;
  let trackerRequested = false;
  let expiryTimer;
  let returnFocus;

  const doNotTrack = () => [navigator.doNotTrack, navigator.msDoNotTrack, window.doNotTrack]
    .some(value => value === '1' || value === 1 || value === 'yes');
  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      return saved && saved.version === VERSION && typeof saved.analytics === 'boolean'
        && Number.isFinite(saved.expiresAt) && saved.expiresAt > Date.now()
        && saved.expiresAt <= Date.now() + LIFETIME ? saved : null;
    } catch { return null; }
  }
  const allowed = () => choice?.analytics === true && choice.expiresAt > Date.now() && !doNotTrack();

  // Runs for every send, including after withdrawal in another tab or expiry.
  window.keeperlabBeforeSend = (type, payload) => {
    if (!allowed() || type !== 'event' || payload.name || payload.id || payload.data) return false;
    const clean = { ...payload };
    try { clean.url = new URL(payload.url, location.origin).pathname; } catch { return false; }
    try { clean.referrer = payload.referrer ? new URL(payload.referrer).origin : ''; }
    catch { clean.referrer = ''; }
    return clean;
  };

  function startAnalytics() {
    if (!allowed() || trackerRequested) return;
    trackerRequested = true;
    const script = document.createElement('script');
    script.src = 'https://cloud.umami.is/script.js';
    script.defer = true;
    script.dataset.websiteId = WEBSITE_ID;
    script.dataset.domains = 'keeperlab.ch,www.keeperlab.ch';
    script.dataset.excludeSearch = 'true';
    script.dataset.excludeHash = 'true';
    script.dataset.doNotTrack = 'true';
    script.dataset.beforeSend = 'keeperlabBeforeSend';
    document.head.append(script);
  }

  const panel = document.createElement('section');
  panel.className = 'privacy-panel';
  panel.id = 'privacy-preferences';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', 'privacy-title');
  panel.hidden = true;
  panel.innerHTML = `<h2 id="privacy-title">Votre choix, vos statistiques.</h2>
    <p>Avec votre accord, Umami mesure les pages consultées pour améliorer KeeperLab, sans cookies publicitaires. Refuser ne change pas l’accès au site ni à la newsletter.</p>
    <p class="privacy-status" aria-live="polite"></p>
    <div class="privacy-actions"><button type="button" data-choice="refuse">Refuser les statistiques</button><button type="button" data-choice="accept">Accepter les statistiques</button></div>
    <p class="privacy-detail">Choix mémorisé 6 mois sur cet appareil. Modifiable via « Confidentialité &amp; choix » en bas de page. <a href="/mentions-legales.html#statistiques">En savoir plus</a>.</p>`;
  document.body.append(panel);
  const status = panel.querySelector('.privacy-status');
  const acceptButton = panel.querySelector('[data-choice="accept"]');
  function showPanel(focus = false) {
    status.textContent = doNotTrack()
      ? 'Votre navigateur demande de ne pas être suivi : les statistiques restent désactivées.'
      : choice ? `Choix actuel : statistiques ${allowed() ? 'acceptées' : 'refusées'}.` : '';
    acceptButton.disabled = doNotTrack();
    panel.hidden = false;
    if (focus) {
      returnFocus = document.activeElement;
      panel.querySelector('[data-choice="refuse"]').focus();
    }
  }
  function scheduleExpiry() {
    clearTimeout(expiryTimer);
    if (!choice) return;
    expiryTimer = setTimeout(() => {
      if (choice.expiresAt <= Date.now()) {
        choice = null;
        if (trackerRequested) location.reload();
        else showPanel();
      } else scheduleExpiry();
    }, Math.min(choice.expiresAt - Date.now(), 2147483647));
  }
  function choose(analytics) {
    choice = { version: VERSION, analytics, expiresAt: Date.now() + LIFETIME };
    try { localStorage.setItem(KEY, JSON.stringify(choice)); } catch { /* Current-page choice still works. */ }
    panel.hidden = true;
    scheduleExpiry();
    if (!analytics && trackerRequested) {
      // Reload removes the tracker's listeners as well as blocking further sends.
      location.reload();
      return;
    }
    startAnalytics();
    if (returnFocus?.isConnected) returnFocus.focus();
  }
  panel.querySelector('[data-choice="refuse"]').addEventListener('click', () => choose(false));
  acceptButton.addEventListener('click', () => choose(true));
  document.querySelectorAll('[data-privacy-settings]').forEach(link => {
    link.addEventListener('click', event => { event.preventDefault(); showPanel(true); });
  });
  window.addEventListener('storage', event => {
    if (event.key !== KEY && event.key !== null) return;
    choice = readChoice();
    if (!allowed() && trackerRequested) { location.reload(); return; }
    if (!choice) showPanel();
    else { panel.hidden = true; scheduleExpiry(); startAnalytics(); }
  });
  choice = readChoice();
  if (!choice) showPanel();
  scheduleExpiry();
  startAnalytics();
})();
