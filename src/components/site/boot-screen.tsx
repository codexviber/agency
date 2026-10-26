import { useEffect, useState } from "react";
import { LogoMark } from "./logo-mark";

export function BootScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hideTimer = 0;
    const hide = () => setVisible(false);
    if (reduce) {
      hideTimer = window.setTimeout(hide, 180);
      return () => window.clearTimeout(hideTimer);
    }
    const started = performance.now();
    const finish = () => {
      const wait = Math.max(0, 900 - (performance.now() - started));
      hideTimer = window.setTimeout(hide, wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    const cap = window.setTimeout(hide, 2600);
    return () => {
      window.clearTimeout(cap);
      window.clearTimeout(hideTimer);
      window.removeEventListener("load", finish);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink"
      role="status"
      aria-live="polite"
      aria-label="Loading CodeXViber"
    >
      <div className="text-center">
        <LogoMark className="mx-auto h-24 w-24" />
        <p className="mt-4 font-display text-3xl tracking-tight text-fg">CodeXViber</p>
        <div className="mx-auto mt-6 h-0.5 w-40 overflow-hidden bg-line">
          <div className="loadbar h-full bg-fg" />
        </div>
        <p className="mt-4 text-xs font-semibold tracking-widest text-muted uppercase">Ideas to impact</p>
      </div>
    </div>
  );
}
