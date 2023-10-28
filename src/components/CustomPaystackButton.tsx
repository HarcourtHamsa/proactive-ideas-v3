import { useEnrollToCourseMutation } from '@/features/apiSlice';
import useCookie from '@/hooks/useCookie';
import { useRouter } from 'next/router';
import React from 'react'
import { PaystackButton } from 'react-paystack';

interface ITransaction {
    amount: number
    trxref: string
    user: string
    is_paid_course: boolean
    currency: String
    course: string
}


function CustomPaystackButton({ amount, courseId, currency }: { amount: number, courseId: string, currency: string }) {
    const cookie = useCookie()
    const router = useRouter()
    const { "0": enroll, "1": enrollStatus } = useEnrollToCourseMutation();



    const config = {
        reference: (new Date()).getTime().toString(),
        email: cookie?.user.email as string,
        amount: amount * 100, // convert to kobo
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY as string,
    };

    const handleCreateTx = (body: any) => {
        enroll({ body }).then((res: any) => {

        }).catch((err: any) => {
            throw err;
        });
    }

    // you can call this function anything
    const handlePaystackSuccessAction = (reference: ITransaction) => {
        // Implementation for whatever you want to do with reference and after success call.
     

        handleCreateTx({
            amount: amount as any,
            transaction_id: reference?.trxref,
            user: cookie?.user.id,
            is_paid_course: true,
            currency: currency,
            course: courseId
        })

        setTimeout(() => {
            router.push({ pathname: `/courses/id/${courseId}` })
        }, 1000);
    };

    // you can call this function anything
    const handlePaystackCloseAction = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
    }

    const componentProps = {
        ...config,
        text: 'Pay with Paystack',
        onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
        onClose: handlePaystackCloseAction,
        className: 'py-3 border text-sm text-center mt-4 w-full rounded bg-[#3BB75E] text-white tracking-widest uppercase'
    };




    return (
        <div className=''>
            <PaystackButton {...componentProps} />
        </div>
    )
}

export default CustomPaystackButton