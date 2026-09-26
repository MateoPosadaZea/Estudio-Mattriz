// Escáner de sitios (v2): análisis del HTML de un sitio de negocio de servicios.
// Módulo puro (sin DOM ni red): lo usan el Worker de Cloudflare, la función de Netlify del preview
// y las pruebas. Detecta por firmas en el HTML y en las cabeceras; no ejecuta JavaScript del sitio,
// así que lo que se carga solo con JS después puede no aparecer (se dice en la página).

export type Hit = { id: string; name: string };

export type Page = { url: string; html: string; headers: Record<string, string> };

export type ScanResult = {
  url: string;
  finalUrl: string;
  https: boolean;
  pages: string[];
  platform: Hit[];
  builders: Hit[];
  booking: Hit[];
  payments: Hit[];
  contact: Hit[];
  chat: Hit[];
  analytics: Hit[];
  reviews: Hit[];
  tech: Hit[];
  seo: {
    title: string;
    description: string;
    h1: number;
    viewport: boolean;
    lang: string;
    canonical: boolean;
    ogImage: boolean;
    schema: string[];
    localBusiness: boolean;
  };
  weight: { htmlKB: number; scripts: number; thirdPartyScripts: number; images: number; imagesNoAlt: number; lazyImages: number };
};

type Sig = { id: string; name: string; re: RegExp };

const sig = (id: string, name: string, re: RegExp): Sig => ({ id, name, re });

