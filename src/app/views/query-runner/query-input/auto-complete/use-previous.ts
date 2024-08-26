import { useRef, useEffect } from 'react';

const usePrevious = (value: string) => {
  const reference = useRef<string>('');
  useEffect(() => {
    reference.current = value;
  });
  return reference.current;
}

export { usePrevious }