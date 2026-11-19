import { Manrope, Plus_Jakarta_Sans } from "next/font/google";

/**
 * Both faces are loaded as variable fonts (no `weight` list). Google's CDN
 * currently 404s some of the static per-weight Manrope files, which fails the
 * build outright; the variable axis also gives us every weight in one file.
 */

/** Display — tight geometric sans for headlines */
export const fontDisplay = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/** Body / UI — Plus Jakarta Sans (not Inter) for brand-distinctive UI */
export const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
