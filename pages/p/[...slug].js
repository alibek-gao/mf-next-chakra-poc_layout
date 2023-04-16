import dynamic from 'next/dynamic';

const PricingComponent = dynamic(
  () => import('content/Pricing').then((mod) => mod.Pricing),
  {
    ssr: true,
  }
);

const ListComponent = dynamic(
  () => import('content/List').then((mod) => mod.List),
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
  const [pricing, list] = await Promise.all([
    import('content/Pricing'),
    import('content/List'),
  ]);

  if (pricing.getServerSideProps && list.getServerSideProps) {
    const [pricingProps, listProps] = await Promise.all([
      pricing.getServerSideProps(ctx),
      list.getServerSideProps(ctx),
    ]);
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
