import { useEffect } from 'react';

function UnscrollableBody() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = null;
    };
  }, []);

  return null;
}

export default UnscrollableBody;
