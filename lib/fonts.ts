import { Manrope, Inter } from "next/font/google";

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

/** Body / UI — Inter for maximum legibility at small sizes */
export const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
