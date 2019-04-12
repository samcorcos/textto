import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render () {
    return (
      <html>
        <Head>
          <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,600' rel='stylesheet' />
        </Head>
        <body className='custom_class'>
          <script src='https://js.stripe.com/v3/' />
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
