import React from 'react'
import {
  colors
} from '@corcos/lib'
import {
  Data
} from '@corcos/components'
import { withRouter } from 'next/router'
import Link from 'next/link'
import StripeCheckout from 'react-stripe-checkout'

import {
  Head,
  Navbar,
  Layout,
  Loading,
  Footer,
  Button,
  Format
} from '../../components'

import Context from '../../lib/context'
import { db, firebase } from '../../lib/firebase'

const pricingData = [
  {
    title: 'Free',
    pricePerMonth: 0,
    features: [
      {
        title: '100 Messages, 30 Days',
        active: true
      },
      {
        title: 'Call Forwarding',
        active: false
      }
    ]
  },
  {
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
]

const PricingButton = (props) => {
  if (!props.user) {
    // if there is no user signed in, direct them to the signup page
    return (
      <Link href='/profile'>
        <Button title={`Get Started - $${props.pricePerMonth}`} onClick={() => {}} />
      </Link>
    )
  }
  if (!props.user.active && (props.title !== 'Free')) {
    // if there is a user but that user is not active, show stripe checkout
    return (
      <StripeCheckout
        email={props.user.email}
        token={(t) => props._onToken(t)}
        stripeKey={process.env.NODE_ENV === 'production' ? 'pk_live_C0kjiX1jMux2l16Jat7jfLDF00405qyRoc' : 'pk_test_4ycdFnKrp2rSb2sicmQAziFi00E2TT9frb'}>
        <Button title={`Upgrade - $${props.pricePerMonth}`} onClick={() => {}} />
      </StripeCheckout>
    )
  }
  return (
    <Link href='/profile'>
      <Button title={`View Profile`} onClick={() => {}} />
    </Link>
  )
}

export class PricingBox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  _onToken = async (token) => {
    this.setState({ loading: true })
    try {
      const res = await firebase.functions().httpsCallable('createSubscription')({
        token
      })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
    this.setState({ loading: false })
    window.alert('Your account has been upgraded!')
    this.props.router.push('/profile')
    console.log(token)
  }

  render () {
    return (
      <div className='card'>
        {this.state.loading && <Loading />}
        <h2 className='title'>
          {this.props.title}
        </h2>
        <div className='price'>
          <span className='dollar'>$</span>
          <span className='amount'>{this.props.pricePerMonth}</span>
          <span className='per-month'>/mo</span>
        </div>
        <div className='features'>
          <div className='line' />
          {this.props.features.map(f => {
            return (
              <div key={f.title} className={`feature-title ${f.active ? '' : 'strike'}`}>{f.title}</div>
            )
          })}
        </div>
        <PricingButton {...this.props} _onToken={this._onToken} />

        <style jsx>{`
          .features {
            width: 100%;
            margin-bottom: 15px;
          }
          .feature-title {
            text-align: center;
            margin-bottom: 10px;
          }
          .strike {
            text-decoration: line-through;
            color: ${colors.grey[400]};
          }
          .line {
            margin-bottom: 15px;
            height: 1px;
            width: 80%;
            align-self: center;
            background-color: ${colors.grey[200]};
          }
          .dollar {
            color: ${colors.grey[600]};
            position: absolute;
            top: 20px;
            left: -10px;
          }
          .amount {
            display: inline;
            font-size: 4em;
          }
          .per-month {
            position: absolute;
            color: ${colors.grey[600]};
            bottom: 15px;
            right: -30px;
          }
          .price {
            flex-direction: row;
            justify-content: center;
            align-items: center;
            position: relative;
            width: fit-content;
          }
          .title {
            font-size: 1.3em;
            color: ${colors.grey[800]};
            text-align: center;
          }
          .card {
            align-items: center;
            width: 300px;
            margin: 10px;
            padding: 20px;
            border: 1px solid ${colors.grey[300]};
            border-radius: 5px;
            transition: all 0.3s ease;
          }
          .card:hover {
            box-shadow: 3px 3px 8px -2px rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </div>
    )
  }
}

class PriceRow extends React.Component {
  render () {
    return (
      <Layout>
        <h1 className='title'>
          Pricing
        </h1>
        <div className='pricing-box-row'>
          {pricingData.map(d => {
            return <PricingBox key={d.title} {...d} {...this.props} />
          })}
        </div>

        <style jsx>{`
          .pricing-box-row {
            flex-direction: row;
            justify-content: center;
          }
          .title {
            font-size: 2em;
            text-align: center;
            margin-bottom: 30px;
          }
        `}</style>
      </Layout>
    )
  }
}

const faqData = [
  {
    title: 'How much does it cost?',
    details: 'This product is free to get started and $30 per month for unlimited messaging.'
  },
  {
    title: 'Can I use my existing phone number?',
    details: `Unfortunately you cannot use your existing phone number, 
      but we've found that most people don't have any problem using a 
      second number—many people maintain several numbers for different 
      purposes. And since the whole point of this app is to move your
      messaging from synchronous SMS to asynchronous email, receiving
      texts on your current device would largely defeat the purpose.\n\n
      If we were to use your existing phone number, we would 
      have to transfer the number from your current provider, which is 
      more effort than it's worth. You can also forward calls from the
      number you set up to your primary phone.`
  },
  {
    title: 'What happens to my number if I don\'t upgrade?',
    details: `When the 30 day trial expires, the phone number will be released and made available
      to another customer.`
  }
]

class Faq extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      accordionIndex: null
    }
  }

  render () {
    return (
      <div>
        <div className='title'>
          Frequently Asked Questions
        </div>
        <div className='accordion'>
          {faqData.map((d, i) => {
            return (
              <div className='cell' key={'accordion' + i}>
                <div className='title-row' onClick={() => this.setState({ accordionIndex: this.state.accordionIndex === i ? null : i })}>
                  <div className='faq-title'>{d.title}</div>
                  <div className='arrow-container' onClick={() => this.setState({ accordionIndex: this.state.accordionIndex === i ? null : i })}>
                    <i className={`arrow ${this.state.accordionIndex === i ? 'up' : 'down'}`} />
                  </div>
                </div>
                <div className={`details ${this.state.accordionIndex === i ? 'active' : ''}`}>
                  <div style={{ padding: '30px 30px 60px 30px', lineHeight: '24px' }}>
                    {d.details}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <style jsx>{`
          .arrow {
            cursor: pointer;
            border: solid black;
            border-width: 0 5px 5px 0;
            display: inline-block;
            padding: 10px;
            transition: all 0.3s ease;
            margin-right: 20px;
          }
          .arrow:hover {
            opacity: 0.6;
          }
          .up {
            margin-top: 5px;
            transform: rotate(-135deg);
            -webkit-transform: rotate(-135deg);
          }

          .down {
            margin-bottom: 5px;
            transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
          }
          .faq-title {
            font-size: 1.5em;
            padding-bottom: 30px;
          }
          .details {
            max-height: 0px;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          .active {
            max-height: 400px;
          }
          .title-row {
            flex-direction: row;
            justify-content: space-between;
            border-bottom: 1px solid ${colors.grey[300]};
            margin-bottom: 30px;
            cursor: pointer;
          }
          .title {
            font-size: 2em;
            text-align: center;
            margin-bottom: 30px;
          }  
          .cell {
            overflow: hidden;
          }
        `}</style>
      </div>
    )
  }
}

class Pricing extends React.Component {
  render () {
    return (
      <Format>
        <Head />
        <Navbar />
        <PriceRow {...this.props} />
        <Layout>
          <Faq {...this.props} />
        </Layout>
        <Footer />
      </Format>
    )
  }
}

class WithData extends React.Component {
  static contextType = Context

  render () {
    if (!this.context.currentUser.uid) {
      return <Pricing {...this.props} />
    }
    return (
      <Data query={db.collection('users').doc(this.context.currentUser.uid)}>
        {({ data: user, loading }) => {
          if (loading) return <div>Loading...</div>
          return (
            <Pricing user={user} {...this.props} />
          )
        }}
      </Data>
    )
  }
}

export default withRouter(WithData)
