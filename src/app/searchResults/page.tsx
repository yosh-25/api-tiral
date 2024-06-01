import dynamic from 'next/dynamic';

const searchResults = () => {
  const DynamicComponentWithNoSSR = dynamic(() => import('@/app/components/mypage/searchResults'), {
    ssr: false,
  });

  return <DynamicComponentWithNoSSR />;
};

export default searchResults;