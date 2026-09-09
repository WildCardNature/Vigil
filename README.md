# Vigil Watchtower website

Immersive static product site for Vigil 1.1.0. The site packages the rebuilt app screenshots in `public/assets` and uses a React Three Fiber watchtower scene.

## Run locally

```powershell
pnpm install
pnpm dev
```

## Production build

```powershell
pnpm build
```

The deployable output is written to `dist`. Vite uses `/Vigil/` for GitHub Pages and automatically switches to `/` in Vercel builds.

For Vercel, use the repository root as the project Root Directory, select the Vite preset, and leave the default `pnpm build` / `dist` settings.

## Store link

On Android, calls to action use Solana Mobile's listing deep link for `com.vigil.mobile`. On other devices they open the public Vigil listing on SeekerTracker so desktop visitors still have useful app information.

## Visual behavior

- Desktop: WebGL watchtower and scroll-linked camera descent with app screenshots mapped onto 3D panels.
- Mobile: the same scene is softened and paired with readable DOM screenshot layers.
- Reduced motion: WebGL is replaced with a static Vigil-mark composition.
