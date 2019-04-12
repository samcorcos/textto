require('dotenv').config()
const { parser } = require('../../lib/parser')
const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })
const moment = require('moment')
var replyParser = require('node-email-reply-parser')

const { db } = require('../../lib/firebase')

// NOTE this is the number for Evan Baehr
// TODO this needs to be extracted into the database
// const twilioNumber = '+15129602039'

const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)

// checks the activation date against the trial period, returns "isValid"
const checkTrialPeriod = (activationDate) => {
  const trialPeriodDays = 30

  const a = moment(activationDate.toDate())
  const b = moment()
  const days = a.diff(b, 'days')

  console.info('days since activation', Math.abs(days))

  // if the days between the trial period and today is greater than the length of the trial,
  // return false (not valid), otherwise return true (still valid)
  return (days < trialPeriodDays)
}

module.exports.sendEmailAsSMS = functions.https.onRequest(async (request, response) => {
  const emailContent = request.body.toString('utf8')

  console.info('emailContent')
  console.info(emailContent)

  // { to: [ 'sms@textto.net' ], from: 'sam@corcos.io' }
  const envelope = JSON.parse(parser.envelope(emailContent))
  console.info('envelope', envelope)

  // converts `sam.corcos@textto.net` into `sam.corcos` for storage in the database. This is needed
  // because Gmail threads based on recipient email address and we want to keep these messages in
  // the same thread to stay organized.
  const recipientEmail = envelope.to[0].match(/^(.*?)(?=@)/g)[0]
  console.info('recipientEmail', recipientEmail)

  const rawSubject = parser.subject(emailContent)
  console.info('rawSubject', rawSubject)

  // if the email is a Re:, remove any prefixes
  const subject = rawSubject.replace(/([[(] *)?(RE|FWD?) *([-:;)\]][ :;\])-]*|$)|\]+ *$/igm, '')
  console.info('subject', subject)

  // NOTE subject must be in this format: <phone>, <name>
  // +14155154630, Sam Corcos

  // if the sender email fails verification, return error. this is to prevent random people
  // from spoofing emails and sending to the list without a verified email
  if (!(parser.dkimPass(emailContent) && parser.spfPass(emailContent))) {
    console.error('Rejected DKIM or SFP')
    console.log('dkim', parser.dkimPass(emailContent))
    console.log('spf', parser.spfPass(emailContent))
    // TODO note this error in stackdriver with emailContent
    // return cors(request, response, () => {
    //   return response.status(401).send({ message: 'Unauthorized' })
    // })
  }

  // get the user ID for the user that sent this email
  let userId
  let user
  try {
    const res = await db.collection('users').where('email', '==', envelope.from).get()
    // there will only ever be one user with this email user
    res.forEach(u => {
      userId = u.id
      user = u.data()
    })
  } catch (err) {
    console.error(err)
  }
  console.info('userId', userId)
  console.info('user', user)

  // if there is no user associated with the email address attempting to send the email, reject
  if (!userId) {
    return cors(request, response, () => {
      return response.status(401).send({ message: 'Unauthorized' })
    })
  }

  const { messageCount, activationDate, active } = user
  
  const isValid = checkTrialPeriod(activationDate)

  console.log('isvalid', isValid)

  // if the user is on the free plan and has exceeded the free plan messaging limit (100) or
  // is past the trial period (30 days), reject
  if (!active && !isValid) {
    return response.status(401).send({ message: 'User has exceeded the free plan trial period.' })
  }

  if (!active && (messageCount > 99)) {
    return response.status(402).send({ message: 'User has exceeded the free plan message count.' })
  }

  const [phone, name] = subject.split(',').map(v => v.trim())

  try {
    await db.collection('users').doc(userId).collection('people').doc(phone).set({
      name, // Sam Corcos
      recipientEmail // sam.corcos
    }, { merge: true })
  } catch (err) {
    console.error(err)
  }

  const rawBody = parser.body(emailContent)
  console.info('rawBody', rawBody)

  const fragments = replyParser(rawBody).getFragments()
  console.info('fragments', fragments)

  // body without old emails content visible
  const body = fragments[0].getContent()
  console.info('body', body)

  await client.messages
    .create({
      body,
      from: user.phone,
      to: phone
    })

  return cors(request, response, () => {
    return response.status(200).send({ message: 'Success!' })
  })
})
