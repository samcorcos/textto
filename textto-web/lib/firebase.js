import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/functions'
import 'firebase/storage'

export const config = {
  apiKey: 'AIzaSyAdpqaQBLwin230AjMmPx1_p2D2hOffKAA',
  authDomain: 'textto-189ae.firebaseapp.com',
  databaseURL: 'https://textto-189ae.firebaseio.com',
  projectId: 'textto-189ae',
  storageBucket: 'textto-189ae.appspot.com',
  messagingSenderId: '607687373981'
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

let functions
if (process.env.NODE_ENV === 'development') {
  // https://stackoverflow.com/questions/50884534/how-to-test-functions-https-oncall-firebase-cloud-functions-locally
  functions = firebase.functions().useFunctionsEmulator('http://localhost:5000')
} else {
  functions = firebase.functions()
}

const db = firebase.firestore()

export {
  functions,
  firebase,
  db
}

export default firebase
