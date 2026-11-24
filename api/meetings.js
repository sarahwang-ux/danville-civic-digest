const FEED_URL = "https://danville.ca.gov/RSSFeed.aspx?CID=All-0&ModID=65";

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}
function tag(item, name) {
  const match = item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
  return match ? decodeXml(match[1].trim()) : "";
}
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1800");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).json({error:"Method not allowed"});
  try {
    const response = await fetch(FEED_URL, {
      headers: {"User-Agent":"Danville-Civic-Digest/1.0 (public civic information project)", "Accept":"application/rss+xml, application/xml, text/xml"},
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error(`Official feed returned HTTP ${response.status}`);
    const xml = await response.text();
    const items = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map(match => {
      const item = match[1];
      return {
        title: tag(item, "title").replace(/<[^>]*>/g, "").trim(),
        link: tag(item, "link").replace(/<[^>]*>/g, "").trim(),
        date: tag(item, "pubDate"),
        description: tag(item, "description").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
      };
    }).filter(item => item.title).slice(0, 30);
    return res.status(200).json({items, fetchedAt:new Date().toISOString(), source:FEED_URL});
  } catch (error) {
    console.error("Danville feed error:", error);
    return res.status(502).json({error:"Could not retrieve the Town of Danville agenda feed right now. Please try again or use the official Agenda Center."});
  }
};
