import React, {useEffect, useState} from 'react'
import {animateScroll as scroll} from 'react-scroll'

function ProgressBar() {
    const [progress, setProgress] = useState(0);

useEffect(() => {
    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const windowHeight =
        window.document.documentElement.scrollHeight -
        window.document.documentElement.clientHeight;
      const progress = (scrollTop / windowHeight) * 100;
      setProgress(progress);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, [])

const scrollToTop = () => {
    scroll.scrollToTop();
  };


  return (
    <div>
         <div className={`h-[6px] rounded-r-lg z-[900000000] fixed progressbar`} style={{ width: `${progress}%` }}>
         
         </div>
    </div>
  )
}

export default ProgressBar