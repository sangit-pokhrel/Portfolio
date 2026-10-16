import Contours from "./Contours";

/* Dark stretch of the page (signature → legacy → gallery) sharing one
   always-moving contour background that stays pinned behind the content. */
export default function DarkGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark-group" data-theme-nav="light">
      <div className="dark-group-bg" aria-hidden="true">
        <Contours seed={21} className="dark-contours" />
      </div>
      {children}
      {/* empty runway: while it scrolls by, the whole background morphs purple → white */}
      <div className="dark-end" data-theme-nav="dark" aria-hidden="true" />
    </div>
  );
}
