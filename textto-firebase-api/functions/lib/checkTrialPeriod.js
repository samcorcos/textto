const moment = require('moment')

// checks the activation date against the trial period, returns "isValid"
module.exports.checkTrialPeriod = (activationDate) => {
  const trialPeriodDays = 30

  const a = moment(activationDate.toDate())
  const b = moment()
  const days = a.diff(b, 'days')

  console.info('days since activation', Math.abs(days))

  // if the days between the trial period and today is greater than the length of the trial,
  // return false (not valid), otherwise return true (still valid)
  return (days < trialPeriodDays)
}
