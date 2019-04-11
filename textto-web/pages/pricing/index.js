import React from 'react'
import {
  colors
} from '@corcos/lib'

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
        title: '100 Messages Per Month',
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
        <Button title={`Get Started - $${this.props.pricePerMonth}`} />

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

class Faq extends React.Component {
  render () {
    return (
      <div>
        <div className='title'>
          Frequently Asked Questions
        </div>

        <style jsx>{`
          .title {
            font-size: 2em;
            text-align: center;
            margin-bottom: 30px;
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
        <Faq {...this.props} />
        <Footer />
      </Format>
    )
  }
}

export default Pricing
