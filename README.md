# Astro x Contentful Test

A very (very) dumb Astro site with Contentful integration.

Currently wired up to a free tier Contentful site. You'll need a `.env` file ([of any flavour](https://vitejs.dev/guide/env-and-mode)) with the following:

```
CONTENTFUL_DELIVERY_API=
CONTENTFUL_PREVIEW_API=
CONTENTFUL_SPACE_ID=
CONTENTFUL_ENV=
```

#### Editor setup

- If you have prettier installed globally, make sure you're running the latest version (or just remove it)
- Install the [Astro VSCode plugin](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)
- The repo has a `.vscode/settings.json` which should force VSCode to use the Astro plugin for formatting (for some reason the plugin alone wasn't doing this)

#### Run it

```
npm install
npm run dev
```
