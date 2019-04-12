const functions = require('firebase-functions')

const { stripeSecretKey, stripeSecretKeyTest } = require('../../credentials/stripe')
const stripeKey = (process.env.NODE_ENV === 'production') ? stripeSecretKey : stripeSecretKeyTest

const stripe = require('stripe')(stripeKey)

const { db } = require('../../lib/firebase')

module.exports.createSubscription = functions.https.onCall(async (data, context) => {
  const { token } = data
  console.log('token', token)

  if (!token) {
    throw new functions.https.HttpsError('invalid-argument', 'Must include a valid token')
  }

  // TODO there are a lot of edge cases to handle

  // stripe.customers.retrieve(
  //   get customer_id if there is one
  // )

  let customer
  try {
    customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    })
  } catch (err) {
    console.error(err)
  }
  console.info('customer', customer)

  let subscription
  try {
    subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        plan: (process.env.NODE_ENV === 'production') ? 'plan_EsCKHPakXIbMRH' : 'plan_EsDW3DrAjKSWPa' // product id for TextTo.net Premium monthly
      }]
    })
  } catch (err) {
    console.error(err)
  }
  console.info('subscription', subscription)

  // if the subscription succeeds, set the plan to active
  if (subscription) {
    try {
      await db.collection('users').doc(context.auth.uid).set({
        active: true,
        customerId: customer.id,
        subscriptionId: subscription.id
      }, { merge: true })
    } catch (err) {
      console.error(err)
    }
  }

  return {
    message: 'Success!'
  }
})
