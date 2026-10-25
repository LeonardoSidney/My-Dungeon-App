import { useState } from 'react';

export function useMessageState () {
    const [message, setMessage] = useState('');

    return {
        message,
        setMessage
    };
}
