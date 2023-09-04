import cookie from 'cookie';
import { encryptData } from '@/helper';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
    const objectToEncrypt = req.body; // Replace with your object
    const encryptedValue = encryptData(objectToEncrypt);

    // Set a secure HTTP-only cookie
    res.setHeader('Set-Cookie', cookie.serialize('tkn', encryptedValue, {
        // httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Set to true in production
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    }));

    res.status(200).json({ message: 'Encrypted object set successfully' });
};



