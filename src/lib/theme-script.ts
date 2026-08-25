/**
 * The one thing that must run before first paint: pick up the saved theme and
 * put the class on <html> so the page never flashes light then repaint dark.
 *
 * Kept out of `src/store/theme.ts` because that file is a client module, and a
 * server component cannot read a plain string export across the client boundary.
 */
export const THEME_KEY = 'trendkart.theme';

export const THEME_SCRIPT = `(function(){try{var k='${THEME_KEY}';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}document.documentElement.style.colorScheme=t;}catch(e){}})();`;
