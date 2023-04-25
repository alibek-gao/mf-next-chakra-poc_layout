import { useMemo, lazy, Suspense, useState, useEffect } from 'react'
import { injectScript } from '@module-federation/utilities'
import { useRouter } from 'next/router'

// TODO: replace with a LRU cache or something similar
const remotePagesMap = new Map();

function DynamicComponent({ props, slug }) {
  const Component = useMemo(() => {
    if (typeof window === 'undefined') {
      return remotePagesMap.get(`/test/${slug}`);
    }
    return lazy(() => {
      return injectScript('shop')
        .then(container => container.get(`./test/${slug}`))
        .then(factory => factory())
    })
  }, [slug]);

  return (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  );
}

export function Page(props) {
  const router = useRouter();
  const { slug } = router.query
  const slugString = slug[0]

  // this is a hack to prevent the page from infinitely re-rendering
  const [oldSlug, setOldSlug] = useState(slugString)

  useEffect(() => {
    setOldSlug(slugString)
  }, [slugString])

  if (slugString !== oldSlug) {
    return null
  }
  // end hack

  return <DynamicComponent props={props} slug={slugString} />;
}

export const getServerSideProps = async (ctx) => {
  const path = ctx.resolvedUrl.split('?')[0];

  const container = await injectScript('shop');
  const remote = await container.get(`.${path}`)
    .then((factory) => factory());


  if (typeof window === 'undefined') {
    remotePagesMap.set(
      path,
      remote.default
    );
  }

  const props = (await remote.getServerSideProps(ctx)).props;

  return { props }
}

export default Page;
