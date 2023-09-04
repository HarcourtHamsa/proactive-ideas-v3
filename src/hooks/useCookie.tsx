import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { decryptData } from '@/helper';

// Define the shape of the cookie object
interface CookieInterface {
  user: {
    accessToken: string;
    email: string;
    id: string;
    role: string;
    name: string;
  };
  expiresAt: string;
}

export default function useCookie() {
  const [cookieObj, setCookieObj] = useState<CookieInterface | null>(null);

  useEffect(() => {
    // Fetch the encrypted token from the cookie
    const encryptedToken = getCookie('tkn');

    if (!encryptedToken) {
      // If no token is found, set cookieObj to null and return
      setCookieObj(null);
      return;
    }
    

    // Decrypt the token and set the cookieObj
    const fetchedCookieObj = decryptData(encryptedToken as string);
    setCookieObj(fetchedCookieObj);
  }, []);

  return cookieObj;
}
