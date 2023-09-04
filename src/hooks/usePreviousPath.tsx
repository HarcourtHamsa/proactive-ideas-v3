import React, { useRef } from 'react'
import { useRouter } from 'next/router'

const usePreviousRoute = () => {
  const { asPath } = useRouter();
  const storage: any = globalThis?.sessionStorage;

  function setItem(value: string) {
  
    
    return storage.setItem("prevPath", value);
  }

  const getItem = "/";




  return [getItem, setItem];
};
export default usePreviousRoute