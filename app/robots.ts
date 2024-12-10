import { MetadataRoute } from 'next'
import { options } from "@/.velite";
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${options.basepath}/sitemap.xml`,
  }
}