// Plataformas y constructores.
const PLATFORM: Sig[] = [
  sig('wordpress', 'WordPress', /wp-content\/|wp-includes\/|<meta name="generator" content="WordPress/i),
  sig('wix', 'Wix', /static\.wixstatic\.com|wix-bolt|_wixCIDX|<meta name="generator" content="Wix/i),
  sig('squarespace', 'Squarespace', /static1\.squarespace\.com|squarespace-cdn\.com|Squarespace\.Constants/i),
  sig('shopify', 'Shopify', /cdn\.shopify\.com|Shopify\.theme|myshopify\.com/i),
  sig('webflow', 'Webflow', /assets(-global)?\.website-files\.com|data-wf-page|webflow\.js/i),
  sig('godaddy', 'GoDaddy Website Builder', /img1\.wsimg\.com|godaddy.*website builder|<meta name="generator" content="Starfield/i),
  sig('duda', 'Duda', /irp\.cdn-website\.com|dudamobile|d-deferred-script/i),
  sig('framer', 'Framer', /framerusercontent\.com|data-framer-/i),
  sig('weebly', 'Weebly / Square Online', /weebly\.com|editmysite\.com|square-online/i),
  sig('hubspot-cms', 'HubSpot CMS', /hs-sites\.com|hubspot\.net\/hub\/|<meta name="generator" content="HubSpot/i),
  sig('ghl', 'GoHighLevel', /leadconnectorhq\.com|msgsndr\.com|gohighlevel/i),
  sig('carrd', 'Carrd', /carrd\.co/i),
  sig('nextjs', 'Next.js', /\/_next\/static\/|__NEXT_DATA__/),
  sig('nuxt', 'Nuxt', /\/_nuxt\/|__NUXT__/),
  sig('gatsby', 'Gatsby', /___gatsby|\/page-data\//),
  sig('astro', 'Astro', /\/_astro\/|<meta name="generator" content="Astro/i),
];

const BUILDERS: Sig[] = [
  sig('elementor', 'Elementor', /elementor/i),
  sig('divi', 'Divi', /et_pb_|\/Divi\//),
  sig('wpbakery', 'WPBakery', /vc_row|js_composer/),
  sig('woocommerce', 'WooCommerce', /woocommerce/i),
  sig('beaver', 'Beaver Builder', /fl-builder/),
  sig('avada', 'Avada', /fusion-builder|Avada/),
  sig('salient', 'Salient', /salient/i),
  sig('gutenberg', 'Gutenberg', /wp-block-/),
];

// Reservas y agenda.
const BOOKING: Sig[] = [
  sig('calendly', 'Calendly', /calendly\.com/i),
  sig('acuity', 'Acuity Scheduling', /acuityscheduling\.com|squarespacescheduling\.com|as\.me\//i),
  sig('square-appointments', 'Square Appointments', /squareup\.com\/appointments|square\.site\/book|app\.squareup\.com\/appointments|book\.squareup\.com/i),
  sig('booksy', 'Booksy', /booksy\.com/i),
  sig('fresha', 'Fresha', /fresha\.com/i),
  sig('vagaro', 'Vagaro', /vagaro\.com/i),
  sig('setmore', 'Setmore', /setmore\.com/i),
  sig('simplybook', 'SimplyBook.me', /simplybook\.(me|it|us)/i),
  sig('mindbody', 'Mindbody', /mindbodyonline\.com|healcode/i),
  sig('housecall', 'Housecall Pro', /housecallpro\.com/i),
  sig('jobber', 'Jobber', /getjobber\.com|clienthub\.getjobber/i),
  sig('servicetitan', 'ServiceTitan', /servicetitan/i),
  sig('ghl-booking', 'GoHighLevel / LeadConnector', /leadconnectorhq\.com\/widget\/booking|msgsndr\.com/i),
  sig('calcom', 'Cal.com', /cal\.com\//i),
  sig('tidycal', 'TidyCal', /tidycal\.com/i),
  sig('zoho-bookings', 'Zoho Bookings', /zohobookings|bookings\.zoho/i),
  sig('hubspot-meetings', 'HubSpot Meetings', /meetings\.hubspot\.com/i),
  sig('youcanbook', 'YouCanBookMe', /youcanbook\.me/i),
  sig('wix-bookings', 'Wix Bookings', /wix-bookings|bookings-widget/i),
  sig('amelia', 'Amelia (WordPress)', /ameliabooking|amelia-app/i),
  sig('bookly', 'Bookly (WordPress)', /bookly/i),
  sig('ssa', 'Simply Schedule Appointments', /simply-schedule-appointments|ssa_booking/i),
  sig('opentable', 'OpenTable', /opentable\.com/i),
  sig('resy', 'Resy', /resy\.com/i),
  sig('google-booking', 'Google Calendar booking', /calendar\.app\.google|calendar\.google\.com\/calendar\/appointments/i),
];

// Pagos.
const PAYMENTS: Sig[] = [
  sig('stripe', 'Stripe', /js\.stripe\.com|checkout\.stripe\.com|buy\.stripe\.com/i),
  sig('square', 'Square', /web\.squarecdn\.com|squareup\.com\/(payments|checkout)|square\.link|checkout\.square\.site/i),
  sig('paypal', 'PayPal', /paypal\.com\/sdk|paypalobjects|paypal\.me/i),
  sig('wompi', 'Wompi', /wompi\.(co|com)/i),
  sig('mercadopago', 'Mercado Pago', /mercadopago|mercadolibre\.com\/checkout/i),
  sig('payu', 'PayU', /payulatam|payu\.com/i),
  sig('epayco', 'ePayco', /epayco/i),
  sig('clover', 'Clover', /clover\.com\/(pay|online)/i),
  sig('shopify-checkout', 'Shopify Checkout', /cdn\.shopify\.com.*checkout|Shopify\.Checkout/i),
  sig('woo-checkout', 'WooCommerce Checkout', /wc-checkout|woocommerce-checkout|\/checkout\//i),
  sig('venmo', 'Venmo', /venmo\.com/i),
  sig('zelle', 'Zelle', /zellepay|\bzelle\b/i),
];

// Contacto directo.
const CONTACT: Sig[] = [
  sig('whatsapp', 'WhatsApp', /wa\.me\/|api\.whatsapp\.com|web\.whatsapp\.com|whatsapp:\/\//i),
  sig('phone', 'Click-to-call', /href=["']tel:/i),
  sig('sms', 'SMS link', /href=["']sms:/i),
  sig('email', 'Email link', /href=["']mailto:/i),
  sig('form', 'Contact form', /<form[\s>]/i),
];

const CHAT: Sig[] = [
  sig('tawk', 'Tawk.to', /tawk\.to/i),
  sig('intercom', 'Intercom', /intercom(cdn)?\.(io|com)/i),
  sig('drift', 'Drift', /js\.driftt\.com|drift\.com/i),
  sig('crisp', 'Crisp', /client\.crisp\.chat/i),
  sig('tidio', 'Tidio', /tidio\.co|tidiochat/i),
  sig('livechat', 'LiveChat', /livechatinc\.com/i),
  sig('messenger', 'Messenger', /connect\.facebook\.net\/.*customerchat|m\.me\//i),
  sig('hubspot-chat', 'HubSpot Chat', /js\.hs-scripts\.com|usemessages\.com/i),
  sig('zendesk', 'Zendesk', /zdassets\.com|zendesk/i),
  sig('podium', 'Podium', /podium\.com/i),
  sig('whatsapp-widget', 'WhatsApp floating button', /(joinchat|wa-float|whatsapp-button|whatsapp-float|elfsight.*whatsapp)/i),
];

const ANALYTICS: Sig[] = [
  sig('ga4', 'Google Analytics 4', /gtag\/js\?id=G-|['"]G-[A-Z0-9]{6,}['"]/),
  sig('gtm', 'Google Tag Manager', /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]{5,}/),
  sig('google-ads', 'Google Ads', /['"]AW-\d{6,}|googleadservices/),
  sig('meta-pixel', 'Meta Pixel', /connect\.facebook\.net\/[^"']*fbevents\.js|fbq\(['"]init/),
  sig('tiktok', 'TikTok Pixel', /analytics\.tiktok\.com/i),
  sig('clarity', 'Microsoft Clarity', /clarity\.ms/i),
  sig('hotjar', 'Hotjar', /static\.hotjar\.com|hotjar/i),
  sig('ua', 'Universal Analytics (discontinued)', /['"]UA-\d{4,}-\d+['"]/),
];

const REVIEWS: Sig[] = [
  sig('google-reviews-widget', 'Google reviews widget', /(elfsight|trustindex|reviewsonmywebsite|embedsocial|trustmary|widget.*google.*review|google.*reviews?.*widget)/i),
  sig('yelp', 'Yelp', /yelp\.com\/biz/i),
  sig('trustpilot', 'Trustpilot', /trustpilot/i),
  sig('aggregate-rating', 'Rating in structured data', /"aggregateRating"|itemprop=["']aggregateRating/i),
  sig('google-maps', 'Google Maps embed', /google\.com\/maps\/embed|maps\.googleapis\.com/i),
];

const TECH: Sig[] = [
  sig('php', 'PHP', /\.php["'?]|x-powered-by: php/i),
  sig('jquery', 'jQuery', /jquery(\.min)?\.js|jquery-migrate/i),
  sig('react', 'React', /react(-dom)?(\.production)?(\.min)?\.js|data-reactroot|__REACT/i),
  sig('vue', 'Vue', /vue(\.runtime)?(\.global)?(\.prod)?(\.min)?\.js|data-v-[0-9a-f]{8}/i),
  sig('angular', 'Angular', /ng-version=|angular(\.min)?\.js/i),
  sig('bootstrap', 'Bootstrap', /bootstrap(\.min)?\.(css|js)/i),
  sig('tailwind', 'Tailwind CSS', /tailwind/i),
  sig('gsap', 'GSAP', /gsap(\.min)?\.js|greensock/i),
  sig('cloudflare', 'Cloudflare', /cf-ray:|server: cloudflare/i),
  sig('litespeed', 'LiteSpeed', /server: litespeed|x-litespeed/i),
  sig('nginx', 'Nginx', /server: nginx/i),
  sig('apache', 'Apache', /server: apache/i),
  sig('vercel', 'Vercel', /server: vercel|x-vercel-id/i),
  sig('netlify', 'Netlify', /server: netlify|x-nf-request-id/i),
  sig('recaptcha', 'reCAPTCHA', /recaptcha/i),
];

const match = (sigs: Sig[], text: string): Hit[] => sigs.filter((s) => s.re.test(text)).map(({ id, name }) => ({ id, name }));

const attr = (html: string, re: RegExp) => html.match(re)?.[1]?.trim() ?? '';

const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();

/** Tipos de schema.org declarados en JSON-LD (incluye @graph). */
function schemaTypes(html: string): string[] {
  const types = new Set<string>();
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const t of m[1].matchAll(/"@type"\s*:\s*(\[[^\]]*\]|"[^"]+")/g)) {
      for (const one of t[1].matchAll(/"([^"]+)"/g)) types.add(one[1]);
    }
  }
  return [...types];
}

// Tipos de schema que cuentan como negocio local (LocalBusiness y sus subtipos más comunes).
const LOCAL = /LocalBusiness|AutoRepair|AutoWash|AutomotiveBusiness|HomeAndConstructionBusiness|HealthAndBeautyBusiness|BeautySalon|DaySpa|HairSalon|NailSalon|Dentist|MedicalBusiness|MedicalClinic|LegalService|Attorney|ProfessionalService|FoodEstablishment|Restaurant|SportsActivityLocation|ExerciseGym|HealthClub|Store|Plumber|Electrician|HVACBusiness|RoofingContractor|HousePainter|Locksmith|MovingCompany|CleaningService|ChildCare|EducationalOrganization|LodgingBusiness|TravelAgency|EmergencyService|FinancialService|RealEstateAgent|InsuranceAgency|VeterinaryCare|AnimalShelter|Physician|Optician/;

export function analyze(url: string, pages: Page[]): ScanResult {
  const main = pages[0];
  // Todas las páginas juntas para las firmas (la reserva suele estar en /book o /services).
  const all = pages.map((p) => p.html + '\n' + Object.entries(p.headers).map(([k, v]) => `${k}: ${v}`).join('\n')).join('\n');
  const html = main.html;

  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map((m) => m[1]);
  const host = new URL(main.url).hostname.replace(/^www\./, '');
  const thirdParty = scripts.filter((s) => {
    try {
      return !new URL(s, main.url).hostname.replace(/^www\./, '').endsWith(host);
    } catch {
      return false;
    }
  });
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const schema = schemaTypes(all);

  // Si hay una plataforma "real", los frameworks genéricos no se listan como plataforma.
  let platform = match(PLATFORM, all);
  if (platform.some((p) => !['nextjs', 'nuxt', 'gatsby', 'astro'].includes(p.id))) {
    platform = platform.filter((p) => !['nextjs', 'nuxt', 'gatsby', 'astro'].includes(p.id));
  }
  const builders = platform.some((p) => p.id === 'wordpress') ? match(BUILDERS, all) : [];

  // Un formulario de búsqueda de WordPress no es un formulario de contacto.
  const contact = match(CONTACT, all).filter((c) => c.id !== 'form' || /<form(?![^>]*(role=["']search["']|class=["'][^"']*search))/i.test(all));

  return {
    url,
    finalUrl: main.url,
    https: main.url.startsWith('https://'),
    pages: pages.map((p) => p.url),
    platform,
    builders,
    booking: match(BOOKING, all),
    payments: match(PAYMENTS, all),
    contact,
    chat: match(CHAT, all),
    analytics: match(ANALYTICS, all),
    reviews: match(REVIEWS, all),
    tech: match(TECH, all),
    seo: {
      title: decode(attr(html, /<title[^>]*>([\s\S]*?)<\/title>/i)).slice(0, 200),
      description: decode(attr(html, /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) || attr(html, /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i)).slice(0, 300),
      h1: (html.match(/<h1[\s>]/gi) ?? []).length,
      viewport: /<meta[^>]+name=["']viewport["']/i.test(html),
      lang: attr(html, /<html[^>]*\blang=["']([^"']+)["']/i),
      canonical: /<link[^>]+rel=["']canonical["']/i.test(html),
      ogImage: /<meta[^>]+property=["']og:image["']/i.test(html),
      schema,
      localBusiness: schema.some((t) => LOCAL.test(t)),
    },
    weight: {
      htmlKB: Math.round(new TextEncoder().encode(html).length / 1024),
      scripts: (html.match(/<script\b/gi) ?? []).length,
      thirdPartyScripts: thirdParty.length,
      images: imgs.length,
      imagesNoAlt: imgs.filter((i) => !/\balt=["'][^"']+["']/i.test(i)).length,
      lazyImages: imgs.filter((i) => /loading=["']lazy["']|data-lazy|lazyload/i.test(i)).length,
    },
  };
}

/** Enlaces internos que suelen llevar a reservas, precios o servicios (para revisarlos también). */
export function interestingLinks(baseUrl: string, html: string, max = 3): string[] {
  const base = new URL(baseUrl);
  const out = new Map<string, number>();
  const KEY = /(book|booking|reserv|agenda|schedul|appointment|cita|pricing|precios|prices|tarifas|services|servicios|quote|cotiza)/i;
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = m[1];
    const text = m[2].replace(/<[^>]+>/g, ' ');
    if (!KEY.test(href) && !KEY.test(text)) continue;
    try {
      const u = new URL(href, base);
      if (u.hostname.replace(/^www\./, '') !== base.hostname.replace(/^www\./, '')) continue;
      if (!/^https?:$/.test(u.protocol) || /\.(pdf|jpe?g|png|gif|webp|zip|mp4)$/i.test(u.pathname)) continue;
      u.hash = '';
      const key = u.toString();
      if (key === base.toString()) continue;
      // Prioridad: reservas primero, luego precios y servicios.
      const score = /(book|reserv|agenda|schedul|appointment|cita)/i.test(href + text) ? 2 : 1;
      out.set(key, Math.max(out.get(key) ?? 0, score));
    } catch {}
  }
  return [...out.entries()].sort((a, b) => b[1] - a[1]).slice(0, max).map(([u]) => u);
}
