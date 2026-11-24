// PUBLIC HOMEPAGE COPY: DRAFT FOR MNS TO APPROVE BEFORE LAUNCH.
//
// Drafted from what ipNX Nigeria publishes on https://ipnxnigeria.ng/products-services/
// and the MNS Knowledge Hub planning documents. Nothing here is a claim about clients,
// results or uptime. Edit this one file to change the words on the public homepage.

export const hero = {
  headline: "Managed network services you can rely on",
  intro:
    "ipNX designs, runs and supports business connectivity across Nigeria, so your sites stay connected and your teams stay productive.",
  buttonLabel: "Learn more",
};

export const products = [
  {
    title: "Wide Area Network",
    description:
      "Managed connectivity that links your offices, branches and data centres: Enterprise VPN, GigaNET, MetroLAN and Data Centre Interconnect.",
  },
  {
    title: "Corporate Internet",
    description:
      "Dedicated, high-speed fibre internet for offices and multi-site businesses, including Dedicated Internet Access and ipNX Vantage.",
  },
  {
    title: "Managed Wi-Fi and Voice",
    description:
      "Managed wireless networks for your premises, and enterprise telephony that connects your branches.",
  },
];

export const caseStudies = {
  title: "Case studies",
  description: "Approved case studies will appear here.",
};

// Public contact details taken from the ipNX enterprise pages. Confirm these are the
// right ones for the MNS team before launch.
export const contact = {
  title: "Contact MNS",
  email: "businesssales@ipnxnigeria.net",
  phone: "+234 (201) 633 6000",
  address: "4, Balarabe Musa Crescent, Victoria Island, Lagos",
};

export const nav = [
  {
    label: "Products and services",
    items: products.map((p) => ({ label: p.title, href: "#products" })),
  },
  {
    label: "Case studies",
    items: [{ label: "Case studies", href: "#case-studies" }],
  },
  {
    label: "About",
    items: [
      { label: "About MNS", href: "#about" },
      { label: "About ipNX", href: "https://ipnxnigeria.ng/our-company/" },
    ],
  },
  { label: "Contact", href: "#contact" },
] as const;
