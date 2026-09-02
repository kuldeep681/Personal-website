export const GITHUB_URL = "https://github.com/kuldeep681";

export const LINKEDIN_URL =
  "https://www.linkedin.com/in/kuldeep-mandal175514";

export const REDDIT_URL =
  "https://www.reddit.com/u/Inevitable-Bear-/s/ws5AtXx9wX";

export const EMAIL = "kuldeepmandal175514@gmail.com";

export const CV_URL = "https://www.google.com/";

export type NavItem = {
  index: string;
  label: string;
  href: string;
  external?: boolean;
};

/*
 * ----------------------------------------------------------
 * MAIN NAVIGATION
 * ----------------------------------------------------------
 *
 * Primary portfolio navigation.
 * External URLs are kept in the constants above.
 */

export const NAV_ITEMS: NavItem[] = [
  {
    index: "01",
    label: "Work",
    href: "#work",
  },
  {
    index: "02",
    label: "Engineering",
    href: "#engineering",
  },
  {
    index: "03",
    label: "Experience",
    href: "#experience",
  },
  {
    index: "04",
    label: "About",
    href: "#about",
  },
  {
    index: "05",
    label: "GitHub",
    href: GITHUB_URL,
    external: true,
  },
  {
    index: "06",
    label: "Contact",
    href: "#contact",
  },
];

/*
 * ----------------------------------------------------------
 * KERNEL NAVIGATION
 * ----------------------------------------------------------
 *
 * Core portfolio navigation.
 *
 * Social/contact destinations are kept in the shared
 * URL constants so Kernel does not duplicate URLs.
 *
 * Lab intentionally removed.
 */

export const KERNEL_MENU: NavItem[] = [
  {
    index: "01",
    label: "Work",
    href: "#work",
  },
  {
    index: "02",
    label: "Engineering",
    href: "#engineering",
  },
  {
    index: "03",
    label: "Experience",
    href: "#experience",
  },
  {
    index: "04",
    label: "About",
    href: "#about",
  },
  {
    index: "05",
    label: "GitHub",
    href: GITHUB_URL,
    external: true,
  },
  {
    index: "06",
    label: "Download CV",
    href: CV_URL,
    external: true,
  },
  {
    index: "07",
    label: "Contact",
    href: "#contact",
  },
];