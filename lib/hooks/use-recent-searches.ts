"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "carproof-recent-searches";
const MAX_ITEMS = 5;

export interface RecentSearchEntry {
  query: string;
  label: string;
  timestamp: number;
}

export function useRecentSearches() {
  const [items, setItems] = useState<RecentSearchEntry[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
  }, []);

  const addSearch = useCallback((query: string, label: string) => {
    setItems((prev) => {
      const next = [
        { query, label, timestamp: Date.now() },
        ...prev.filter((item) => item.query.toUpperCase() !== query.toUpperCase()),
      ].slice(0, MAX_ITEMS);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage full or unavailable — non-critical
      }
      return next;
    });
  }, []);

  const clearSearches = useCallback(() => {
    setItems([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { items, addSearch, clearSearches };
}
