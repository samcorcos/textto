import React from 'react'
import {
  colors
} from '@corcos/lib'
import Link from 'next/link'

import {
  Head,
  Navbar,
  Layout,
  Footer,
  Button,
  Format
} from '../../components'

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

class PricingBox extends React.Component {
  render () {
    return (
      <div className='card'>
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
              <div className={`feature-title ${f.active ? '' : 'strike'}`}>{f.title}</div>
            )
          })}
        </div>
        <Link href='/profile'>
          <Button title={`Get Started - $${this.props.pricePerMonth}`} onClick={() => {}} />
        </Link>

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
            return <PricingBox {...d} />
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
              <div className='cell'>
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
            max-height: 200px;
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

export default Pricing
