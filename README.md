# ParkYuma

Youssef Charafeddine et Maxime Britto
Pour initilaser prisma et creer
le User admin  automatiquement veuillez mettre ces commandes: 
```
npx prisma generate
npx prisma db seed
```
pour faire fonctionner le service mail lors d'une reservation veuillez ajouter ci-dessous dans le .env
```
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="reservationyuma@gmail.com"
EMAIL_SERVER_PASSWORD="ccdbjseepvbgychm"
EMAIL_FROM="ParkYuma <reservationyuma@gmail.com>"
```
