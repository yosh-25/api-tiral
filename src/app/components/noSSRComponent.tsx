// pages/nossrpage.js
import React from 'react';
import dynamic from 'next/dynamic';

interface NoSSRComponentProps {
    params: {
      id: string;
    };
  }

  const NoSSRComponent: React.FC<NoSSRComponentProps> = ({ params }) => {
    return <div>ID is: {params.id}</div>;
  };

  export default NoSSRComponent;
