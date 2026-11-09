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

// v2: v1 caches may contain the non-version "language-packs" tag.
const CACHE_KEY = "qmanager_cached_releases_v2";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const VERSION_TAG_RE = /^v?(\d+)\.(\d+)\.(\d+)$/;

function parseVersion(tag: string): [number, number, number] | null {
  const m = VERSION_TAG_RE.exec(tag);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

function isVersionTag(tag: unknown): tag is string {
  return typeof tag === "string" && parseVersion(tag) !== null;
}

function compareVersions(a: string, b: string): number {
  const pa = parseVersion(a)!;
  const pb = parseVersion(b)!;
  return pa[0] - pb[0] || pa[1] - pb[1] || pa[2] - pb[2];
}

// `/releases/latest` is unusable here: it skips pre-releases (all QManager
// versions are pre-releases) and would return the rolling "language-packs"
// release. List releases instead and pick the highest semver tag.
async function fetchRepoLatestTag(owner: string, repo: string, fallback: string): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=100`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!res.ok) {
      return fallback;
    }
    const data: unknown = await res.json();
    if (!Array.isArray(data)) {
      return fallback;
    }
    const tags = data
      .filter((r) => r && !r.draft)
      .map((r) => r.tag_name)
      .filter(isVersionTag);
    if (tags.length === 0) {
      return fallback;
    }
    return tags.reduce((best, tag) => (compareVersions(tag, best) > 0 ? tag : best));
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
      if (
        parsed.updatedAt &&
        Date.now() - parsed.updatedAt < CACHE_TTL_MS &&
        isVersionTag(parsed.rm551e) &&
        isVersionTag(parsed.rm520n)
      ) {
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
