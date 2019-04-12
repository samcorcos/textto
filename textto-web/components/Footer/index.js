import React from 'react'
import {
  colors
} from '@corcos/lib'

import {
  Layout
} from '../'

class Footer extends React.Component {
  render () {
    return (
      <footer className='outer'>
        <div className='inner'>
          <Layout>
            <div className='content-row'>
              <div className='col33'>
                <div className='title'>
                  TextTo
                </div>
              </div>
            </div>
            <div className='copyright'>Copyright (c) 2019-Present - Higher Order Company - All Rights Reserved</div>
          </Layout>
        </div>

        <style jsx>{`
          .col33 {
            width: 33%;
          }
          .title {
            font-size: 1.5em;
          }
          .content-row {
            flex-direction: row;
            justify-content: space-around;
          }
          .outer {
            min-height: 300px;
            padding-top: 100px;
            background-color: ${colors.grey[100]};
            padding-bottom: 50px;
          }  
          .copyright {
            margin-top: 30px;
            font-size: 0.8em;
            text-align: center;
            color: ${colors.grey[500]};
          }
        `}</style>
      </footer>
    )
  }
}

export default Footer
