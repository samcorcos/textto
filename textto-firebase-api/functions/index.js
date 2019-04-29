const { authOnDelete, authOnCreate } = require('./services/userTriggers')
const { receiveSMSAsEmail } = require('./services/receiveSMSAsEmail')
const { sendEmailAsSMS } = require('./services/sendEmailAsSMS')
const { availablePhoneNumbers, selectPhoneNumber, updateCallForwarding, forwardCall } = require('./services/phoneNumberServices')
const { createSubscription, unsubscribe } = require('./services/subscriptionServices')

module.exports = {
  authOnDelete,
  authOnCreate,
  receiveSMSAsEmail,
  createSubscription,
  unsubscribe,
  availablePhoneNumbers,
  selectPhoneNumber,
  forwardCall,
  updateCallForwarding,
  sendEmailAsSMS
}
