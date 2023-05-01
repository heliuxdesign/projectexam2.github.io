import { getToken } from '../components/Storage';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function useCheckCredentials() {
    const navigate = useNavigate();
    useEffect(()=> {
        const token = getToken();  
        if (Array.isArray(token)) {
            navigate("/");
        }
    });
}
