import { lazy, Suspense, useEffect, useRef, useState } from "react";
import marketShot from "../../dappstore_assets/Screenshot_20260908-182216.png";
import addWalletShot from "../../dappstore_assets/Screenshot_20260908-182615.png";
import watcherShot from "../../dappstore_assets/Screenshot_20260908-182639.png";
import settingsShot from "../../dappstore_assets/Screenshot_20260908-185809.png";

const WatchtowerCanvas = lazy(() => import("./WatchtowerCanvas"));

const STORE_DEEP_LINK = "solanadappstore://details?id=com.vigil.mobile";
const WEB_LISTING_URL = "https://seekertracker.com/dapps/com.vigil.mobile";
const SCREENSHOTS = [marketShot, watcherShot, addWalletShot, settingsShot];

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Vigil home">
      <img src={`${import.meta.env.BASE_URL}vigil-mark.svg`} alt="" />
      <span>Vigil</span>
    </a>
  );
}

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function AppButton({ className = "" }) {
  const isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
  return (
    <a className={`button button--primary ${className}`} href={isAndroid ? STORE_DEEP_LINK : WEB_LISTING_URL}>
      Open Vigil in the dApp Store <ArrowIcon />
    </a>
  );
}

const chapters = [
  {
    id: "markets",
    index: "01",
    label: "Signal intake",
    title: "See the market, not the mess.",
    copy: "Scan live Solana markets with the numbers that matter already in view: price, movement, liquidity, market cap, and risk.",
    points: ["Filter by name, symbol, or address", "Choose when to apply fresh snapshots"],
    image: marketShot,
  },
  {
    id: "following",
    index: "02",
    label: "Wallet telemetry",
    title: "Follow movement with context.",
    copy: "Watch public wallets and read their activity as a clear trail of swaps and transfers—not an endless block explorer feed.",
    points: ["Suggested wallets get you started", "Top tokens and activity stay together"],
    image: watcherShot,
  },
  {
    id: "clarity",
    index: "03",
    label: "Clear execution",
    title: "Move when the signal is clear.",
    copy: "Keep discovery, wallet intelligence, holdings, and trading preferences in one focused mobile command center.",
    points: ["Non-custodial wallet signing", "Transparent swap fees before you trade"],
    image: settingsShot,
  },
];

function Chapter({ chapter }) {
  return (
    <section className={`chapter chapter--${chapter.id}`} id={chapter.id} data-chapter={chapter.index}>
      <div className="chapter__copy">
        <div className="chapter__eyebrow">
          <span>{chapter.index}</span>
          <span>{chapter.label}</span>
        </div>
        <h2>{chapter.title}</h2>
        <p>{chapter.copy}</p>
        <ul>
          {chapter.points.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </div>
      <div className="chapter__mobile-screen" aria-hidden="true">
        <img src={chapter.image} alt="" loading="lazy" />
      </div>
    </section>
  );
}

function App() {
  const journeyRef = useRef(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const journey = journeyRef.current;
      if (!journey) return;
      const rect = journey.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      progressRef.current = Math.min(1, Math.max(0, -rect.top / distance));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main>
      <header className="site-header">
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#markets">Inside Vigil</a>
          <a href="#trust">Trust</a>
          <AppButton className="button--nav" />
        </nav>
      </header>

      <div className="journey" ref={journeyRef}>
        <div className="scene-shell" aria-hidden="true">
          {reducedMotion ? (
            <div className="scene-fallback"><img src={`${import.meta.env.BASE_URL}vigil-mark.svg`} alt="" /></div>
          ) : (
            <Suspense fallback={<div className="scene-loader">Acquiring signal…</div>}>
              <WatchtowerCanvas progressRef={progressRef} screenshots={SCREENSHOTS} />
            </Suspense>
          )}
        </div>

        <section className="hero" id="top">
          <div className="hero__copy">
            <p className="kicker"><span className="status-dot" /> The watchtower is live</p>
            <h1>Trade Solana.<br /><em>Tune out the noise.</em></h1>
            <p className="hero__lede">A calmer command center for discovering markets, following wallets, and understanding what moves on Solana.</p>
            <div className="hero__actions">
              <AppButton />
              <a className="button button--quiet" href="#markets">Enter the watchtower <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="hero__telemetry" aria-hidden="true">
            <span>Network</span><strong>Solana</strong>
            <span>Mode</span><strong>Live watch</strong>
            <span>Custody</span><strong>Never</strong>
          </div>
          <a className="scroll-cue" href="#markets">Scroll to descend <span>↓</span></a>
        </section>

        {chapters.map((chapter) => <Chapter chapter={chapter} key={chapter.id} />)}
      </div>

      <section className="trust" id="trust">
        <div className="trust__heading">
          <p className="section-tag">Built for clarity</p>
          <h2>Your keys stay<br />where they belong.</h2>
        </div>
        <div className="trust__grid">
          <article><span>Local signing</span><h3>Non-custodial</h3><p>Vigil never holds your private keys or funds. Transactions are signed through your wallet.</p></article>
          <article><span>Minimal identity</span><h3>No account required</h3><p>No email, password, or personal profile stands between you and the market.</p></article>
          <article><span>Clear execution</span><h3>Fees shown first</h3><p>Swap costs and settings are visible before you approve a trade.</p></article>
        </div>
      </section>

      <section className="download" id="download">
        <div className="download__screens" aria-hidden="true">
          <img src={marketShot} alt="" loading="lazy" />
          <img src={watcherShot} alt="" loading="lazy" />
          <img src={addWalletShot} alt="" loading="lazy" />
        </div>
        <div className="download__copy">
          <img className="download__mark" src={`${import.meta.env.BASE_URL}vigil-mark.svg`} alt="" />
          <p className="section-tag">Android · Built for Seeker</p>
          <h2>Keep watch<br />from anywhere.</h2>
          <p>Markets, wallets, and your portfolio—focused into one quiet instrument.</p>
          <AppButton />
        </div>
      </section>

      <footer>
        <Brand />
        <p>Discover + trade on Solana.</p>
        <div><a href="https://wildcardnature.github.io/Vigil/privacy.html">Privacy</a><a href="https://wildcardnature.github.io/Vigil/terms.html">Terms</a></div>
        <span>© 2026 Vigil</span>
      </footer>
    </main>
  );
}

export default App;
