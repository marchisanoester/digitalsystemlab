import { siteConfig } from "@/lib/site-config";

export const dictionary = {
  locale: "EN",
  nav: {
    services: "Services",
    work: "Work",
    labs: "Venture Labs",
    about: "About",
    contact: "Contact",
  },
  footer: {
    rights: "© 2026 — All rights reserved",
    built: "Built to remove friction",
    socials: {
      instagram: "Instagram",
      linkedin: "LinkedIn",
      whatsapp: "WhatsApp / contact",
    },
  },
  hero: {
    titleA: "Stop doing work",
    titleB: "a system could do.",
    subtitle:
      "We build simple digital systems — automations, tools and small software — that take repetitive tasks off your team’s hands.",
    seeWork: "See our work",
    audit: {
      cta: "Ask me a quick audit",
      label: "Quick audit · live",
      intro: "Right — a quick audit. Three questions, no forms.",
      steps: [
        {
          q: "First: where does your team lose hours every week?",
          options: [
            {
              label: "Manual data entry",
              ack: "Copying things between tools. Seen it a hundred times — and it's the easiest to automate.",
            },
            {
              label: "Excel & Reports",
              ack: "Reports that build themselves are something of a speciality here.",
            },
            {
              label: "Answering the same messages",
              ack: "The same replies, over and over. A system can handle the repeats and leave you the real conversations.",
            },
            {
              label: "Invoices & paperwork",
              ack: "Invoices and forms. Tedious for a human, trivial for a system — and it never makes a typo.",
            },
            {
              label: "Something else",
              ack: "Fair — every team has its own time sink. The humans love an unusual one.",
            },
          ],
        },
        {
          q: "How many people touch that process?",
          options: [
            {
              label: "Just me",
              ack: "A one-person bottleneck. Good news: small systems ship in weeks, not months.",
            },
            {
              label: "2 to 10",
              ack: "A small team. That's real hours back, every single week.",
            },
            {
              label: "More than 10",
              ack: "At that scale the waste compounds. So do the savings.",
            },
          ],
        },
      ],
      close:
        "My read: a strong candidate for a simple system. Want the humans to take a proper look?",
      finals: [
        { label: "WhatsApp them", kind: "whatsapp" },
        { label: "Book a quick call", kind: "calendar" },
      ],
      outro: "Done — I've left them a note. They'll take it from here.",
      again: "Run it again",
    },
  },
  services: {
    eyebrow: "01 — Services",
    title: ["Three ways we take", "friction", "out of the work."],
    also: "We also build",
    items: [
      {
        title: "Process Mapping & Solution Design",
        flag: "Flagship",
        summary:
          "We map how work actually happens, find the friction, and design the simplest system that removes it.",
        body: "Before any code, we sit with the process, digital or non. We trace every handoff, queues, copy-pastes... the invisible work nobody documents.",
        examples: [
          {
            title: "Invoice reader.",
            text: "Reads every new invoice the moment it lands in your folders or cloud, and writes each line straight into your spreadsheet — no manual typing.",
          },
          {
            title: "Guest handover, for hotels.",
            text: "We mapped what quietly slips through the cracks at each shift change — a promised late checkout, an allergy, a half-fixed complaint — and built a calm handover that carries every guest's context to whoever's on next.",
          },
        ],
      },
      {
        title: "Lead Magnet Design",
        summary:
          "Interactive tools that live inside a client's funnel and turn attention into qualified leads.",
        body: "Not another contact form. A small tool the visitor actually wants to use — and that hands you a warm, qualified lead at the end. We design the logic, the interaction, and the flow that notifies your team the moment someone's ready.",
        examples: [
          {
            title: "Mortgage-eligibility calculator.",
            text: "A few guided questions and the visitor sees, in seconds, whether they qualify and for how much — while the warm lead reaches your team by WhatsApp or email.",
          },
          {
            title: "Before / after visualizer.",
            text: "A tool that lets a client see the result before they commit — their hands after the spa, their car back from the body shop, the room once it's remodeled.",
          },
        ],
      },
      {
        title: "Web Experience Optimization",
        summary:
          "We don't rebuild your site. We audit it for friction and remove what quietly slows people down.",
        body: "Most sites don't need a rebuild — they need the friction taken out. We read the graphic and UX detail through the same process lens, and fix what quietly costs you clarity and conversions. When a rebuild genuinely helps, we do that too.",
        examples: [
          {
            title: "Friction audit.",
            text: "A focused pass over your existing site that returns a prioritized list of fixes — the quiet frictions costing you clarity and conversions.",
          },
          {
            title: "Landing & web builds.",
            text: "",
          },
        ],
      },
    ],
    capabilities: [
      "WhatsApp & email automations",
      "Social DM replies",
      "Before / after visualizers",
      "Lead-magnet tools",
      "Landing & web builds",
      "Internal tools & MVPs",
      "Chrome extensions",
      "Dashboards & reports",
    ],
  },
  work: {
    eyebrow: "02 — Selected Work",
    title: ["Small, real, and", "working", "."],
    sub: "A few examples of systems and sites we've actually shipped — described by what they do, not by inflated numbers.",
    groupTools: "Some tools & systems we've built",
    groupWeb: "Some landing & web work",
    tools: [
      {
        title: "Invoice reader",
        tag: "Automation tool",
        text: "Drop a folder of invoices and each line is read and written straight into a clean spreadsheet — no manual typing.",
        mockup: "invoice",
      },
      {
        title: "Mortgage-eligibility calculator",
        tag: "Lead tool",
        text: "Part of a full sales-funnel automation we built: visitors learn in seconds whether they qualify and for how much, and each warm lead is routed straight to the team by WhatsApp or email.",
        mockup: "calc",
      },
      {
        title: "Term-glossary extension",
        tag: "Browser extension",
        text: "A Chrome add-on that explains jargon inline — hover any tricky term on any page and a plain-language definition appears.",
        mockup: "glossary",
      },
    ],
    mockups: {
      calculating: "Calculating...",
      qualify: "You qualify",
      leadSent: "Lead sent →",
    },
    webs: [
      {
        title: "e-Sup Tours",
        tag: "Landing page",
        text: "A landing for an African excursions company — the kind of arrival animation that makes a small operator feel like a brand.",
        href: "https://esupwatamu.com",
        video: "/assets/esup-home.mp4",
        url: "esupwatamu.com",
        rate: 1,
      },
      {
        title: "Foxplan",
        tag: "Web app — Collaboration",
        text: "A platform that matches a city's experiences to your tastes and free time — and to the free time of the friends and family you're connected with.",
        href: "https://foxplan.es",
        video: "/assets/foxplan.mp4",
        url: "foxplan.es",
        rate: 1,
        collab: true,
      },
      {
        title: "Gecko Resort",
        tag: "Booking Channel",
        text: "The portal to a little African paradise, to rest your days.",
        href: "https://garodagecko.com",
        video: "/assets/gecko.mp4",
        url: "garodagecko.com",
        rate: 1,
      },
    ],
  },
  labs: {
    eyebrow: "03 — Venture Labs",
    title: ["We don't only build for clients. We build", "with", "people."],
    lede: "Venture Labs is where we develop our own products — and co-own them with the creators and companies we partner with, under whatever model fits, equity-for-work included.",
    pillLabel: "Example in development",
    pillProject: "Butcamp",
    pillBodyA: "— an experience-design platform. Its",
    pillCorporate: "Corporate",
    pillBodyB: "line builds team-building, workshops and HR tools, B2B.",
    cta: "Have an idea? Let's talk →",
    note: "We'll explore building it together — and under what model.",
  },
  about: {
    eyebrow: "04 — Who we are",
    title: ["A small team that likes", "quiet", "systems."],
    sub: "We're builders first — we design the tools, write the systems, and sit with the process until the friction is gone. Here's who you'd be working with.",
    people: [
      {
        number: "01",
        name: "Michel Bertoni",
        role: "Co-founder · Growth & Strategy",
        bio: "Industrial engineer with a Master's in Entrepreneurship & Innovation (Barcelona). 5+ years across tourism, travel services and digital platforms — sales, customer experience and product, hands-on with CRM / PMS and AI-assisted tools.",
        image: "/assets/michel.png",
      },
      {
        number: "02",
        name: "Ester Marchisano",
        role: "Co-founder · Build & Systems",
        bio: "Developer and graphic / web designer with deep experience in tourism — from hotel management to building digital products for travel structures and processes.",
        image: "/assets/esther.jpg",
      },
    ],
  },
  contact: {
    eyebrow: "05 — Contact",
    title: ["Tell us where the", "friction", "is."],
    lede: "Send one message about the part of your work that eats the most time. We'll reply with whether a small system could take it off your hands — no pitch, no forms.",
    channels: [
      {
        label: "Email",
        value: siteConfig.email,
        href: `mailto:${siteConfig.email}`,
      },
      {
        label: "WhatsApp",
        value: siteConfig.whatsappLabel,
        href: siteConfig.whatsappUrl,
      },
    ],
    auditCta: "Or let the robot run a quick audit →",
    note: "Three questions, about 30 seconds. It's the same place we start every project.",
  },
};

export type Dictionary = typeof dictionary;
