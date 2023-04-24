import { injectScript } from '@module-federation/utilities'
import { lazy, Suspense } from 'react'

const dynamicContainer = injectScript('shop')
  .then(container => container.get('./Search'))
  .then(factory => factory())

const DynamicComponent = lazy(() => dynamicContainer);
export function Pricing({ test }) {
  return (
    <>
      <Suspense fallback={null}>
        <DynamicComponent/>
      </Suspense>
      <h1>{test}</h1>
    </>
  )
}

export async function getServerSideProps() {
  const test = Date.now() % 10000
  return {
    props: {
      test,
    },
  };
}

export default Pricing
