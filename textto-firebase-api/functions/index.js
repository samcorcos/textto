const { authOnDelete, authOnCreate } = require('./services/userTriggers')
const { receiveSMSAsEmail } = require('./services/receiveSMSAsEmail')
const { sendEmailAsSMS } = require('./services/sendEmailAsSMS')
const { availablePhoneNumbers, selectPhoneNumber } = require('./services/phoneNumberServices')

module.exports = {
  authOnDelete,
  authOnCreate,
  receiveSMSAsEmail,
  availablePhoneNumbers,
  selectPhoneNumber,
  sendEmailAsSMS
}
