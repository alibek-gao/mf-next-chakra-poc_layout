import { useRouter } from 'next/router'

export function Pricing({ cleanPath, realPath }) {
  const router = useRouter();
  const currentPath = router.asPath;
  return (
    <>
      <h1>cleanPath: {cleanPath}</h1>
      <h1>realPath: {realPath}</h1>
      <h1>clientPath: {currentPath}</h1>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const cleanPath = ctx.resolvedUrl.split('?')[0]
  const realPath = ctx.req.url.split('?')[0]

  return {
    props: {
      cleanPath: cleanPath,
      realPath: realPath
    },
  }
}

export default Pricing;
