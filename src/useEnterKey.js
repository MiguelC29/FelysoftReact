import { useEffect } from 'react';

const useEnterKey = (callback, condition = true) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' && condition) {
                callback(event);
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [callback, condition]);
};

export default useEnterKey;