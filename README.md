# Vigil Watchtower website

Immersive static product site for Vigil 1.1.0. The site uses the rebuilt app screenshots in `../dappstore_assets` and a React Three Fiber watchtower scene.

## Run locally

```powershell
pnpm install
pnpm dev
```

## Production build

```powershell
pnpm build
```

The deployable output is written to `website/dist`. Vite's base path is `/Vigil/`, matching the existing GitHub Pages URL. Copy the contents of `dist` to the repository that publishes `https://wildcardnature.github.io/Vigil/`.

## Store link

On Android, calls to action use Solana Mobile's listing deep link for `com.vigil.mobile`. On other devices they open the public Vigil listing on SeekerTracker so desktop visitors still have useful app information.

## Visual behavior

- Desktop: WebGL watchtower and scroll-linked camera descent with app screenshots mapped onto 3D panels.
- Mobile: the same scene is softened and paired with readable DOM screenshot layers.
- Reduced motion: WebGL is replaced with a static Vigil-mark composition.
