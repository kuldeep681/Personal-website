export const GITHUB_URL = "https://github.com/kuldeepmandal";

export const LINKEDIN_URL =
  "https://www.linkedin.com/in/kuldeep-mandal175514";

export const REDDIT_URL = "https://www.reddit.com/";

export const EMAIL = "hello@kuldeepmandal.dev";

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
 * Lab removed.
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
 * Additional social/contact destinations:
 * LinkedIn, Reddit and Email are added by Kernel
 * as radial actions.
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
    href: "#contact",
  },
  {
    index: "07",
    label: "Contact",
    href: "#contact",
  },
];