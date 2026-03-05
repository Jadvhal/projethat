"use client";

/**
 * `useReaderImages` - loads reader images via XHR and manages blob URLs.
 *
 * From weebdex-reader:
 * - Runs up to MAX_PARALLEL concurrent XHR requests
 * - Priority queue: current page first, then expand outward
 * - Auto retry max MAX_ATTEMPTS times, 3s delay each
 * - Returns blob URL; releases URL when unmounted
 */

import { useCallback, useEffect, useRef, useState } from "react";

export interface PageState {
  blob: string | null;    // blob URL when loaded
  isLoaded: boolean;
  isLoading: boolean;
  isFailed: boolean;
}

const MAX_PARALLEL = 3;
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 3000;

/** Set NEXT_PUBLIC_IMAGE_PROXY_URL in .env.development if got CORS issue*/
// TODO: fix CORS issue in mangahat-api
const IMAGE_PROXY = process.env.NEXT_PUBLIC_IMAGE_PROXY_URL ?? "";

export function useReaderImages(images: string[], currentIndex: number) {
  const [pages, setPages] = useState<PageState[]>(() =>
    images.map(() => ({ blob: null, isLoaded: false, isLoading: false, isFailed: false })),
  );

  // Ref mirror of state - no need to re-render to read
  const stateRef    = useRef<PageState[]>(pages);
  const parallelRef  = useRef(0);
  const xhrsRef      = useRef<XMLHttpRequest[]>([]);
  const blobsRef     = useRef<(string | null)[]>(new Array(images.length).fill(null));
  const queueRef     = useRef<number[]>([]);
  const mountedRef   = useRef(true);
  const retryTimers  = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  // Sync state → ref
  useEffect(() => { stateRef.current = pages; }, [pages]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const updatePage = useCallback((index: number, patch: Partial<PageState>) => {
    if (!mountedRef.current) return;
    setPages((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      stateRef.current = next;
      return next;
    });
  }, []);

  // Build priority queue around currentIndex
  const buildQueue = useCallback(
    (cIdx: number): number[] => {
      const total = images.length;
      const seen  = new Set<number>();
      const queue: number[] = [];

      const tryAdd = (i: number) => {
        if (i < 0 || i >= total || seen.has(i)) return;
        seen.add(i);
        const st = stateRef.current[i];
        if (!st.isLoaded && !st.isLoading && !st.isFailed) queue.push(i);
      };

      tryAdd(cIdx);
      for (let d = 1; d < total; d++) {
        tryAdd(cIdx + d);
        tryAdd(cIdx - d);
      }
      return queue;
    },
    [images.length],
  );

  // ── Core loader ──────────────────────────────────────────────────────────

  const processQueue = useCallback(() => {
    while (queueRef.current.length > 0 && parallelRef.current < MAX_PARALLEL) {
      const idx = queueRef.current.shift()!;
      const page = stateRef.current[idx];
      if (!page || page.isLoaded || page.isLoading || page.isFailed) continue;

      parallelRef.current++;
      updatePage(idx, { isLoading: true });

      const load = (attempt: number) => {
        const xhr = new XMLHttpRequest();
        xhrsRef.current.push(xhr);
        xhr.responseType = "blob";
        xhr.open("GET", IMAGE_PROXY + images[idx]);

        xhr.addEventListener("load", () => {
          xhrsRef.current.splice(xhrsRef.current.indexOf(xhr), 1);
          if (blobsRef.current[idx]) URL.revokeObjectURL(blobsRef.current[idx]!);
          const blobUrl = URL.createObjectURL(xhr.response as Blob);
          blobsRef.current[idx] = blobUrl;
          updatePage(idx, { blob: blobUrl, isLoaded: true, isLoading: false });
          parallelRef.current--;
          processQueue();
        });

        xhr.addEventListener("error", () => {
          xhrsRef.current.splice(xhrsRef.current.indexOf(xhr), 1);
          if (attempt < MAX_ATTEMPTS - 1) {
            const t = setTimeout(() => {
              retryTimers.current.delete(t);
              if (mountedRef.current) load(attempt + 1);
            }, RETRY_DELAY_MS);
            retryTimers.current.add(t);
          } else {
            updatePage(idx, { isFailed: true, isLoading: false });
            parallelRef.current--;
            processQueue();
          }
        });

        xhr.send();
      };

      load(0);
    }
  }, [images, updatePage]);

  // ── Rebuild queue when currentIndex changes ──────────────────────────────

  useEffect(() => {
    // Add surrounding unloaded pages to head of queue
    const priority = buildQueue(currentIndex);
    // Keep non-duplicate pages from old queue
    const existingSet = new Set(priority);
    const remaining = queueRef.current.filter(
      (i) => !existingSet.has(i) && !stateRef.current[i]?.isLoaded,
    );
    queueRef.current = [...priority, ...remaining];
    processQueue();
  }, [currentIndex, buildQueue, processQueue]);

  // ── Manual retry ───────────────────────────────────────────────────────

  const retry = useCallback(
    (index: number) => {
      if (blobsRef.current[index]) {
        URL.revokeObjectURL(blobsRef.current[index]!);
        blobsRef.current[index] = null;
      }
      updatePage(index, { blob: null, isFailed: false, isLoading: false, isLoaded: false });
      queueRef.current.unshift(index);
      processQueue();
    },
    [updatePage, processQueue],
  );

  // ── Cleanup ──────────────────────────────────────────────────────────────

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      retryTimers.current.forEach((t) => clearTimeout(t));
      retryTimers.current.clear();
      xhrsRef.current.forEach((xhr) => xhr.abort());
      blobsRef.current.forEach((b) => { if (b) URL.revokeObjectURL(b); });
    };
  }, []);

  return { pages, retry };
}
