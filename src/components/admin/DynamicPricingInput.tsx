export default function DynamicPricingInput({ price, onChange, placeholder }: any) {
    return (
        <div className='space-y-2'>
            <div className='border rounded flex overflow-hidden h-12'>
                <div className='bg-gray-100 w-20 py-1 flex items-center justify-center text-gray-500'>{price.currency}</div>
                <input placeholder={placeholder} name={price.currency} type='number' className='bg-white w-full px-4' value={price.price} onChange={onChange} />
            </div>
        </div>
    )
}