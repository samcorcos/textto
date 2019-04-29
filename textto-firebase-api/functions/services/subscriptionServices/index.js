const functions = require('firebase-functions')

const { stripe } = require('./stripe')
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
  try {
    const userDoc = await db.collection('users').doc(context.auth.uid).get()
    const user = userDoc.data()
    let customer
    if (!user.customerId) {
      customer = await stripe.createCustomer(token.id, token.email)
      console.info('customer', customer)
    } else {
      customer = await stripe.getCustomer(user.customerId)
      console.info('customer', customer)
    }
    const subscription = await stripe.subscribe((process.env.NODE_ENV === 'production') ? 'plan_EsCKHPakXIbMRH' : 'plan_Eyd3d43vlPnTn3', customer.id)
    console.info('subscription', subscription)
    if (subscription) {
      await db.collection('users').doc(context.auth.uid).set({
        active: true,
        customerId: customer.id,
        subscriptionId: subscription.id
      }, { merge: true })
    }
  } catch (err) {
    console.error(err)
    return {
      message: 'Failed!',
      err
    }
  }

  return {
    message: 'Success!'
  }
})

module.exports.unsubscribe = functions.https.onCall(async (data, context) => {
  try {
    const userDoc = await db.collection('users').doc(context.auth.uid).get()
    const user = userDoc.data()
    if (user.active) {
      await stripe.unsubscribe(user.subscriptionId)
      await db.collection('users').doc(context.auth.uid).set({
        active: false,
        subscriptionId: null
      }, { merge: true })
    }
  } catch (err) {
    console.error(err)
    return {
      message: 'Failed!',
      err
    }
  }

  return {
    message: 'Success!'
  }
})
