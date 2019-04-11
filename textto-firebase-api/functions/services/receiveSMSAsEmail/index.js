require('dotenv').config()
const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })

const { db } = require('../../lib/firebase')

module.exports.receiveSMSAsEmail = functions.https.onRequest(async (request, response) => {
  console.info('body', request.body)

  const variables = request.body

  // the phone number this was sent to
  const to = decodeURIComponent(variables.To)
  console.info('to', to)

  // the person who sent this email
  const from = decodeURIComponent(variables.From)
  console.info('from', from)

  // Find the account that is associated with the phone number that received this message.
  let accountId
  let account
  try {
    const res = await db.collection('users').where('phone', '==', to).get()
    // there will only ever be one account associated with each number
    res.forEach(u => {
      accountId = u.id
      account = u.data()
    })
  } catch (err) {
    console.error(err)
  }
  console.info('accountId', accountId)

  if (!accountId) {
    return cors(request, response, () => {
      return response.status(402).send({ message: 'Unprocessable entity' })
    })
  }

  let person
  try {
    const result = await db.collection('users').doc(accountId).collection('people').doc(from).get()
    person = result.data()
  } catch (err) {
    console.error(err)
  }
  console.info('person', person)

  const body = decodeURIComponent(variables.Body.replace(/\+/g, ' '))
  console.info('body', body)

  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  const content = body
  const msg = {
    to: account.email,
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
