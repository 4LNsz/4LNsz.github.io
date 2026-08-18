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
      // A third paragraph sat here — "Beyond the technical side, I have
      // experience leading teams and defining roadmaps…". The fact did
      // not leave the page: section 04 records managing the back-end
      // team at Energy, which is where it happened. Here it was the same
      // information told a second time.
    ],
    /**
     * Five short blocks, not six long ones.
     *
     * This list reached twenty items, and the effect was the opposite of
     * the one intended: a wall of bullets nobody reads, restating what
     * sections 02, 03 and 04 already say. Two rules keep it short:
     *
     *   1. If a fact already appears in another section, it does NOT
     *      repeat here.
     *   2. A two-word fact becomes `chips`, not `items` — the renderer
     *      emits pills instead of bulleted lines.
     *
     * Nothing was reworded to make it shorter, only removed: every line
     * left is still identical to the source that marks it.
     */
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
        // [CV] The profile headline, word for word: "Lua Specialist |
        // High-Performance Systems & Scalability | Back-end
        // Optimization". Three lines — and they are the three he chose
        // to introduce himself with.
        //
        // Four others left, every one for repetition and none for doubt
        // about the fact: React/Vue.js (the Front-end row in section
        // 02), MySQL/MariaDB (the Data row in 02), monitoring and
        // end-to-end architecture (panels 03 and 04 of section 03),
        // FiveM (the Platform row in 02 and Garty Group in 04) and
        // running-cost reduction (panel 02 of section 03).
        title: "Specialisms",
        items: [
          "Lua — high-performance, scalable systems",
          "Cutting CPU and RAM consumption",
          "High concurrency and real-time",
        ],
      },
      {
        // [AL] Native first, then by relevance to international work.
        // In `chips` because they are two-word labels: as list lines
        // they took three full rows to say what three pills say at a
        // glance.
        title: "Languages",
        chips: ["PT · native", "EN · intermediate", "ES · intermediate"],
      },
      {
        // [AL] Any arrangement works. Three words, no ranking between
        // them.
        //
        // There was a "· preferred" on remote and a fourth chip, "Open
        // to relocation". Alan asked for both to go, and it reads
        // better: the preference turned a list of open options into a
        // request, and announcing willingness to relocate answers a
        // question nobody has asked yet — that is conversation, not
        // shop window. Both facts are still true; they are just not
        // published. Do not reintroduce them unless he asks.
        title: "Availability",
        chips: ["Remote", "On-site", "Hybrid"],
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
      // Two blocks left entirely.
      //
      // "Top skills" came from LinkedIn's Top Skills field — TypeScript,
      // UX and Figma. Alan confirmed those are not his main
      // competencies: that field is derived from endorsements, not
      // curated. Do not repopulate it from there.
      //
      // "How I work" carried four lines of method already stated
      // elsewhere: "analysing systems under stress" is the second
      // paragraph of the introduction, and anticipating bottlenecks,
      // architecture and business alignment are panels 02 and 03 of
      // section 03.
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
