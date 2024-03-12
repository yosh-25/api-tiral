'use client'
import Image from "next/image";
import { YoutubeTranscript } from 'youtube-transcript';

export default function Home() {

  YoutubeTranscript.fetchTranscript('k4-tFEo3_LU').then(console.log);  


  return (
    <>
    <p>test</p>
    <button 
    type="button"
    >button</button>
    </>
  );
}
