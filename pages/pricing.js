import PricingPage from 'pricing/PricingPage';

const Pricing = PricingPage;

export const getServerSideProps = async (ctx) => {
  if (PricingPage.getServerSideProps) {
    return PricingPage.getServerSideProps(ctx);
  }

  return {
    props: {},
  }
}

export default Pricing;
