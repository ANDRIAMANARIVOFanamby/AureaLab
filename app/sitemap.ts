export default async function sitemap() {
  const baseUrl = 'https://aurealab.vip'
  
  const routes = [
    { url: `${baseUrl}`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/services`, lastModified: new Date() },
    { url: `${baseUrl}/gallery`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/booking`, lastModified: new Date() },
  ]
  
  return routes
}