import { useCallback, useRef } from 'react';

function useThrottle(callback, delay) {
  const lastCallRef = useRef(null);

  return useCallback(function () {
    if (lastCallRef.current == null || Date.now() - lastCallRef.current > delay) {
      callback.apply(this, arguments);
      lastCallRef.current = Date.now();
    }
  }, [callback, delay]);
}

export default useThrottle