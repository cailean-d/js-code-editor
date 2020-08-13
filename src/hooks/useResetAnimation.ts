import { useState, useEffect } from 'react';

export default function useResetAnimation(dependency: any[]) {
  const [ animation, setAnimation ] = useState('');

  useEffect(() => {
    setAnimation('none');
    const r = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimation('');
      })
    })
    return () => {
      cancelAnimationFrame(r);
    }
  }, dependency);

  return animation;
}
