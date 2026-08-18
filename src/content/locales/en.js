/**
 * EVERY fact in this file traces to one of two sources:
 *   [CV]  LinkedIn CV export (PT-BR and ENG)
 *   [GH]  github.com/4LNsz
 *   [AL]  Confirmed directly by Alan in conversation
 *
 * Nothing is inferred, rounded, or "filled in to balance the layout".
 * If a fact is in neither source it does not belong here, however
 * plausible it sounds. Cite the source when adding anything.
 */
export default {
  __meta: { order: 2, code: "EN", name: "English", locale: "en-US", htmlLang: "en" },

  nav: { profile: "Profile", stack: "Stack", practice: "Practice", path: "Path", contact: "Contact" },
  meta: { status: "Status", role: "Role", based: "Based in", time: "Local time", focus: "Focus" },
  ui: {
    toDark: "Switch to dark theme",
    toLight: "Switch to light theme",
    menu: "Open menu",
    menuClose: "Close menu",
    skip: "Skip to content",
  },

  hero: {
    status: "Available for projects",
    // [CV] Opening sentence of the LinkedIn summary, verbatim from the
    // English export — not translated from the Portuguese one. It ran
    // to two sentences and six lines above the ALAN, which made the
    // first screen heavy; the rest of the summary is in the PDF.
    statement: "I’m a Back-end Software Engineer focused on what’s “under the hood.”",
    role: "Software Engineer",                   // [CV] profile title
    based: "Caruaru, PE — Brazil",               // [CV] location
    focus: "Back-end / Real-time",               // [CV] summary
    // Labels for the hero panel. The values are measured at runtime by
    // motion/field.js — none of them is written here.
    hud: {
      sessions: "Sessions",
      tick: "Tick (ms)",
      load: "+ Load",
      reset: "Reset",
    },
  },

  // [CV] + [GH]. "Distributed systems" was dropped: it appears in
  // neither source.
  marquee: ["Lua", "TypeScript", "JavaScript", "Node.js", "React", "Vue.js", "MySQL", "High concurrency", "Real-time"],

  /**
   * Section 01 is data-driven. `about` is an array of paragraphs and
   * `blocks` an array of lists — adding a second degree, a new
   * certification or another specialism means adding an item, with no
   * CSS or renderer change. An empty block disappears on its own.
   *
   * The prose is the LinkedIn summary verbatim from the second sentence
   * on — the first is already the hero statement.
   */
  profile: {
    kicker: "Who I am",
    aboutTitle: "About",
    about: [
      "My expertise lies in Lua and high-concurrency simulation systems — environments where the challenge isn’t just making the code work, but ensuring it runs flawlessly for hundreds of simultaneous users.",
      "I thrive on solving performance headaches. My routine involves architecting complex logic and, more importantly, hunting down bottlenecks. I have a proven track record of analyzing systems under stress to find ways to slash hardware consumption (CPU/RAM), turning resource-heavy infrastructures into lean, scalable solutions.",
      "Beyond the technical side, I have experience leading teams and defining roadmaps, ensuring that technical delivery stays aligned with business goals.",
    ],
    blocks: [
      {
        // [AL] Nationality and the 2018 start, both confirmed by Alan.
        // [CV] Formal employment begins at Garty Group, January 2022.
        //
        // The two dates sit together on purpose. "Since 2022" alone
        // erased four years of practice; "since 2018" alone would
        // contradict LinkedIn, where the first role is 2022 — and a site
        // that disagrees with the profile becomes a question in the
        // interview. Together they carry the whole arc with neither half
        // open to challenge.
        //
        // A start year, never a running count: "6 years of experience"
        // goes stale on its own every birthday.
        title: "Details",
        items: [
          "Brazilian national",
          "Building since 2018 · professionally since 2022",
        ],
      },
      {
        // [CV] The four summary bullets, which are exactly the
        // specialisms Alan claims for himself.
        title: "Specialisms",
        items: [
          // [CV] Profile headline: "Lua Specialist | High-Performance
          // Systems & Scalability | Back-end Optimization".
          "Lua — high-performance, scalable systems",
          "Cutting CPU and RAM consumption",
          "Building logic for real-time environments with high user density",
          "Reducing operational costs and latency through intelligent refactoring",
          "Back-end first, fully autonomous in React and Vue.js",
          "MySQL/MariaDB, server monitoring and end-to-end software architecture",
          "High concurrency and real-time — including FiveM / Roleplay",
        ],
      },
      {
        // [CV] Method, from the summary and WinsVue bullets that did NOT
        // make it into section 04's condensed notes.
        title: "How I work",
        items: [
          "Anticipating bottlenecks at planning time and defining the most efficient architecture",
          "Analysing systems under stress to find where hardware consumption can be cut",
          "Translating business needs into sustainable technical solutions",
          "Keeping technical delivery aligned with business goals",
        ],
      },
      {
        // [AL] Native first, then by relevance to
        // international work.
        title: "Languages",
        items: [
          "Portuguese — native",
          "English — intermediate",
          "Spanish — intermediate",
        ],
      },
      {
        // [AL] Any arrangement works, remote preferred,
        // and he is willing to relocate. That last line is also what
        // signals reach without having to declare that he wants out of
        // where he is.
        title: "Availability",
        items: [
          "Remote — preferred",
          "On-site or hybrid, no restriction",
          "Open to relocation",
        ],
      },
      {
        // [CV] Certifications section. It lives here and NOT in section
        // 04: these are credentials that grow in number, and a list is
        // the right shape for that. The degree itself lives in the 04
        // timeline — carrying both in both places was the duplication
        // Alan flagged.
        title: "Certifications",
        items: ["IV Semana Nacional da Área da Tecnologia da Informação — 5 certificates"],
      },
      // A "Top skills" block sat here, filled from LinkedIn's Top Skills
      // field — TypeScript, UX and Figma. Alan confirmed those are not
      // his main competencies: that field is derived from endorsements,
      // not curated. The real ones are already in Specialisms, in the
      // order his own headline states them. Do not repopulate it from
      // Top Skills.
    ],
  },

  // Only technologies named in the CV or on the GitHub profile.
  // Removed from here: REST, Redis, Linux, Docker, CI/CD, Turborepo,
  // pnpm and Vite — none appears in either source.
  stack: {
    kicker: "What I use",
    rows: [
      { name: "Back-end",  items: ["Lua", "Node.js", "TypeScript", "JavaScript"] }, // [CV] WinsVue + [GH]
      { name: "Front-end", items: ["React", "Vue.js"] },                            // [CV] summary + [GH]
      { name: "Data",      items: ["MySQL", "MariaDB"] },                            // [CV] summary + [GH]
      { name: "Platform",  items: ["FiveM", "CFX.RE"] },                             // [GH]
      { name: "Tooling",   items: ["Git", "VS Code", "Figma"] },                     // [GH] + [CV] top skills
    ],
  },

  // Capability domains written from what the CV reports for each role.
  // Still capabilities rather than named systems — see the Privacy
  // section of CLAUDE.md.
  practice: {
    kicker: "What I do",
    hint: "Scroll horizontally",
    items: [
      {
        label: "Domain",
        title: "Real-time simulation",
        desc: "High-complexity ecosystems serving hundreds of simultaneous users. Real-time data processing and complex state persistence, keeping dynamic environments stable under load.",
        tags: ["Lua", "High concurrency", "State persistence"],
      },
      {
        label: "Domain",
        title: "Performance optimisation",
        desc: "Analysing systems under stress to find ways to slash hardware consumption. Refactoring critical systems for reduced CPU and memory use and lower infrastructure running costs.",
        tags: ["CPU / RAM", "Refactoring", "Running costs"],
      },
      {
        label: "Domain",
        title: "Architecture and technical decisions",
        desc: "Planning new systems and end-to-end software architecture, anticipating bottlenecks before they become problems, and integrating the server core with reactive interfaces.",
        tags: ["Architecture", "React", "Vue.js"],
      },
      {
        label: "Domain",
        title: "Monitoring and diagnostics",
        desc: "Server monitoring and diagnostic routines, with agile resolution of complex issues to keep the environment highly available.",
        tags: ["Monitoring", "Availability", "MySQL"],
      },
    ],
  },

  // [CV] Periods, titles and order exactly as the CV states them.
  // Months are kept because Garty Group ran three months inside 2022,
  // the same year the Energy role started.
  path: {
    kicker: "Where I've been",
    cv: "Full CV",
    cvView: "View",
    cvGet: "Download",
    rows: [
      {
        when: "Aug 2025 — Apr 2026",
        role: "Back-end Developer",
        org: "WinsVue",
        note: "Real-time simulation ecosystems under high user concurrency. Refactoring work that cut CPU and memory consumption across critical systems, plus server monitoring and diagnostic routines.",
      },
      {
        when: "Aug 2022 — Jun 2025",
        role: "Software Developer",
        org: "Energy",
        note: "Managed the back-end team — assigning roles, setting objectives and owning product quality — alongside building new features and restructuring the operational side of the systems.",
      },
      {
        when: "Jan — Mar 2022",
        role: "Software Developer",
        org: "Garty Group",
        note: "Back-end work at a company focused on FiveM, supporting four distinct servers with tailored features, optimisations and operational troubleshooting.",
      },
      {
        when: "2020 — 2024",
        role: "Computer Science",
        org: "UniFavip Wyden — BSc",
        // Deliberately no note. The syllabus blurb that sat here was
        // invented, and the certifications that replaced it moved to
        // section 01, where they grow as a list. `note` is optional —
        // the renderer omits the column when it is missing.
      },
    ],
  },

  contact: {
    kicker: "Reach me",
    big: "LET'S TALK",
    primary: "Primary channel",
  },
};
