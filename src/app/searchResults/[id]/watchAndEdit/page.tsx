'use client';
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";

const watch = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const DynamicComponentWithNoSSR = dynamic(() => import('@/app/components/searchResults[id]Watch'), {
    ssr: false,
  });

  return <DynamicComponentWithNoSSR id={id} />;
};

export default watch;