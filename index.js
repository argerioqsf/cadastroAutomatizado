var admin = require('firebase-admin');

var serviceAccount = require('./firebase/credenciais/app-meta-d0e38-firebase-adminsdk-0o41a-89b134451c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});