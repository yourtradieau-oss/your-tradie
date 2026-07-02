// Your Tradie — Auto Blog System
// Run: node autoblog.js

const https = require("https");
const crypto = require("crypto");

const GHOST_URL = "https://australians-tradies.ghost.io";
const GHOST_ADMIN_KEY = "6a45b4c4b5804d000180af02:68cdfbbcf0ce7f62cfe4cee6e77f2bca88740d1acda41974ea0bd991f44eb867";
const ANTHROPIC_KEY = "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";
const ARTICLES_PER_RUN = 3;

// TOPICS — only credible, genuinely useful content
// For tradies: business growth, reputation, skills
// For homeowners: education, process, what to expect
const TOPICS = [

  // FOR TRADIES — Business & Growth
  "How to get more customers as a tradie without paying for leads",
  "How to build your reputation as a tradie in Australia",
  "Why tradies should have an online profile in 2026",
  "How word of mouth still wins customers for Australian tradies",
  "How to get your first online review as a tradie",
  "Why photos of your work are the best marketing a tradie can do",
  "How to write a tradie bio that actually gets you hired",
  "The real cost of lead fee platforms for Australian tradies",
  "Why tradies are moving away from hipages and Oneflare",
  "How to grow a tradie business through referrals",
  "How to stand out as a tradie in a crowded market",
  "What makes homeowners choose one tradie over another",
  "How to turn one job into five through customer relationships",
  "Why your tradie reputation is your most valuable business asset",
  "How Australian tradies can build a personal brand",
  "How to handle a bad review as a tradie",
  "Why a flat subscription beats paying per lead for tradies",
  "How to build trust with new customers as a tradie",
  "The difference between a good tradie and a great tradie — what customers say",
  "How to use your completed work to win more jobs",
  "Why tradies who invest in their profile get more work",
  "How to ask customers for a review without it being awkward",
  "What Australian homeowners actually look for when choosing a tradie",
  "How to keep customers coming back as a tradie",
  "Why showing up on time is the most underrated tradie skill",
  "How communication wins more jobs than price for tradies",
  "How to build a five-star reputation as a new tradie",
  "Why tradies need a digital presence to survive in 2026",
  "How to make your tradie business recession proof",
  "What the best tradies in Australia do differently",

  // FOR HOMEOWNERS — Education & Process
  "How to know if a tradie is licensed and legitimate in Australia",
  "What is an ABN and why does it matter when hiring a tradie",
  "Red flags to watch for when hiring a tradie in Australia",
  "Questions to ask any tradie before you hire them",
  "How to get the most out of a tradie quote",
  "What to do if a tradie does poor quality work",
  "How to prepare your home before a tradie arrives",
  "Why verified tradies are worth it for Australian homeowners",
  "How to read a tradie's reviews and what to look for",
  "The difference between licensed and unlicensed tradies in Australia",
  "How to manage a home renovation without losing your mind",
  "What homeowners wish they knew before their first renovation",
  "How to build a good working relationship with your tradie",
  "Why the cheapest quote is rarely the best choice",
  "What to expect from a tradie on your first meeting",
  "How to spot a genuine tradie from a dodgy one",
  "What Australian consumer rights apply when hiring a tradie",
  "How to check a tradie's licence in Australia",
  "Why reviews matter more than word of mouth alone",
  "What to do before, during and after a tradie job",
  "How to get the best result from your bathroom renovation",
  "How to get the best result from your kitchen renovation",
  "What to look for in a tradie's portfolio of work",
  "Why homeowners should always check a tradie's credentials",
  "How to avoid tradie scams in Australia",
  "What insurance should a tradie have before working on your home",
  "How to plan a home renovation from start to finish",
  "Why communication is the key to a successful tradie job",
  "What to do if a tradie doesn't finish the job",
  "How online tradie profiles are changing the way Australians find tradespeople",
];

