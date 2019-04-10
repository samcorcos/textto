const functions = require('firebase-functions')
const { db } = require('../../lib/firebase')

/**
 * Deletes a document with ID -> uid in the `users` collection.
 *
 * @param {Object} userRecord - Contains the auth, uid, and other info
 * @param {Object} context - Details about the event
 */
const deleteProfile = async (userRecord, context) => {
  try {
    await db.collection('users').doc(userRecord.uid).delete()
    console.info('User deleted: ', userRecord)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Creates a document with ID -> uid in the `users` collection.
 *
 * @param {Object} userRecord - Contains the auth, uid, and other info
 * @param {Object} context - Details about the event.
 */
const createProfile = async (userRecord, context) => {
  try {
    await db.collection('users').doc(userRecord.uid).set({
      email: userRecord.email
    })
    console.info('User created: ', userRecord)
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  authOnDelete: functions.auth.user().onDelete(deleteProfile),
  authOnCreate: functions.auth.user().onCreate(createProfile)
}
