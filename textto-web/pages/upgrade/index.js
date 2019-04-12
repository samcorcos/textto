import React from 'react'
import {
  Data
} from '@corcos/components'

import {
  Head,
  Navbar,
  Format,
  Layout
} from '../../components'

import { db } from '../../lib/firebase'
import Context from '../../lib/context'

import { PricingBox } from '../pricing'

const upgradeData = {
  title: 'Unlimited',
  pricePerMonth: 30,
  features: [
    {
      title: 'Unlimited Messages',
      active: true
    },
    {
      title: 'Call Forwarding',
      active: true
    }
  ]
}

class Upgrade extends React.Component {
  render () {
    return (
      <Format>
        <Head />
        <Navbar />
        <Layout>
          <div className='container'>
            <div className='title'>Upgrade</div>
            <PricingBox {...this.props} {...upgradeData} />
          </div>

          <style jsx>{`
            .container {
              align-items: center;
            }
            .title {
              font-size: 2em;
              text-align: center;
            }
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
      return <Upgrade {...this.props} />
    }
    return (
      <Data query={db.collection('users').doc(this.context.currentUser.uid)}>
        {({ data: user, loading }) => {
          if (loading) return <div>Loading...</div>
          return (
            <Upgrade user={user} {...this.props} />
          )
        }}
      </Data>
    )
  }
}

export default WithData
