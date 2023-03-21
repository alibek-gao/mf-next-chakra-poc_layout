import PricingPage from 'pricing/PricingPage';

const Pricing = PricingPage;

export const getServerSideProps = async (context) => {
  const page = await import('pricing/PricingPage');

  if (page.getServerSideProps) {
    return page.getServerSideProps(context);
  }

  return {
    props: {},
  };
}

export default Pricing;
