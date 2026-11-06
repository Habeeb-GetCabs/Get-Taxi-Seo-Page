/**
 * Get Taxi Kovai — Google Ads Click Fraud & Suspicious IP Radar
 * Client-Side Telemetry & Anti-Click-Spam Monitor
 */
(function () {
  if (typeof window === 'undefined') return;

  var startTime = performance.now();
  var urlParams = new URLSearchParams(window.location.search);
  var gclid = urlParams.get('gclid') || '';
  var isGoogleAd = Boolean(gclid || urlParams.get('utm_source') === 'google' || document.referrer.indexOf('google.') !== -1);
  var userInteracted = false;
  var clickEventId = null;
  var userCoords = null;

  // 1. Session & Daily Visit Tracking in LocalStorage
  var todayKey = 'gtk_v_' + new Date().toISOString().slice(0, 10);
  var currentVisits = 1;
  try {
    var storedVisits = parseInt(localStorage.getItem(todayKey) || '0', 10);
    currentVisits = storedVisits + 1;
    localStorage.setItem(todayKey, currentVisits.toString());
  } catch (e) {
    // LocalStorage unavailable/disabled
  }

  // 2. Device Detection
  var ua = navigator.userAgent || '';
  var deviceType = /Mobi|Android|iPhone|iPad/i.test(ua) ? 'mobile' : /Tablet|iPad/i.test(ua) ? 'tablet' : 'desktop';

  // 3. High-Accuracy Location Probe (HTML5 Geolocation)
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        if (pos && pos.coords) {
          userCoords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          // If we got coords after initial beacon, update server
          if (clickEventId) {
            sendUpdateBeacon(false);
          }
        }
      },
      function () {
        // User denied or timeout — graceful fallback to IP Gateway
      },
      { maximumAge: 600000, timeout: 3500, enableHighAccuracy: true }
    );
  }

  // 4. Send Initial Log Beacon
  function sendInitialBeacon() {
    var payload = {
      isGoogleAd: isGoogleAd,
      gclid: gclid,
      source: isGoogleAd ? 'Google Ads Search' : (document.referrer ? 'Referral' : 'Direct'),
      landingPage: window.location.pathname + window.location.search,
      userAgent: ua,
      deviceType: deviceType,
      sessionVisitsToday: currentVisits,
      dwellSeconds: 0,
      coordinates: userCoords,
      interacted: false,
    };

    fetch('/api/security/log-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.entry) {
          clickEventId = data.entry.id;
        }
      })
      .catch(function () {});
  }

  // 5. Send Dwell / Interaction Update
  function sendUpdateBeacon(isUnload) {
    var dwellSec = Math.round((performance.now() - startTime) / 100) / 10;
    var payload = JSON.stringify({
      id: clickEventId,
      dwellSeconds: dwellSec,
      coordinates: userCoords,
      interacted: userInteracted,
    });

    if (isUnload && navigator.sendBeacon) {
      navigator.sendBeacon('/api/security/update-dwell', payload);
    } else {
      fetch('/api/security/update-dwell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(function () {});
    }
  }

  // 6. Interaction Listeners (Call, WhatsApp, Scroll, Forms)
  function markInteraction() {
    if (!userInteracted) {
      userInteracted = true;
      sendUpdateBeacon(false);
    }
  }

  document.addEventListener('scroll', markInteraction, { passive: true, once: true });
  document.addEventListener('touchstart', markInteraction, { passive: true, once: true });

  // Anti-Spam Click Throttle on Call & WhatsApp buttons
  var lastClickTime = 0;
  document.addEventListener('click', function (e) {
    var target = e.target.closest('a[href^="tel:"], a[href*="wa.me"], button[type="submit"]');
    if (target) {
      markInteraction();
      var now = Date.now();
      if (now - lastClickTime < 1000) {
        // Rapid multiple click spam within 1 second detected
        sendUpdateBeacon(false);
      }
      lastClickTime = now;
    }
  });

  // Track unload / visibility changes
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      sendUpdateBeacon(true);
    }
  });

  window.addEventListener('beforeunload', function () {
    sendUpdateBeacon(true);
  });

  // Start tracking
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    sendInitialBeacon();
  } else {
    document.addEventListener('DOMContentLoaded', sendInitialBeacon);
  }
})();
