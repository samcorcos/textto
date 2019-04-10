require('dotenv').config()
const functions = require('firebase-functions')

const { db } = require('../../lib/firebase')

const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)

module.exports.availablePhoneNumbers = functions.https.onCall(async (data, context) => {
  // get the search prefix from the request body. User may request that their number start with
  // something like '415'
  const { areaCode } = data

  if (!areaCode) {
    throw new functions.https.HttpsError('invalid-argument', 'Must include an area code in your request.')
  }

  // Find and then purchase a phone number
  try {
    /*  Results are in this shape:
      [ { friendlyName: '(415) 991-7122',
      phoneNumber: '+14159917122',
      lata: '722',
      locality: 'San Rafael',
      rateCenter: 'SAN RAFAEL',
      latitude: 37.9735,
      longitude: -122.5311,
      region: 'CA',
      postalCode: '94901',
      isoCountry: 'US',
      addressRequirements: 'none',
      beta: false,
      capabilities: { voice: true, SMS: true, MMS: true, fax: true } },
      ... ]
    */

    const data = await client
      .availablePhoneNumbers('US')
      .local.list({ areaCode })

    // https://stackoverflow.com/questions/52214909/firebase-cloud-function-unhandled-error-rangeerror
    // TODO This is insane... Firebase rejects the raw input, but if you convert it to a string, then
    // parse it back, it allows you to send back to the client.
    const d = JSON.stringify(data)

    return {
      availablePhoneNumbers: JSON.parse(d)
    }
  } catch (err) {
    console.error(err)
  }
  console.log('this should not run')

  throw new functions.https.HttpsError('invalid-argument', 'Must include an area code in your request.')
})

module.exports.selectPhoneNumber = functions.https.onCall(async (data, context) => {
  const { phoneNumber } = data
  /*  phoneNumber should be in this shape:
    [ { friendlyName: '(415) 991-7122',
    phoneNumber: '+14159917122',
    lata: '722',
    locality: 'San Rafael',
    rateCenter: 'SAN RAFAEL',
    latitude: 37.9735,
    longitude: -122.5311,
    region: 'CA',
    postalCode: '94901',
    isoCountry: 'US',
    addressRequirements: 'none',
    beta: false,
    capabilities: { voice: true, SMS: true, MMS: true, fax: true } },
    ... ]
  */

  if (!phoneNumber) {
    throw new functions.https.HttpsError('invalid-argument', 'Must include a phone number in your request.')
  }

  try {
    const purchasedNumber = await client.incomingPhoneNumbers.create({
      phoneNumber: phoneNumber.phoneNumber
    })
    console.info('purchasedNumber', purchasedNumber)

    // Now that we have purchased the number we need to set up the webhook.
    // https://www.twilio.com/docs/phone-numbers/api/incoming-phone-numbers#update-an-incomingphonenumber-resource
    await client.incomingPhoneNumbers(purchasedNumber.sid).update({
      smsUrl: 'https://us-central1-textto-189ae.cloudfunctions.net/receiveSMSAsEmail'
    })

    await db.collection('users').doc(context.auth.uid).set({
      phone: purchasedNumber.phoneNumber
    }, { merge: true })
    return {
      message: 'Success!'
    }
  } catch (err) {
    console.error(err)
  }

  throw new functions.https.HttpsError('invalid-argument', 'Must include a phone number in your request.')
})
