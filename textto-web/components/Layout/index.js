import React from 'react'
import { mediaQueries } from '@corcos/lib'

const { medium, small, extraLarge } = mediaQueries

/**
 * Standard layout component to bound and pad content.
 *
 * @param {Object} layout - the layout style
 * @param {Object} section - the section content
 */
class Layout extends React.Component {
  render () {
    return (
      <section className='layout'>
        <div className='section'>
          {this.props.children}
        </div>

        <style jsx>{`
          .layout {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
          }
          .section {
            flex: 1;
            width: 1080px;
            padding-top: 30px;
            padding-bottom: 30px;
          }
          @media ${medium} {
            .section {
              max-width: 750px;
            }
          }
          @media ${small} {
            .section {
              max-width: 90vw;
              padding-top: 30px ;
              padding-bottom: 30px;
            }
          }
          @media ${extraLarge} {
            .section {
              width: calc(90vw - 240px);
            }
          }
        `}</style>
      </section>
    )
  }
}

Layout.defaultProps = {
  layout: {},
  section: {}
}

export default Layout
