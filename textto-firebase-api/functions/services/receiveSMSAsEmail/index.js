require('dotenv').config()
const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })

const { db } = require('../../lib/firebase')
const { checkTrialPeriod } = require('../../lib/checkTrialPeriod.js')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports.receiveSMSAsEmail = functions.https.onRequest(async (request, response) => {
  console.info('body', request.body)

  const variables = request.body

  console.info('variables', variables)

  // the phone number this was sent to
  const to = decodeURIComponent(variables.To)
  console.info('to', to)

  // the person who sent this message
  const from = decodeURIComponent(variables.From)
  console.info('from', from)

  // Find the user that is associated with the phone number that received this message.
  let userId
  let user
  try {
    const res = await db.collection('users').where('phone', '==', to).get()
    // there will only ever be one user associated with each number
    res.forEach(u => {
      userId = u.id
      user = u.data()
    })
  } catch (err) {
    console.error(err)
  }
  console.info('userId', userId)

  if (!userId) {
    return cors(request, response, () => {
      return response.status(402).send({ message: 'Unprocessable entity' })
    })
  }

  // record the SMS by adding to message count
  try {
    await db.collection('users').doc(userId).set({
      messageCount: ((Number(user.messageCount) || 0) + 1)
    }, { merge: true })
  } catch (err) {
    console.error(err)
  }

  const { messageCount, activationDate, active } = user

  const isValid = checkTrialPeriod(activationDate)

  // if the user is on the free plan and has exceeded the free plan messaging limit (100) or
  // is past the trial period (30 days), reject
  if (!active && !isValid) {
    const content = `Your account has exceeded the trial period of 30 days and your message to ${from} was not sent. Please upgrade your account to send additional messages https://textto.net/upgrade`
    const msg = {
      to: user.email,
      from: `support@textto.net`,
      subject: `TextTo.net trial period exceeded`,
      text: content,
      html: content
    }
    console.info('email message', msg)
    const result = await sgMail.send(msg)
    console.info('email result', result)
    return response.status(402).send({ message: 'User has exceeded the free plan trial period.' })
  }

  if (!active && ((messageCount || 0) > 99)) {
    const content = `Your account has exceeded the trial account messaging limit of 100 messages and your message to ${from} was not sent. Please upgrade your account to send additional messages https://textto.net/upgrade`
    const msg = {
      to: user.email,
      from: `support@textto.net`,
      subject: `TextTo.net trial message limit exceeded`,
      text: content,
      html: content
    }
    console.info('email message', msg)
    const result = await sgMail.send(msg)
    console.info('email result', result)
    return response.status(402).send({ message: 'User has exceeded the free plan message count.' })
  }

  let person
  try {
    const result = await db.collection('users').doc(userId).collection('people').doc(from).get()
    person = result.data()
  } catch (err) {
    console.error(err)
  }
  console.info('person', person)

  const body = decodeURIComponent(variables.Body.replace(/\+/g, ' '))
  console.info('body', body)

  const content = body
  const msg = {
    to: user.email,
    from: `${person.recipientEmail}@textto.net`,
    subject: `Re: ${from}, ${person.name}`,
    text: content,
    html: content
  }
  console.info('email message', msg)
  const result = await sgMail.send(msg)
  console.info('email result', result)

  return cors(request, response, () => {
    return response.status(200).contentType('text/html').send('<html><body>Success!</body></html>')
  })
})
