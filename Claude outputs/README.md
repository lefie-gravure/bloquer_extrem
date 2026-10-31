# bloquer_extrem

Outil pour bloquer une liste de comptes Instagram par lots.

- `index.html` : la liste des comptes, avec un bouton qui ouvre les profils par lots (taille réglable). Les liens Instagram finissent par `#bloquer`.
- `bloquer-instagram.user.js` : script Tampermonkey qui, sur les liens `#bloquer` uniquement, clique sur « … » → « Bloquer » → « Bloquer », ou ferme l'onglet si le compte est déjà bloqué (« Débloquer »).

## Utilisation
1. Installer Tampermonkey, activer « Autoriser les scripts utilisateur » dans Chrome, puis installer `bloquer-instagram.user.js`.
2. Ouvrir `index.html`, autoriser les pop-ups, choisir la taille du lot et cliquer sur « Ouvrir le lot suivant ».
3. Faire une pause entre deux lots pour éviter les limitations d'Instagram.
