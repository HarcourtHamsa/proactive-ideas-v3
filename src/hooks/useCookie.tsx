import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { decryptData } from '@/helper';
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const typedSession = session as unknown as CookieInterface

  useEffect(() => {
    const encryptedToken = getCookie('tkn');

    if (!encryptedToken) {
      setCookieObj(null);
      return;
    }

    const fetchedCookieObj = decryptData(encryptedToken);
    setCookieObj(fetchedCookieObj);
  }, []);

  return cookieObj || typedSession || null;
}
