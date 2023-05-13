import { revalidate, FlushedChunks, flushChunks }from '@module-federation/nextjs-mf/utils';
import Document, { Html, Head, Main, NextScript } from 'next/document';
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    if(process.env.NODE_ENV === "development" && !ctx.req?.url.includes("_next")) {
      await revalidate().then((shouldReload) =>{
        if (shouldReload) {
          ctx.res.writeHead(302, { Location: ctx.req.url });
          ctx.res.end();
        }
      });
    } else {
      ctx?.res?.on("finish", () => {
        revalidate()
      });
    }

    const chunks = await flushChunks()

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      chunks
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <FlushedChunks chunks={this.props.chunks} />
        </Head>
        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
