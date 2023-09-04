import React from 'react'
import {
    FacebookShareButton,
    FacebookIcon,
    PinterestShareButton,
    PinterestIcon,
    RedditShareButton,
    RedditIcon,
    WhatsappShareButton,
    WhatsappIcon,
    LinkedinShareButton,
    LinkedinIcon,
} from 'next-share';
import { IoLink } from 'react-icons/io5';
import { TbLink } from 'react-icons/tb';

export default function ShareButton({ url }: { url: string }) {
    const copylink = (url: string) => {
        navigator.clipboard.writeText(url)
    }

    return (
        <div>
            <p className='text-lg font-semibold'>Share: </p>
            <div className='flex gap-2'>

                <FacebookShareButton
                    url={url} >
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <RedditShareButton
                    url={url} >
                    <RedditIcon size={32} round />
                </RedditShareButton>
                <WhatsappShareButton
                    url={url} >
                    <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <LinkedinShareButton
                    url={url} >
                    <LinkedinIcon size={32} round />
                </LinkedinShareButton>

                <TbLink size={26} className='cursor-pointer' title='Copy link' onClick={() => copylink(url)}/>
            </div>
        </div>
    )
}