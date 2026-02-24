# xpeapp_pwd_reset

Petit projet pour gérer la réinitialisation de mot de passe via SSO et backend WordPress.

## Déploiement sur Firebase Hosting

Pour déployer ce site sur le site Firebase `xpeapp-pwd-reset`, construisez d'abord la version de production puis lancez la commande de déploiement ciblée :

```bash
npm run build
firebase deploy --only hosting:xpeapp-pwd-reset
```

Notes :
- Cette commande publiera le contenu du dossier `dist` (configuré dans `firebase.json`) sur le site `xpeapp-pwd-reset`.
- Si vous n'avez pas encore initialisé Firebase dans ce répertoire, lancez `firebase init` et suivez les étapes.
- Assurez-vous d'être authentifié avec le bon compte Firebase (`firebase login`) et d'avoir les droits sur le site cible.
