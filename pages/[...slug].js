import { useMemo, lazy, Suspense, useState, useEffect } from 'react'
import { injectScript } from '@module-federation/utilities'
import { useRouter } from 'next/router'

// TODO: replace with a LRU cache
// TODO: or remove value from map after use but need to handle concurrency (e.g. async-lock)
const remotePagesMap = new Map();

// assuming `path` is `/remoteName/moduleName`
const getRemoteModule = async (path) => {
  const trimmedPath = path.replace(/^\/+/, '');
  const slashIndex = trimmedPath.indexOf('/');
  const remoteName =  slashIndex > -1 ? trimmedPath.substring(0, slashIndex) : trimmedPath;
  const moduleName = slashIndex > -1 ? trimmedPath.substring(slashIndex) : '/index';

  const container = await injectScript(remoteName);
  return await container.get(`.${moduleName}`).then((factory) => factory());
}

function DynamicComponent({ props, path }) {
  const Component = useMemo(() => {
    if (typeof window === 'undefined') {
      return remotePagesMap.get(path);
    }
    return lazy(() => getRemoteModule(path))
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
  // TODO: find out if there a better way to do this
  const [oldPath, setOldPath] = useState(path)
  useEffect(() => { setOldPath(path) }, [path])
  if (path !== oldPath) { return null }
  // end hack

  return <DynamicComponent props={props} path={path} />;
}

export const getServerSideProps = async (ctx) => {
  const path = ctx.resolvedUrl.split('?')[0];
  const realPath = ctx.req.url.split('?')[0];
  const isDirectPageRequest = path === realPath;

  try {
    const remoteModule = await getRemoteModule(path)

    if (isDirectPageRequest) {
      remotePagesMap.set(path, remoteModule.default);
    }

    if (typeof remoteModule.getServerSideProps === 'function') {
      return await remoteModule.getServerSideProps(ctx);
    }

    return {
      props: {}
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true
    };
  }
}

export default Page;
