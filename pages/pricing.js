import dynamic from 'next/dynamic';

const PricingComponent = dynamic(
  () => import('content/Pricing').then((mod) => mod.Pricing),
  {
    ssr: true,
  }
);
export function Pricing(props) {
  return <PricingComponent {...props} />
}

export const getServerSideProps = async (ctx) => {
  const pricing = await import('content/Pricing')

  return pricing.getServerSideProps(ctx)
}

export default Pricing;
