module.exports.parser = {
  /**
   * takes in text and returns the "to" field
   */
  body: (t) => {
    const result = t.match(/(?<=Content-Disposition: form-data; name="text").*?(?=--xYzZY)/gs)
    if (result) return result[0]
    return ''
  },
  envelope: (t) => {
    const result = t.match(/(?<=Content-Disposition: form-data; name="envelope").*?(?=--xYzZY)/gs)
    if (result) return result[0]
    return ''
  },
  dkim: (t) => {
    const result = t.match(/(?<=Content-Disposition: form-data; name="dkim").*?(?=--xYzZY)/gs)
    if (result) return result[0]
    return ''
  },
  // used to determine if the email is valid and comes from the origin it claims. this is used to
  // make sure nobody can spoof the emails sent to the listserv
  dkimPass: (t) => {
    const result = t.match(/(?<=Content-Disposition: form-data; name="dkim").*?(?=--xYzZY)/gs)
    if (result) {
      return /: pass}/g.test(result[0])
    }
    return false
  },
  spf: (t) => {
    const result = t.match(/(?<=Content-Disposition: form-data; name="SPF").*?(?=--xYzZY)/gs)
    if (result) return result[0]
    return ''
  },
  // used to determine if the email is valid and comes from the origin it claims. this is used to
  // make sure nobody can spoof the emails sent to the listserv
  spfPass: (t) => {
    const result = t.match(/(?<=Content-Disposition: form-data; name="SPF").*?(?=--xYzZY)/gs)
    if (result) {
      return /pass/g.test(result[0])
    }
    return false
  },
  to: (t) => {
    const result = t.match(/(?<=Content-Disposition: form-data; name="to").*?(?=--xYzZY)/gs)
    if (result) return result[0]
    return ''
  },
  subject: (t) => {
    const result = t.match(/(?<=Content-Disposition: form-data; name="subject").*?(?=--xYzZY)/gs)
    if (result) return result[0]
    return ''
  },
  from: (t) => {
    const result = t.match(/(?<=Content-Disposition: form-data; name="from").*?(?=--xYzZY)/gs)
    if (result) return result[0]
    return ''
  },
  cc: (t) => {
    const result = t.match(/(?<=Content-Disposition: form-data; name="cc").*?(?=--xYzZY)/gs)
    if (result) return result[0]
    return ''
  },
  bcc: (t) => {
    const result = t.match(/(?<=Content-Disposition: form-data; name="bcc").*?(?=--xYzZY)/gs)
    if (result) return result[0]
    return ''
  }
}
