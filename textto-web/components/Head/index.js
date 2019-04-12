import Head from 'next/head'

export default (props) => (
  <Head>
    <title>{props.title || 'TextTo - Send Texts by Email'}</title>
    <meta name='viewport' content='initial-scale=1.0, width=device-width' />
  </Head>
)
