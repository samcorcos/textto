require('dotenv').config()
const { parser } = require('../../lib/parser')
const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })
var replyParser = require('node-email-reply-parser')

const { db } = require('../../lib/firebase')

// NOTE this is the number for Evan Baehr
// TODO this needs to be extracted into the database
// const twilioNumber = '+15129602039'

const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)

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
    // return cors(request, response, () => {
    //   return response.status(401).send({ message: 'Unauthorized' })
    // })
  }

  // get the user ID for the account that sent this email
  let accountId
  let account
  try {
    const res = await db.collection('users').where('email', '==', envelope.from).get()
    // there will only ever be one user with this email account
    res.forEach(u => {
      accountId = u.id
      account = u.data()
    })
  } catch (err) {
    console.error(err)
  }
  console.info('accountId', accountId)
  console.info('account', account)

  // if there is no account associated with the email address attempting to send the email, reject
  if (!accountId) {
    return cors(request, response, () => {
      return response.status(401).send({ message: 'Unauthorized' })
    })
  }

  const [phone, name] = subject.split(',').map(v => v.trim())

  try {
    await db.collection('users').doc(accountId).collection('people').doc(phone).set({
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
      from: account.phone,
      to: phone
    })

  return cors(request, response, () => {
    return response.status(200).send({ message: 'Success!' })
  })
})
