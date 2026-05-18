
## Objectif
Faire partir réellement les emails des campagnes depuis `yemdjijoel@gmail.com` en utilisant Gmail SMTP (mot de passe d'application fourni), à la place de Resend.

## Étapes

1. **Ajouter 3 secrets backend** (via le formulaire sécurisé) :
   - `GMAIL_USER` = `yemdjijoel@gmail.com`
   - `GMAIL_APP_PASSWORD` = `izzj eqcz wbtz ofgj` (les espaces sont acceptés par Gmail)
   - `GMAIL_FROM_NAME` = `SmartCom PME`

2. **Installer `nodemailer`** (`bun add nodemailer @types/nodemailer`) — compatible avec le runtime serveur TanStack.

3. **Réécrire `src/lib/campaigns.functions.ts`** :
   - Remplacer l'appel HTTP Resend par un transporteur Nodemailer SMTP (`smtp.gmail.com:465`, secure, auth user/app password).
   - Garder la même logique : lire la campagne, parcourir les destinataires `pending`, envoyer l'email (HTML conservé), mettre à jour `campaign_recipients.status` (`sent`/`failed`), mettre à jour `campaigns.status` + `sent_count` + `sent_at`.
   - Sujet = `campaign.subject || campaign.name`. From = `"SmartCom PME" <yemdjijoel@gmail.com>`.
   - Conserver le mode démo (simulation) si les secrets ne sont pas présents.

4. **Vérification** : invoquer la server function sur une campagne test pour confirmer la livraison réelle, puis consulter les logs.

## Notes
- Le compte Gmail doit avoir la validation en 2 étapes activée (déjà fait puisque le mot de passe d'application existe).
- Limite Gmail : ~500 destinataires/jour par compte. Suffisant pour une démo de soutenance.
- Aucune migration DB nécessaire.
