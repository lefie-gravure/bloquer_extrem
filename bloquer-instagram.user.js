// ==UserScript==
// @name         Léfie - Blocage Instagram (liens #bloquer)
// @namespace    lefie
// @version      1.2
// @description  Bloque automatiquement le profil Instagram ouvert, uniquement si le lien se termine par #bloquer
// @match        https://www.instagram.com/*
// @run-at       document-start
// @grant        window.close
// ==/UserScript==

(function () {
  'use strict';

  // Ne s'active QUE sur les liens se terminant par #bloquer
  if (!location.href.includes('#bloquer')) return;

  const FERMER_ONGLET = true;   // ferme l'onglet à la fin (false pour le garder)
  const DELAI_MAX = 15000;      // abandon après 15 s si un élément n'apparaît pas

  const pause = (min, max) => new Promise(r => setTimeout(r, min + Math.random() * (max - min)));
  const texte = el => (el.textContent || '').trim();

  function attendre(trouver) {
    return new Promise((ok, ko) => {
      const t0 = Date.now();
      (function boucle() {
        const el = trouver();
        if (el) return ok(el);
        if (Date.now() - t0 > DELAI_MAX) return ko();
        setTimeout(boucle, 300);
      })();
    });
  }

  // Badge en haut à droite : indique l'étape en cours (utile si ça bloque)
  let b;
  function badge(msg, couleur = '#555') {
    if (!b) {
      b = document.createElement('div');
      b.style.cssText = 'position:fixed;top:12px;right:12px;z-index:2147483647;padding:10px 14px;border-radius:8px;font:600 14px system-ui;color:#fff';
      document.body.appendChild(b);
    }
    b.textContent = 'Blocage : ' + msg;
    b.style.background = couleur;
  }

  function fermer(delai) {
    if (!FERMER_ONGLET) return;
    setTimeout(() => {
      window.close();
      // Si le navigateur refuse de fermer (onglet ouvert autrement que par la page)
      setTimeout(() => badge(b.textContent.replace('Blocage : ', '') + ' — ferme l\'onglet', '#2e7d32'), 500);
    }, delai);
  }

  // Cherche un texte exact dans les plus petits éléments de la page (hors boutons si demandé)
  function trouverTexte(mots, horsBouton) {
    return [...document.querySelectorAll('span, div[role="button"], button')]
      .filter(el => !el.querySelector('span, div'))          // élément "feuille"
      .find(el => mots.includes(texte(el)) && (!horsBouton || !el.closest('button')));
  }

  async function lancer() {
    try {
      badge('recherche du bouton « … »');
      const options = await attendre(() =>
        document.querySelector('header svg[aria-label="Options"]') ||
        document.querySelector('svg[aria-label="Options"]'));
      await pause(800, 1500);
      (options.closest('[role="button"], button') || options.parentElement).click();

      badge('menu ouvert, recherche de « Bloquer »');
      const item = await attendre(() => trouverTexte(['Bloquer', 'Débloquer'], true));

      if (texte(item) === 'Débloquer') {
        badge('déjà bloqué ✓', '#2e7d32');
        fermer(1500);
        return;
      }

      await pause(700, 1300);
      (item.closest('[role="button"]') || item).click();

      badge('confirmation');
      const confirmer = await attendre(() =>
        [...document.querySelectorAll('button')].find(x => texte(x) === 'Bloquer'));
      await pause(700, 1300);
      confirmer.click();

      badge('bloqué ✓', '#2e7d32');
      fermer(2500);
    } catch (e) {
      badge((b ? b.textContent.replace('Blocage : ', '') : '') + ' → échec, à faire à la main', '#c62828');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', lancer);
  else lancer();
})();
