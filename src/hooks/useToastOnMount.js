
import { useEffect, useRef } from "react";

export function useToastOnMount(toastFn) {
  const shown = useRef(false);
  useEffect(() => {
    if (!shown.current) {
      shown.current = true;
      setTimeout(() => {
        toastFn();
      }, 800);
    }
  }, []);
}
