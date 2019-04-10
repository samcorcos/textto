import React from 'react'
import {
  Layout,
  Button,
  Input,
  Data
} from '@corcos/components'
import Link from 'next/link'

import {
  Head,
  Format,
  Footer,
  Navbar
} from '../../components'

import { db } from '../../lib/firebase'
import Context from '../../lib/context'

class Dashboard extends React.Component {
  render () {
    return (
      <Format>
        <Head />
        <Navbar />
        <Layout>
          {Object.keys(this.props.user).length < 1 ? (
            <div>No user. This should not happen</div>
          ) : (
            <div>
              <div>{this.props.user.email}</div>
              {!this.props.user.phone ? (
                <div>
                  <div>no phone</div>
                  <Link href='/add-phone'>
                    <Button title='Add Phone' />
                  </Link>
                </div>
              ) : (
                <div>{this.props.user.phone}</div>
              )}
            </div>
          )}
          <div className='instructions'>
            Instructions
          </div>
          <div className='p'>
            This application uses the subject line of your email to determine who to send your SMS messages to.
          </div>
          <div className='p'>
            To send an email to someone, you'll need to format the subject of your email in the following way: &lt;phone&gt;, &lt;name&gt;
          </div>
          <a style={{ textAlign: 'center' }} href='mailto:sam.corcos@textto.net?subject=+14159385290, Sam Corcos&body=Hey Sam! This is an example text'>
              Click here to send a demo text
          </a>
          <div className='p'>
            For example: +14159385290, Sam Corcos
          </div>
          <div className='p'>
            Note that the phone number must be in the format "+14159385290". The name is needed to make your emails easier to read and to keep your conversations threaded. The name comes after a comma.
          </div>
          <div className='p'>
            To send an SMS to someone, all you need to do is send an email to &lt;anything&gt;@textto.net, where &lt;anything&gt; is any value you'd like.
          </div>
          <div className='p'>
            For example: sam.corcos@textto.net
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
            .example {
              font-size: 1.5em;
              margin-top: 10px;
              margin-bottom: 15px;
              text-align: center;
            }
            .p {
              margin-bottom: 15px;
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
        </Layout>
        <Footer />
      </Format>
    )
  }
}

class WithData extends React.Component {
  static contextType = Context

  render () {
    if (!this.context.currentUser.uid) return <div>not logged in</div>
    return (
      <Data query={db.collection('users').doc(this.context.currentUser.uid)}>
        {({ data: user, loading }) => {
          if (loading) return <div>Loading...</div>
          return (
            <Dashboard user={user} />
          )
        }}
      </Data>
    )
  }
}

export default WithData
