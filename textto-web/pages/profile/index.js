import React from 'react'
import {
  Input,
  Data
} from '@corcos/components'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { colors } from '@corcos/lib'
import moment from 'moment'

import {
  Head,
  Layout,
  Format,
  Footer,
  Button,
  Navbar
} from '../../components'
import Signup from '../../components/Signup'
import Login from '../../components/Login'

import Context from '../../lib/context'
import { db, firebase } from '../../lib/firebase'

// determines what to render if the user is not logged in
const SignUpOrLogIn = (self) => {
  if (self.context.signUpOrLogIn === 'logIn') {
    return <Login {...self.props} />
  }
  if (self.context.signUpOrLogIn === 'forgot') {
    return <div>Forgot</div>
  }
  return <Signup {...self.props} />
}

// determines what to render depending on whether or not the user is logged in
const LoginStatus = (self) => {
  if (self.context.currentUser.uid) {
    return null
  }
  return SignUpOrLogIn(self)
}

const NoPhoneNumber = (props) => {
  return (
    <Link href='add-phone'>
      <div style={{ width: 200 }}>
        <Button title='Get a phone number' onClick={() => {}} />
      </div>
    </Link>
  )
}

class WithPhoneNumber extends React.Component {
  render () {
    return (
      <div>
        <div>
          Your number: {this.props.user.phone}
        </div>
        <div className='instructions' style={{ marginTop: 30 }}>
          Instructions
        </div>
        <a style={{ marginBottom: 15 }} href='mailto:send@textto.net?subject=+14159385290, Sam Corcos&body=Hey Sam! This is an example text'>
          Click here to send a demo text
        </a>
        <div className='p'>
          This application uses the subject line of your email to determine who to send your SMS messages to.
        </div>
        <div className='p'>
          To send an email to someone, you'll need to format the subject in a particular way: <span className='code'>&lt;phone&gt;, &lt;name&gt;</span>
        </div>
        <div className='p'>
          For example: <span className='code'>+14159385290, Sam Corcos</span>
        </div>

        <div className='p'>
          Note that the phone number must be in the format <span className='code'>+14159385290</span>. The name is needed to make your emails easier to read and to keep your conversations threaded. The name comes after a comma.
        </div>
        <div className='p'>
          To send an SMS to someone, all you need to do is send an email to <span className='code'>send@textto.net</span>.
        </div>
        <div className='p'>
          If you want to send a batch of personalized emails using a tool like Mixmax, you will need a unique email address for every person. To solve this you can send an email to <span className='code'>&lt;anything&gt;@textto.net</span>, where <span className='code'>&lt;anything&gt;</span> is any value you'd like.
        </div>
        <div className='p'>
          For example: <span className='code'>sam.corcos@textto.net</span>
        </div>
        <div className='p'>
          The best thing to do is to use the person's name so the emails stay threaded and organized in your email client. This also allows you to use Mixmax or other email solutions that require unique email addresses for each person, because you can arbitrarily set unique email addresses for everyone.
        </div>
        <div className='p'>
          Then send whatever you want. In the body and you can reply directly to the email and it will go to the recipient.
        </div>
        <div className='example'>
          Example
        </div>
        <div className='image-container'>
          <img className='image' src='/static/email-example.png' />
        </div>

        <style jsx>{`
          span.code {
            font-family: monospace;
            background-color: ${colors.grey[200]};
            border-radius: 3px;
            display: inline;
            width: fit-content;
          }
          .example {
            font-size: 1.5em;
            margin-top: 10px;
            margin-bottom: 15px;
            text-align: center;
          }
          .p {
            margin-bottom: 15px;
            display: inline;
          }
          .instructions {
            font-size: 1.5em;
          }
          .image-container {
            height: 400px;
            align-items: center;
          }
          .image {
            box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            object-fit: contain;
            width: 400px;
          }
        `}</style>
      </div>
    )
  }
}

