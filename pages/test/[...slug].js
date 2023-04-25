import { useMemo, lazy, Suspense, useState, useEffect } from 'react'
import { injectScript } from '@module-federation/utilities'
import { useRouter } from 'next/router'

// TODO: replace with a LRU cache or something similar
const remotePagesMap = new Map();

const getRemoteModule = async (remoteName, path) => {
  const container = await injectScript(remoteName);
  return await container.get(`.${path}`).then((factory) => factory());
}

function DynamicComponent({ props, path }) {
  const Component = useMemo(() => {
    if (typeof window === 'undefined') {
      return remotePagesMap.get(path);
    }
    return lazy(() => getRemoteModule('shop', path))
  }, [path]);

  return (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  );
}

export function Page(props) {
  const router = useRouter();
  const path = router.asPath.split('?')[0]

  // this is a hack to prevent infinity re-rendering
  // when navigating between pages with the same path
  // and different slug
  // TODO: find a better way to do this
  const [oldPath, setOldPath] = useState(path)
  useEffect(() => { setOldPath(path) }, [path])
  if (path !== oldPath) { return null }
  // end hack

  return <DynamicComponent props={props} path={path} />;
}

export const getServerSideProps = async (ctx) => {
  const path = ctx.resolvedUrl.split('?')[0];

  try {
    const remoteModule = await getRemoteModule('shop', path)

    if (typeof window === 'undefined') {
      remotePagesMap.set(path, remoteModule.default);
    }

    return await remoteModule.getServerSideProps(ctx)
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
}

export default Page;
