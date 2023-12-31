import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET // "production"
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION // "2023-01-01"
export const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN // "2023-01-01"


const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: true,
    ignoreBrowserTokenWarning: true
});

export default client