class UpgradeHeader extends React.Component {
  render () {
    if (this.props.user.active) return null
    const daysToExpiration = (30 - Math.abs(moment(this.props.user.activationDate.toDate()).diff(moment(), 'days')))
    return (
      <div className='container'>
        <div className='title col'>
          <div className='start'>Trial Account</div>
          <div className='messages'>{100 - (this.props.user.messageCount || 0)} messages remaining</div>
          <div className='days'>{daysToExpiration} days remaining</div>
        </div>
        <Link href='/upgrade'>
          <Button title='Upgrade' />
        </Link>

        <style jsx>{`
          .start {
            font-size: 1.3em;
          }
          .title {
            margin: 10px;
          }
          .container {
            background-color: ${colors.grey[200]};
            border-bottom: 1px solid ${colors.grey[400]};
            height: 100px;
            width: 100%;
            align-items: center;
            justify-content: center;
            flex-direction: row;
          }  
        `}</style>
      </div>
    )
  }
}

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      forwarding: Boolean(props.user.callForwardingPhone),
      callForwardingPhone: '+1'
    }
  }

  static getInitialProps = ({ query }) => {
    return { query }
  }

  static contextType = Context

  _handleChange = (v) => {
    // if the first characters are anything other than +1, alert
    if (!/^\+1/g.test(v)) {
      window.alert('Your phone number must start with +1')
    }
    // phone numbers cannot be more than 12 characters
    if (v.length > 12) {
      return null
    }
    // only allow characters that are digits
    if (/^\+1[0-9]*$/g.test(v)) {
      this.setState({ callForwardingPhone: v })
    }
  }

  _handleSubmit = async () => {
    try {
      await firebase.functions().httpsCallable('updateCallForwarding')({
        callForwardingPhone: this.state.callForwardingPhone
      })
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    return (
      <Format>
        <Head />
        <Navbar />
        <UpgradeHeader {...this.props} />
        <Layout>
          <div className='row' style={{ alignItems: 'center' }}>
            <div style={{ marginRight: 30 }}>
              {this.props.user.email}
            </div>
            <div>
              <a onClick={() => {
                this.context.signOut()
                this.props.router.push('/')
              }}>Log out</a>
            </div>
            <div style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 30, border: `1px solid ${colors.grey[200]}`, borderRadius: 3, padding: 10 }}>
              <div>
                Call Forwarding?
              </div>
              {!this.props.user.callForwardingPhone && <input checked={this.state.forwarding} onChange={() => this.setState({ forwarding: !this.state.forwarding })} type='checkbox' />}
              {this.props.user.callForwardingPhone && <div style={{ marginLeft: 15 }}>{this.props.user.callForwardingPhone}</div>}
              {this.state.forwarding && !this.props.user.callForwardingPhone && (
                <>
                  <div className='row' style={{ alignItems: 'center', marginLeft: 15 }}>
                    <Input label='Must be in format: +14153882931' placeholder='E.g. +14154332443' onChange={v => this._handleChange(v)} value={this.state.callForwardingPhone} />
                    <div style={{ width: 15 }} />
                    <Button disabled={this.state.callForwardingPhone.length < 12} title='Submit' onClick={() => this._handleSubmit()} />
                  </div>
                </>
              )}
            </div>
          </div>
          <div>
            {this.props.user.phone
              ? <WithPhoneNumber {...this.props} />
              : <NoPhoneNumber {...this.props} />}
          </div>
        </Layout>
        <Footer />
      </Format>
    )
  }
}

class WithData extends React.Component {
  static contextType = Context

  // if there are query params for setting the login type, set that to context
  componentDidMount () {
    this.context.set('signUpOrLogIn', this.props.router.query.type)
  }

  // if the query params change, update context
  componentDidUpdate (prevProps) {
    if (prevProps.router.query.type !== this.props.router.query.type) {
      this.context.set('signUpOrLogIn', this.props.router.query.type)
    }
  }

  render () {
    if (!this.context.currentUser.uid) {
      return (
        <Format>
          <Head />
          <Navbar />
          <Layout>
            {LoginStatus(this)}
          </Layout>
        </Format>
      )
    }
    return (
      <Data query={db.collection('users').doc(this.context.currentUser.uid)}>
        {({ data: user, loading }) => {
          if (loading) return <div>Loading...</div>
          return (
            <Profile user={user} {...this.props} />
          )
        }}
      </Data>
    )
  }
}

export default withRouter(WithData)
