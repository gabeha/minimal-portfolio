// Configuration for enabling/disabling routes
export const routeConfig = {
  blog: {
    enabled: false,
    title: "Blog",
  },
  photos: {
    enabled: false,
    title: "Photos",
  },
  videos: {
    enabled: false,
    title: "Videos",
  },
} as const;

// Helper function to check if a route is enabled
export function isRouteEnabled(route: keyof typeof routeConfig): boolean {
  return routeConfig[route].enabled;
}

// Helper function to get route title
export function getRouteTitle(route: keyof typeof routeConfig): string {
  return routeConfig[route].title;
}
