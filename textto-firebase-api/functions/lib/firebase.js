const admin = require('firebase-admin')
const Firestore = require('firestore-rest')
const path = require('path')

// TODO change out the service account json file here
// if you don't have this file, get it from admin or generate a new one from
// the firebase console => project settings => service accounts => generate a new private key
var serviceAccount = require('../credentials/textto-189ae-firebase-adminsdk-81yy1-89287052ac.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // TODO get the databaseURL from the web credentials and add it here
  databaseURL: 'https://textto-189ae.firebaseio.com'
})

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../credentials/textto-189ae-firebase-adminsdk-81yy1-89287052ac.json')
process.env.GCLOUD_PROJECT = 'textto-189ae'

const db = admin.firestore()
const dbRest = new Firestore()

module.exports = {
  db,
  dbRest,
  admin
}
