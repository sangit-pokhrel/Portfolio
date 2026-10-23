/* A browser-window frame (traffic lights + address bar) for screenshots, live previews and demos. */
export default function Browser({ host, href, children, className = "" }: {
  host: string; href?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`browser ${className}`}>
      <div className="browser-bar">
        <i /><i /><i />
        {host ? <span className="browser-url">{host}</span> : <span className="browser-url is-empty" />}
        {href && (
          <a className="browser-open" href={href} target="_blank" rel="noopener noreferrer">Open ↗</a>
        )}
      </div>
      <div className="browser-screen">{children}</div>
    </div>
  );
}
