# Danville Civic Digest

An independent student civic-tech project that helps residents find public meeting agendas.

## Stack
- Static HTML, CSS, and JavaScript frontend
- Vercel serverless function at `/api/meetings`
- Official Town of Danville Agenda Center RSS feed

## Deploy to Vercel
1. Import this GitHub repository into Vercel.
2. Leave Framework Preset as **Other**.
3. Leave Build Command and Output Directory blank (or use the defaults for a static site).
4. Deploy.

Vercel automatically detects the `api/` folder as serverless functions.

## Data and transparency
The site reads the Town of Danville's public Agenda Center RSS feed. It does not create AI-generated summaries or claim that extracted keywords are official interpretations. Always consult the linked official agenda for authoritative information.

Official Agenda Center: https://www.danville.ca.gov/AgendaCenter
RSS directory: https://danville.ca.gov/Rss.aspx

This independent project is not affiliated with or endorsed by the Town of Danville.
