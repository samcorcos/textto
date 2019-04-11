require('dotenv').config()
const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })
const bodyParser = require('body-parser')

const { db, dbRest } = require('../../lib/firebase')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)

/**
 * Checks with Twilio for a list of available phone numbers given a particular area code.
 * Returns a list of phone numbers.
 */
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

/**
 * When a user selects a phone number that is available, associate that number with the customer
 * and update the database.
 */
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
    console.info('purchasedNumber', JSON.stringify(purchasedNumber))

    // Now that we have purchased the number we need to set up the webhook.
    // https://www.twilio.com/docs/phone-numbers/api/incoming-phone-numbers#update-an-incomingphonenumber-resource
    await client.incomingPhoneNumbers(purchasedNumber.sid).update({
      smsUrl: 'https://us-central1-textto-189ae.cloudfunctions.net/receiveSMSAsEmail'
    })

    await db.collection('users').doc(context.auth.uid).set({
      phone: purchasedNumber.phoneNumber,
      // NOTE this is a weird hack because Firestore thinks there is a constructor in the response
      // even though there is not.
      purchasedNumber: JSON.parse(JSON.stringify(purchasedNumber))
    }, { merge: true })
    return {
      message: 'Success!'
    }
  } catch (err) {
    console.error(err)
  }

  throw new functions.https.HttpsError('invalid-argument', 'Must include a phone number in your request.')
})

/**
 * Sets the customer's phone number to use call forwarding.
 */
module.exports.updateCallForwarding = functions.https.onCall(async (data, context) => {
  if (!context.auth.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated')
  }

  const { callForwardingPhone } = data
  console.info('callForwardingPhone', callForwardingPhone)

  if (!callForwardingPhone) {
    throw new functions.https.HttpsError('invalid-argument', 'Must include a forwarding number')
  }

  if (!/^\+1[0-9]{10}$/g.test(callForwardingPhone)) {
    throw new functions.https.HttpsError('invalid-argument', 'Forwarding number is not in correct format')
  }

  // first get the account
  let account
  try {
    const res = await dbRest.collection('users').doc(context.auth.uid).get()
    account = res.data()
  } catch (err) {
    console.error(err)
  }

  if (account) {
    // check if the account already has call forwarding
    try {
      const res = await db.collection('users').doc(context.auth.uid).set({
        callForwardingPhone
      }, { merge: true })
      console.info('set result', res)
    } catch (err) {
      console.error(err)
    }

    await client.incomingPhoneNumbers(account.purchasedNumber.sid).update({
      voiceUrl: 'https://us-central1-textto-189ae.cloudfunctions.net/forwardCall'
    })
  }

  return {
    message: 'Success!'
  }
})

/**
 * When Twilio receives an incoming voice call to a number in our control, forward that
 * number to the forwarding phone number in the database.
 */
module.exports.forwardCall = functions.https.onRequest(async (request, response) => {
  // https://www.twilio.com/docs/voice/tutorials/call-forwarding-nodejs-express?code-sample=code-zipcodes-seeder&code-language=Node.js&code-sdk-version=default
  // https://www.twilio.com/docs/voice/twiml/dial?code-sample=code-simple-dial&code-language=Node.js&code-sdk-version=3.x
  // https://stackoverflow.com/questions/2965587/valid-content-type-for-xml-html-and-xhtml-documents
  return bodyParser.urlencoded({ extended: false })(request, response, async () => {
    console.info('body', request.body)
    const VoiceResponse = require('twilio').twiml.VoiceResponse
    const vr = new VoiceResponse()
    // TODO get number from database

    // this is the number that was called
    const called = request.body.Called
    // get the user that is associated with this number
    let account
    try {
      const res = await db.collection('users').where('phone', '==', called).get()
      res.forEach(r => { account = r.data() })
    } catch (err) {
      console.error(err)
    }

    // if there is a call forwarding address, forward the call
    if (account.callForwardingPhone) {
      vr.dial(account.callForwardingPhone)
    } else {
      // otherwise send an email to the account owner letting them know that someone attempted to call
      // and they do not have a call forwarding number set up.
      const content = `Missed call from: ${request.body.From}. To forward these calls to your phone number, please enable call forwarding https://textto.net/profile`
      const msg = {
        to: account.email,
        from: `${account.email}@textto.net`,
        subject: `Missed call from ${request.body.From}`,
        text: content,
        html: content
      }
      console.info('email message', msg)
      const result = await sgMail.send(msg)
      console.info('email result', result)
    }

    console.info('twiml query', vr.toString())

    return cors(request, response, () => {
      return response.status(200).contentType('text/xml').send(vr.toString())
    })
  })
})
