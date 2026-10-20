"use client";

import { useEffect } from "react";

/**
 * Hydration-safe client cleanup hook.
 * Executes unregistration of legacy service workers and clears CacheStorage on localhost.
 * Runs strictly within useEffect after React hydration has completed, preventing any
 * mismatch with browser extensions that inject scripts into the document head.
 */
export default function ClientCleanup() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }
      if ("caches" in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
    }
  }, []);

  return null;
}
