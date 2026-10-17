import { site } from "@/content/site";
import { getGitHub } from "@/lib/github";
import { listImages, portraitSrc } from "@/lib/images";
import EventButton from "../EventButton";

/* "Follow along" fan: each card is a mini-screen of one of your profiles, built from real info.
   Instagram tiles: drop photos into public/images/socials/instagram/ (otherwise your own photos are used). */

const Icon = {
  github: <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />,
  linkedin: <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.4" cy="6.6" r="1.2" /></>,
  facebook: <path d="M14 8.5V6.8c0-.8.55-1 .93-1H17V2.1L14.06 2C10.8 2 10 4.43 10 6v2.5H8V12h2v10h4V12h2.7l.4-3.5z" />,
};
const Glyph = ({ name }: { name: keyof typeof Icon }) => <svg className="sc-icon" viewBox="0 0 24 24" aria-hidden="true">{Icon[name]}</svg>;

const handleOf = (url: string) => url.replace(/\/+$/, "").split("/").pop() ?? "";

export default async function SocialCards() {
  const s = Object.fromEntries(site.socials.map((x) => [x.name.toLowerCase(), x.url]));
  const ghUser = handleOf(s.github ?? "");
  const gh = ghUser ? await getGitHub(ghUser) : null;

  const me = listImages("me");
  const pick = (re: RegExp) => me.find((u) => re.test(u));
  const avatar = pick(/\/avatar\./i) ?? portraitSrc() ?? "";
  const cover = pick(/\/card\./i) ?? avatar;
  const insta = listImages("socials/instagram");
  const instaTiles: (string | null)[] = insta.length ? insta.slice(0, 6) : [cover, null, avatar, portraitSrc(), null, cover];
  const name = `${site.firstName} ${site.lastName}`;

  const cards: { key: string; node: React.ReactNode; href?: string; event?: string; detail?: string; label: string }[] = [
    {
      key: "story", event: "story:play", label: "Play my story",
      node: (
        <div className="sc sc-story">
          <div className="sc-top"><span>Now playing</span><span>♫</span></div>
          <div className="sc-vinyl"><span style={{ backgroundImage: `url(${avatar})` }} /></div>
          <div className="sc-track"><b>My story</b><span>{name} · aka Music</span></div>
          <div className="sc-eq" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ animationDelay: `${-(i * 0.13) % 1}s` }} />)}</div>
          <div className="sc-controls"><span>⏮</span><span className="sc-play">▶</span><span>⏭</span></div>
        </div>
      ),
    },
    {
      key: "instagram", href: s.instagram, label: "Instagram",
      node: (
        <div className="sc sc-insta">
          <div className="sc-top"><Glyph name="instagram" /><b>@{handleOf(s.instagram ?? "")}</b></div>
          <div className="sc-profile">
            <span className="sc-ring"><img src={avatar} alt="" /></span>
            <div><b>{name}</b><span>{site.role}</span></div>
          </div>
          <div className="sc-grid">
            {instaTiles.map((src, i) => src
              ? <img key={i} src={src} alt="" loading="lazy" />
              : <span key={i} className="sc-tile">{i === 1 ? <em>aka</em> : "♪"}{i === 1 ? "Music" : ""}</span>)}
          </div>
        </div>
      ),
    },
    {
      key: "linkedin", href: s.linkedin, label: "LinkedIn",
      node: (
        <div className="sc sc-linkedin">
          <div className="sc-banner"><Glyph name="linkedin" /></div>
          <img className="sc-avatar" src={avatar} alt="" />
          <b className="sc-name">{name}</b>
          <span className="sc-head">{site.role}</span>
          <span className="sc-meta">{site.location}</span>
          <span className="sc-badge">#OpenToWork</span>
          <div className="sc-lines"><i /><i /><i /></div>
          <span className="sc-cta">Connect</span>
        </div>
      ),
    },
    {
      key: "github", href: s.github, label: "GitHub",
      node: (
        <div className="sc sc-github">
          <div className="sc-top"><Glyph name="github" /><b>{gh?.login ?? ghUser}</b></div>
          <img className="sc-avatar" src={gh?.avatar ?? avatar} alt="" />
          <b className="sc-name">{name}</b>
          {gh?.bio && <span className="sc-head">“{gh.bio}”</span>}
          <div className="sc-stats">
            <span><b>{gh?.repos ?? "50+"}</b>repos</span>
            <span><b>{gh?.followers ?? "—"}</b>followers</span>
            <span><b>{gh?.since ?? 2022}</b>since</span>
          </div>
          {gh && gh.languages.length > 0 && (
            <>
              <div className="sc-langbar">{gh.languages.map((l) => <i key={l.name} style={{ flexGrow: l.share }} />)}</div>
              <div className="sc-langs">{gh.languages.map((l) => <span key={l.name}><i />{l.name}</span>)}</div>
            </>
          )}
          <div className="sc-repos">
            {(gh?.recent ?? []).map((r) => <span key={r.name}><b>{r.name}</b>{r.language ?? ""}</span>)}
          </div>
        </div>
      ),
    },
    {
      key: "facebook", href: s.facebook, label: "Facebook",
      node: (
        <div className="sc sc-facebook">
          <div className="sc-cover" style={{ backgroundImage: `url(${cover})` }}><Glyph name="facebook" /></div>
          <img className="sc-avatar" src={avatar} alt="" />
          <b className="sc-name">{name}</b>
          <span className="sc-meta">@{handleOf(s.facebook ?? "")}</span>
          <div className="sc-post">
            <span className="sc-post-head"><img src={avatar} alt="" /><b>{site.firstName}</b> shared a track</span>
            <span className="sc-post-body">Code by day, music by night. ♪</span>
          </div>
          <span className="sc-cta">Add friend</span>
        </div>
      ),
    },
    {
      key: "resume", event: "docs:open", detail: "resume", label: "Download my résumé or CV",
      node: (
        <div className="sc sc-resume">
          <div className="sc-paper">
            <b>{site.firstName.toUpperCase()}<br />{site.lastName.toUpperCase()}</b>
            <span>{site.role}</span>
            <div className="sc-lines"><i /><i /><i /><i /><i /><i /></div>
            <div className="sc-chips">{site.stack.slice(0, 5).map((t) => <em key={t}>{t}</em>)}</div>
          </div>
          <span className="sc-cta">⤓ Grab my CV</span>
        </div>
      ),
    },
    {
      key: "email", href: `mailto:${site.email}`, label: "Email me",
      node: (
        <div className="sc sc-email">
          <span className="sc-envelope" aria-hidden="true">✉</span>
          <b className="sc-big">Say<br />hello.</b>
          <span className="sc-mail">{site.email}</span>
          <span className="sc-meta">Usually replies within a day</span>
          <span className="sc-cta">Write to me →</span>
        </div>
      ),
    },
  ];

  const mid = (cards.length - 1) / 2;
  return (
    <div className="socials-cards" data-cards>
      {cards.map((c, i) => {
        const style = { ["--unrot" as string]: `${-(i - mid) * 7}deg` } as React.CSSProperties;
        const inner = (
          <div className="s-card-in">
            {c.node}
            <span className="s-card-label"><span className="btn-text">{c.label}</span><span aria-hidden="true">{c.href ? "↗" : "→"}</span></span>
          </div>
        );
        return c.href ? (
          <a className="s-card" key={c.key} href={c.href} style={style}
            {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={c.href.startsWith("http") ? `${c.label} (opens in a new tab)` : c.label}>
            {inner}
          </a>
        ) : (
          <EventButton className="s-card" key={c.key} event={c.event!} detail={c.detail} label={c.label} style={style}>{inner}</EventButton>
        );
      })}
    </div>
  );
}
