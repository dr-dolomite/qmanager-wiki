"use client";

import { useEffect, useState } from "react";
import { FALLBACK_RELEASES, getLatestReleases, ReleaseVersions } from "@/lib/releases";

export function useLatestReleases(): {
  releases: ReleaseVersions;
  isLive: boolean;
} {
  const [releases, setReleases] = useState<ReleaseVersions>(FALLBACK_RELEASES);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let mounted = true;
    getLatestReleases()
      .then((data) => {
        if (mounted) {
          setReleases(data);
          setIsLive(true);
        }
      })
      .catch(() => {
        // Keep fallback on error
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { releases, isLive };
}
