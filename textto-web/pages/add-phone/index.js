import React from 'react'
import {
  Layout,
  Data,
  Loading,
  Button,
  Input
} from '@corcos/components'
import {
  colors
} from '@corcos/lib'
import _ from 'lodash'
import { withRouter } from 'next/router'

import {
  Head,
  Navbar,
  Format
} from '../../components'

import Context from '../../lib/context'
import { db, firebase } from '../../lib/firebase'

const selectPhoneNumber = async (phoneNumber, setState, navigate) => {
  const confirm = window.confirm(`Are you sure you want to select ${phoneNumber.friendlyName} as your phone number?`)
  if (confirm) {
    setState({ loading: true })
    try {
      await firebase.functions().httpsCallable('selectPhoneNumber')({
        phoneNumber
      })
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
    }
    setState({ loading: false })
  }
}

class PhoneNumber extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  render () {
    const { friendlyName, locality, region } = this.props.phoneNumber
    return (
      <div className='container'>
        {this.state.loading && <Loading loading />}
        <div>
          <div className='number'>{friendlyName}</div>
          <div className='row'>
            <div className='locality'>{locality},&nbsp;</div>
            <div className='region'>{region}</div>
          </div>
        </div>
        <div>
          <Button title='Select' onClick={() => selectPhoneNumber(this.props.phoneNumber, (v) => this.setState(v), this.props.router.push)} />
        </div>

        <style jsx>{`
          .container {
            margin: 5px;
            padding: 5px 10px;
            border-radius: 5px;
            border: 1px solid ${colors.grey[300]};
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }
}

const getAvailablePhoneNumbers = _.debounce(async (setState, areaCode) => {
  setState({ loading: true })
  try {
    const { data } = await firebase.functions().httpsCallable('availablePhoneNumbers')({
      areaCode
    })
    console.log(data)
    setState({ availablePhoneNumbers: data.availablePhoneNumbers })
  } catch (err) {
    console.error(err)
  }
  setState({ loading: false })
}, 250)

class SearchPhoneNumbers extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      areaCode: '',
      loading: false,
      availablePhoneNumbers: []
    }
  }

  _handleChange = (v) => {
    // allow user to remove all area codes
    if (v.length < 1 || /^\d*$/g.test(v)) {
      this.setState({ areaCode: v.slice(0, 3) })
      getAvailablePhoneNumbers((v) => this.setState(v), v)
    // Otherwise inform user of error
    } else {
      window.alert('Only numbers accepted for area codes. E.g. "415"')
    }
  }

  render () {
    return (
      <div>
        {this.state.loading && <Loading loading />}
        <div style={{ width: 100 }}>
          <Input label='Area Code (e.g. 415)' onChange={v => this._handleChange(v)} value={this.state.areaCode} />
        </div>
        {this.state.availablePhoneNumbers.map(p => <PhoneNumber phoneNumber={p} {...this.props} />)}
      </div>
    )
  }
}

class AddPhone extends React.Component {
  render () {
    return (
      <Format>
        <Head />
        <Navbar />
        <Layout>
          {this.props.user.phone ? (
            <div>Your number: {this.props.user.phone}</div>
          ) : (
            <SearchPhoneNumbers {...this.props} />
          )}

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
    if (!this.context.currentUser.uid) return <div>no user</div>
    return (
      <Data query={db.collection('users').doc(this.context.currentUser.uid)}>
        {({ data: user, loading }) => {
          if (loading) return <div>Loading...</div>
          return (
            <AddPhone user={user} {...this.props} />
          )
        }}
      </Data>
    )
  }
}

export default withRouter(WithData)
