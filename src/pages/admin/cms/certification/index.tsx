import BackChevronButton from '@/components/BackChevronButton'
import Layout from '@/components/admin/Layout'
import HeroComponent from '@/components/admin/cms/certification/HeroComponent'
import SectionComponent from '@/components/admin/cms/certification/SectionComponent'
import client from '@/lib/sanity'
import React from 'react'
import { ToastContainer } from 'react-toastify'

function CertificationCMS({heroContent, sectionContent}: any) {
  return (
    <Layout>
            <div className='p-4'>
                <ToastContainer />
                <BackChevronButton />

                <h2 className='text-3xl mt-2 font-semibold'>Certification Page</h2>
                <HeroComponent heroContent={heroContent} />
                <SectionComponent sectionContent={sectionContent} />
            </div>
        </Layout>
  )
}

export default CertificationCMS


export async function getStaticProps() {
    const allContents = await client.fetch(`*[_type in ["certificationPagehero", "certificationPageSection"]]`)
    var heroContent: any = []
    var sectionContent: any = []

  
  
    allContents.map((data: any) => {
      if (data._type === "certificationPagehero") {
        heroContent.push(data)
      } else {
        sectionContent.push(data)
      }
    
    })
 
  
  
  
  
    return {
      props: {
        heroContent,
        sectionContent
      }
    };
}