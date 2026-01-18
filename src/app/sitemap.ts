/**
 * Dynamic Sitemap Generation
 */

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://parrhesia.app";

  const routes = [
    "",
    "/debates",
    "/create",
    "/leaderboard",
    "/about",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const categories = [
    "politics",
    "technology",
    "science",
    "philosophy",
    "economics",
  ].map((category) => ({
    url: `${baseUrl}/debates?category=${category}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [...routes, ...categories];
}
