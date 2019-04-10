import React from 'react'
import {
  Layout,
  Button,
  Data
} from '@corcos/components'
import Link from 'next/link'
import { withRouter } from 'next/router'

import {
  Head,
  Format,
  Navbar
} from '../../components'
import Signup from '../../components/Signup'
import Login from '../../components/Login'

import Context from '../../lib/context'
import { db } from '../../lib/firebase'

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

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  static getInitialProps = ({ query }) => {
    return { query }
  }

  static contextType = Context

  render () {
    return (
      <Format>
        <Head />
        <Navbar />
        <Layout>
          <div>
            {this.props.user.email}
          </div>
          <div>
            {this.props.user.phone ? (
              this.props.user.phone
            ) : (
              <Link href='add-phone'>
                <div style={{ width: 200 }}>
                  <Button title='Get a phone number' onClick={() => {}} />
                </div>
              </Link>
            )}
          </div>
          <a onClick={() => {
            this.context.signOut()
            this.props.router.push('/')
          }}>Log out</a>

          <style jsx>{`
          
          `}</style>
        </Layout>
      </Format>
    )
  }
}

class WithData extends React.Component {
  static contextType = Context

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
