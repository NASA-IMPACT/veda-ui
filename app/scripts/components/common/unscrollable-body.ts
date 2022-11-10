import { useEffect } from 'react';

function UnscrollableBody() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return null;
}

export default UnscrollableBody;