function getRandomTopics(count) {
  const shuffled = [...TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// HELPERS
function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

function getGhostToken() {
  const [id, secret] = GHOST_ADMIN_KEY.split(":");
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT", kid: id })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ iat: now, exp: now + 300, aud: "/admin/" })).toString("base64url");
  const signature = crypto.createHmac("sha256", Buffer.from(secret, "hex")).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${signature}`;
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// GENERATE ARTICLE
async function generateArticle(topic) {
  console.log(`\n📝 Generating: "${topic}"`);

  const prompt = `You are a senior content writer for Your Tradie, Australia's tradie directory platform. Write a high-quality, genuinely useful blog article about: "${topic}"

REQUIREMENTS:
- Length: 900-1200 words
- Tone: Honest, practical, conversational — like advice from someone who knows the industry
- Australian spelling (colour, labour, licence, neighbour, organise)
- Write for 2026 — current and relevant to the Australian market
- Every point must be genuinely useful — no filler, no obvious statements
- Do NOT mention specific prices or costs — we don't know them and they change
- Do NOT name or recommend specific tradies or businesses
- Naturally mention "Your Tradie" as a platform where Australians connect with verified local tradies (once or twice, not more)
- The platform is yourtradieaustralia.com
- Use clear subheadings to break up the content
- End with a strong, practical conclusion

FORMAT AS JSON ONLY:
{
  "title": "The article title — compelling and specific",
  "excerpt": "A 1-2 sentence summary under 155 characters",
  "html": "The full article in HTML using <h2>, <p>, <ul>, <li> tags only"
}

Return ONLY valid JSON. No markdown code blocks, no extra text before or after.`;

  const body = JSON.stringify({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2500,
    messages: [{ role: "user", content: prompt }],
  });

  const response = await httpsRequest(
    {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    body
  );

  if (response.status !== 200) throw new Error(`Anthropic error: ${JSON.stringify(response.body)}`);

  const text = response.body.content[0].text;
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const article = JSON.parse(cleaned);

  console.log(`  ✅ Generated: "${article.title}"`);
  return article;
}

// PUBLISH TO GHOST
async function publishToGhost(article) {
  console.log(`  📤 Publishing to Ghost...`);

  const token = getGhostToken();
  const ghostHost = GHOST_URL.replace("https://", "");

  const postData = {
    posts: [{
      title: article.title,
      slug: slugify(article.title),
      html: article.html,
      custom_excerpt: article.excerpt,
      status: "published",
      tags: [{ name: "Australia" }, { name: "Tradies" }],
    }],
  };

  const body = JSON.stringify(postData);

  const response = await httpsRequest(
    {
      hostname: ghostHost,
      path: "/ghost/api/admin/posts/?source=html",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Ghost ${token}`,
        "Content-Length": Buffer.byteLength(body),
      },
    },
    body
  );

  if (response.status === 201) {
    const post = response.body.posts[0];
    console.log(`  ✅ Published: ${GHOST_URL}/${post.slug}/`);
    return post;
  } else {
    throw new Error(`Ghost error ${response.status}: ${JSON.stringify(response.body)}`);
  }
}

// MAIN
async function main() {
  console.log("🚀 Your Tradie — Auto Blog");
  console.log(`📅 ${new Date().toLocaleString("en-AU", { timeZone: "Australia/Brisbane" })}`);
  console.log(`📰 Publishing ${ARTICLES_PER_RUN} articles...\n`);

  const topics = getRandomTopics(ARTICLES_PER_RUN);
  let success = 0, failed = 0;

  for (const topic of topics) {
    try {
      const article = await generateArticle(topic);
      await publishToGhost(article);
      success++;
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✅ Done — ${success} published, ${failed} failed`);
  console.log(`💰 Estimated cost: ~$${(success * 0.01).toFixed(2)}`);
}

main().catch(console.error);

// DAILY SCHEDULE — run in Terminal:
// crontab -e
// Add this line:
// 0 8 * * * cd ~/Desktop/Your\ Tradie/blog-system && node autoblog.js >> autoblog.log 2>&1
