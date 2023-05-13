import { injectScript, getModule } from '@module-federation/utilities'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

function defaultPathResolver(path) {
  const trimmedPath = path.replace(/^\/+/, '');
  const slashIndex = trimmedPath.indexOf('/');
  const remoteContainer =  slashIndex > -1 ? trimmedPath.substring(0, slashIndex) : trimmedPath;
  const modulePath = slashIndex > -1 ? trimmedPath.substring(slashIndex) : '/index';

  return {
    remoteContainer,
    modulePath: `.${modulePath}`
  }
}

function defaultErrorHandler(error) {
  console.error(error);
  return {
    notFound: true
  };
}

export function createDynamicFederatedPage({
  pathResolver = defaultPathResolver,
  errorHandler = defaultErrorHandler,
  suspenseFallback = null
} = {}) {
  const getRemoteModule = async (path) => {
    const { remoteContainer, modulePath } = pathResolver(path);
    const remoteContainerGlobal = typeof remoteContainer === 'string' ? remoteContainer : remoteContainer.global;

    if (typeof window === 'undefined' || !window[remoteContainerGlobal]) {
      const container = await injectScript(remoteContainer);
      return await container.get(modulePath).then((factory) => factory());
    } else {
      return await getModule({
        remoteContainer,
        modulePath,
      });
    }
  }

  const DynamicComponent = ({ props, path }) => {
    const Component = useMemo(() => {
      return lazy(() => getRemoteModule(path))
    }, [path]);

    return (
      <Suspense fallback={suspenseFallback}>
        <Component {...props} />
      </Suspense>
    );
  }

  const Page = (props) => {
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

  const getServerSideProps = async (ctx) => {
    const path = ctx.resolvedUrl.split('?')[0];

    try {
      const remoteModule = await getRemoteModule(path);

      if (typeof remoteModule.getServerSideProps === 'function') {
        return await remoteModule.getServerSideProps(ctx);
      }

      return {
        props: {}
      };
    } catch (e) {
      return errorHandler(e);
    }
  }

  return {
    Page,
    getServerSideProps
  };
}