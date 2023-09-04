// pages/api/get-encrypted-data.ts
import { decryptData } from '@/helper';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
    const encryptedValue = req.cookies.encryptedObject;

    if (encryptedValue) {
        const decryptedObject = decryptData(encryptedValue);
        res.status(200).json({ decryptedObject });
    } else {
        res.status(401).json({ message: 'Encrypted object not found' });
    }
};
