import React from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useCreateTransactionMutation, useEnrollToCourseMutation } from '@/features/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Spinner from './Spinner';
import { useRouter } from 'next/router';
import flutterwaveLogo from "@/assets/flutterwave.png"
import Image from 'next/image';

export default function PaymentButton({ amount, courseId, currency }: { amount: string, courseId: string, currency: string }) {
    const { "0": enroll, "1": enrollStatus } = useEnrollToCourseMutation();
    const authState = useSelector((state: RootState) => state.auth)
    const router = useRouter();


    const formatAmount = (v: string) => {
        return parseInt(v?.split(",").join(""))
    }


    interface ITransaction {
        amount: number
        transaction_id: number
        user: string
        is_paid_course: boolean
        currency: String
        course: string
    }


    const handleCreateTx = (body: ITransaction) => {
        enroll({ body }).then((res) => {
          
        }).catch(err => {
            throw err;
        });
    }


    const config: any = {
        public_key: 'FLWPUBK-37476be98871b8cf4636d148f5fed7a9-X',
        tx_ref: Date.now(),
        amount: formatAmount(amount),
        currency: currency,
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            email: 'hamsaharcourt@gmail.com',
            phone_number: '070********',
            name: 'Hamsa Harcourt',
        },
        customizations: {
            title: 'Purchase Course',
            description: 'Payment for items in cart',
            logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        },
    };

    const handleFlutterPayment = useFlutterwave({ ...config });

    return (
        <button
            className='py-3 px-4 tracking-wider text-sm uppercase flex items-center gap-1 justify-center bg-[#FF9B00] text-[#fff] w-full rounded'
            onClick={() => {
                handleFlutterPayment({
                    callback: (response) => {
                        closePaymentModal() // this will close the modal programmatically
                        console.log(response);
                        handleCreateTx({
                            amount: response?.amount as any,
                            transaction_id: response?.transaction_id,
                            user: authState?.auth?.user.id,
                            is_paid_course: true,
                            currency: response?.currency as string,
                            course: courseId
                        })

                        setTimeout(() => {
                            router.push({ pathname: `/courses/id/${courseId}` })
                        }, 1000);
                    },
                    onClose: () => {
                        
                    },
                });
            }}
        >
            {enrollStatus.isLoading && <Spinner />}   
            
           
            Pay with flutterwave
        </button >
    );
}