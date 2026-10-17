import "server-only";

/* Public GitHub profile data for the "Follow along" GitHub card.
   Cached and refreshed once a day; returns null if GitHub can't be reached (the card falls back to static text). */

export type GitHubData = {
  login: string; name: string; bio: string; avatar: string; url: string;
  repos: number; followers: number; since: number;
  languages: { name: string; share: number }[];
  recent: { name: string; language: string | null }[];
};

const DAY = 60 * 60 * 24;

export async function getGitHub(user: string): Promise<GitHubData | null> {
  try {
    const opts = { next: { revalidate: DAY }, headers: { Accept: "application/vnd.github+json" } };
    const [uRes, rRes] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`, opts),
      fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`, opts),
    ]);
    if (!uRes.ok || !rRes.ok) return null;
    const u = await uRes.json();
    const repos: { name: string; language: string | null; fork: boolean }[] = await rRes.json();
    const own = repos.filter((r) => !r.fork && r.name.toLowerCase() !== user.toLowerCase());

    const counts = new Map<string, number>();
    own.forEach((r) => r.language && counts.set(r.language, (counts.get(r.language) ?? 0) + 1));
    const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
    const languages = [...counts.entries()]
      .sort((a, b) => b[1] - a[1]).slice(0, 4)
      .map(([name, n]) => ({ name, share: n / total }));

    return {
      login: u.login, name: u.name ?? u.login, bio: u.bio ?? "", avatar: u.avatar_url, url: u.html_url,
      repos: u.public_repos, followers: u.followers, since: new Date(u.created_at).getFullYear(),
      languages, recent: own.slice(0, 3).map((r) => ({ name: r.name, language: r.language })),
    };
  } catch {
    return null;
  }
}
