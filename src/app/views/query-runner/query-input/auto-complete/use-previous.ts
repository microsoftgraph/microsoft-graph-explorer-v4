import { useRef, useEffect } from 'react';

const usePrevious = (value: string) => {
  const reference = useRef<any>(null);
  useEffect(() => {
    reference.current = value;
  });
  return reference.current;
}

export { usePrevious }