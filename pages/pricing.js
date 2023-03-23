import dynamic from 'next/dynamic';

const PricingComponent = dynamic(
  () => import('pricing/Pricing').then((mod) => mod.Pricing),
  {
    ssr: true,
  }
);

const ListComponent = dynamic(
  () => import('pricing/List').then((mod) => mod.List),
  {
    ssr: true,
  }
);
export function Pricing({ pricingProps, listProps }) {
  return (
    <>
      <PricingComponent {...pricingProps} />
      <ListComponent {...listProps} />
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const pricing = await import('pricing/Pricing');
  const list = await import('pricing/List');

  if (pricing.getServerSideProps && list.getServerSideProps) {
    const pricingProps = await pricing.getServerSideProps(ctx)
    const listProps = await list.getServerSideProps(ctx)
    return {
      props: {
        pricingProps: pricingProps.props,
        listProps: listProps.props,
      }
    }
  }

  return {
    props: {},
  }
}

export default Pricing;
