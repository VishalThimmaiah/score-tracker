import { NextResponse } from 'next/server'

export async function GET() {
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://deckmaster.vishalthimmaiah.com/</loc>
    <lastmod>2025-01-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

	return new NextResponse(sitemap, {
		status: 200,
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400',
		},
	})
}
