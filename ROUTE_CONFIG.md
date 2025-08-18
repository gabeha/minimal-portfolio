# Route Configuration

This project uses a centralized configuration system to enable/disable routes without deleting directories.

## Configuration File

The route configuration is located in `lib/config.ts`:

```typescript
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
```

## How It Works

1. **Route Control**: Each route has an `enabled` flag that controls whether it's accessible
2. **Automatic 404**: When a route is disabled, accessing it will show a 404 page
3. **Navigation**: Navigation links automatically appear/disappear based on the configuration
4. **Nested Routes**: Child routes (like `/blog/[slug]` or `/photos/[id]`) automatically respect the parent route's enabled status

## Enabling/Disabling Routes

To enable a route, simply change its `enabled` property to `true`:

```typescript
blog: {
  enabled: true,  // Change from false to true
  title: "Blog",
},
```

To disable a route, set `enabled` to `false`.

## Benefits

- ✅ Routes can be easily enabled/disabled without code changes
- ✅ All route content is preserved
- ✅ Navigation automatically updates
- ✅ Clean, maintainable code
- ✅ No need to delete or restore files

## Adding New Routes

To add a new route:

1. Add it to the `routeConfig` in `lib/config.ts`
2. Create the route directory and page files
3. Import and use `isRouteEnabled("routeName")` in the page component
4. The navigation will automatically include it when enabled
