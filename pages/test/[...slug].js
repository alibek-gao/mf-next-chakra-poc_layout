import { useMemo } from 'react'
import { injectScript } from '@module-federation/utilities'
import dynamic from 'next/dynamic'
import Loadable from 'next/dist/shared/lib/loadable'

// TODO: replace with a LRU cache or something similar
const remotePagesMap = new Map();

function DynamicComponent({ remote, path, props }) {
  const Component = useMemo(() => {
    if (typeof window === 'undefined') {
      // if wrap this in a dynamic(), it doesn't render on the server
      return remotePagesMap.get(path);
    }
    return dynamic(() => {
      return injectScript(remote)
        .then(container => container.get(`.${path}`))
        .then(factory => factory())
    }, {
      ssr: true,
      // TODO: how to prevent hydration before Component is loaded?
      loading: () => null,
    })
  }, [remote, path]);

  return <Component {...props} />;
}

export function Page({ path, props }) {
  return <DynamicComponent remote="shop" path={path} props={props} />;
}

export const getServerSideProps = async (ctx) => {
  const path = ctx.resolvedUrl.split('?')[0];

  const container = await injectScript('shop');
  const remote = await container.get(`.${path}`)
    .then((factory) => factory());

  // remotePagesMap.set(path, remote.default);


  if (typeof window === 'undefined') {
    remotePagesMap.set(
      path,
      dynamic(() => Promise.resolve(remote.default), {
        ssr: true,
        // TODO: how to prevent hydration before Component is loaded?
        loading: () => null,
      })
    );

    await Loadable.preloadAll();
  }

  const props = (await remote.getServerSideProps(ctx)).props;

  return { props: { path, props } }
}

export default Page;
