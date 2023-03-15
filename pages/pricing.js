import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const PricingPage = dynamic(
  () => {
    return import('pricing/PricingPage');
  },
  { ssr: true }
);

export async function getServerSideProps(context) {
  const page = await import('pricing/PricingPage');

  if (page.getServerSideProps) {
    return page.getServerSideProps(context);
  }

  return {
    props: {},
  };
}

export function Pricing() {
  return (
    <PricingPage />
  );
}

export default Pricing;
