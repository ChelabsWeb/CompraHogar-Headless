import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/cuenta/',
        '/cart/',
        '/checkout/',
        '/login',
        '/registro',
        '/recuperar-password',
        '/olvide-password',
        '/*?*filter=*',
        '/*?*sort=*',
        '/*?*minPrice=*',
        '/*?*maxPrice=*',
        '/*?*cursor=*',
        '/*?*direction=*',
        '/*?*utm_*',
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sitemap.xml`,
  };
}
