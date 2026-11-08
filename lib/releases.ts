export interface ReleaseVersions {
  rm551e: string;
  rm520n: string;
  updatedAt?: number;
}

export const FALLBACK_RELEASES: ReleaseVersions = {
  rm551e: "v0.1.35",
  rm520n: "v0.1.18",
};

export const GITHUB_REPOS = {
  rm551e: {
    owner: "dr-dolomite",
    repo: "QManager",
    url: "https://github.com/dr-dolomite/QManager",
  },
  rm520n: {
    owner: "dr-dolomite",
    repo: "QManager-RM520N",
    url: "https://github.com/dr-dolomite/QManager-RM520N",
  },
} as const;

const CACHE_KEY = "qmanager_cached_releases_v1";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

async function fetchRepoLatestTag(owner: string, repo: string, fallback: string): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!res.ok) {
      return fallback;
    }
    const data = await res.json();
    return typeof data?.tag_name === "string" && data.tag_name ? data.tag_name : fallback;
  } catch {
    return fallback;
  }
}

export async function getLatestReleases(): Promise<ReleaseVersions> {
  if (typeof window === "undefined") {
    return FALLBACK_RELEASES;
  }

  try {
    const rawCache = window.localStorage.getItem(CACHE_KEY);
    if (rawCache) {
      const parsed = JSON.parse(rawCache) as ReleaseVersions;
      if (parsed.updatedAt && Date.now() - parsed.updatedAt < CACHE_TTL_MS && parsed.rm551e && parsed.rm520n) {
        return parsed;
      }
    }
  } catch {
    // Ignore localStorage errors (e.g. private browsing quota)
  }

  const [rm551e, rm520n] = await Promise.all([
    fetchRepoLatestTag(GITHUB_REPOS.rm551e.owner, GITHUB_REPOS.rm551e.repo, FALLBACK_RELEASES.rm551e),
    fetchRepoLatestTag(GITHUB_REPOS.rm520n.owner, GITHUB_REPOS.rm520n.repo, FALLBACK_RELEASES.rm520n),
  ]);

  const result: ReleaseVersions = {
    rm551e,
    rm520n,
    updatedAt: Date.now(),
  };

  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(result));
  } catch {
    // Ignore localStorage write error
  }

  return result;
}
