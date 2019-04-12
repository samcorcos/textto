const { authOnDelete, authOnCreate } = require('./services/userTriggers')
const { receiveSMSAsEmail } = require('./services/receiveSMSAsEmail')
const { sendEmailAsSMS } = require('./services/sendEmailAsSMS')
const { availablePhoneNumbers, selectPhoneNumber, updateCallForwarding, forwardCall } = require('./services/phoneNumberServices')
const { createSubscription } = require('./services/subscriptionServices')

module.exports = {
  authOnDelete,
  authOnCreate,
  receiveSMSAsEmail,
  createSubscription,
  availablePhoneNumbers,
  selectPhoneNumber,
  forwardCall,
  updateCallForwarding,
  sendEmailAsSMS
}
