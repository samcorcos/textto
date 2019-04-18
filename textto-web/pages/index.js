import React from 'react'
import {
  colors
} from '@corcos/lib'
import Link from 'next/link'

import {
  Head,
  Layout,
  Format,
  Footer,
  Button,
  Navbar
} from '../components'

const badgeData = [
  {
    title: 'Manage your text messages on your own time instead of immediately upon receipt.'
  },
  {
    title: 'Use existing email tooling like Mixmax to schedule when you send texts or send personalized batch messages.'
  },
  {
    title: 'Use any email client you want and take advantage of all the features of email.'
  }
]

class Badges extends React.Component {
  render () {
    return (
      <div className='container'>
        <Layout>
          <div className='badge-row'>
            {badgeData.map(b => {
              return (
                <div key={b.title} className='badge'>
                  {b.title}
                </div>
              )
            })}
          </div>
        </Layout>
        
        <style jsx>{`
            .container {
              flex: 1;
              padding-bottom: 50px;
            }
            .badge {
              width: 30%;
              text-align: center;
            }
            .badge-row {
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
            }  
          `}</style>
      </div>
    )
  }
}

class Panes extends React.Component {
  render () {
    return (
      <Layout>
        <div className='row pane-row'>
          <div className='pane-text'>
            <div className='pane-title'>
              Use existing email tooling like Mixmax or Prospect
            </div>
            <div className='pane-description'>
              You can send personalized messages to groups of people, as well as send automated followups if the person you're sending a text to has not responded within a certain amount of time.
            </div>
          </div>
          <img className='image' src='https://firebasestorage.googleapis.com/v0/b/textto-189ae.appspot.com/o/Sequence%20-%20higher%20quality.gif?alt=media&token=c4358200-e297-45ac-afc6-898ba44531ad' />
        </div>

        <style jsx>{`
          .pane-text {
            flex: 1;
            flex-shrink: 0;
            padding: 30px;
            justify-content: center;
            padding-bottom: 100px;
          }
          .pane-title {
            font-size: 24px;
            color: ${colors.grey[800]};
            margin-bottom: 20px;
          }
          .pane-description {
            color: ${colors.grey[600]};
            line-height: 24px;
          }
          .pane-row {
            justify-content: space-between;
          }
          .image {
            max-width: 633px;
            max-height: 440px;
            width: auto;
            height: auto;
            box-shadow: 10px 10px 47px 0px rgba(0,0,0,0.28);
            border-radius: 5px;
            max-width: 60%;
          }  
        `}</style>
      </Layout>
    )
  }
}

class Landing extends React.Component {
  render () {
    return (
      <div className='landing'>
        <Layout>
          <div style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <img src='/static/textto-header.svg' style={{ width: 600, alignSelf: 'center', objectFit: 'contain' }} />
            <div style={{ height: 60 }} />
            <div className='title-col'>
              <h1 className='title'>
                Send and Receive Texts as Email
              </h1>
              <div style={{ height: 30 }} />
              <Link href='/profile'>
                <Button title='Sign up now' />
              </Link>
            </div>
          </div>
        </Layout>

        <style jsx>{`
          .title-col {
            align-items: center;
            justify-content: center;
          }
          .landing {
            min-height: 600px;
          } 
          .title {
            font-size: 42px;

          } 
          .subtitle {
            font-size: 24px;
            color: ${colors.grey[600]};
          }
        `}</style>
      </div>
    )
  }
}

class Home extends React.Component {
  render () {
    return (
      <Format>
        <Head />
        <Navbar />
        <Landing {...this.props} />
        <Badges {...this.props} />
        <Panes {...this.props} />
        <Footer />
      </Format>
    )
  }
}

export default Home
