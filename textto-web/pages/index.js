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
        <Footer />
      </Format>
    )
  }
}

export default Home
