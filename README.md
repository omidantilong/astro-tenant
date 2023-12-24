# Astro x Contentful Test

A very (very) dumb Astro site with Contentful integration.

Currently wired up to a free tier Contentful site. You'll need a `.env.development` file with the following:

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
nvm use
npm install
npm run dev
```

#### Build it

This demo is currently set up to use the [Astro Node adapter](https://docs.astro.build/en/guides/integrations-guide/node/) with very little extra config. It just needs a `.env.production` with the same values as above. Eventually this should be turned into a Docker container, probably following [this guide](https://docs.astro.build/en/recipes/docker/).

```
npm run build
```

#### Issues

Astro has some quirks. These are things I've encountered so far:

1. Importing css into a component using `import` and then cmd+clicking it resolves the type definitions instead. It seems the preferred way is to use a `<style>` tag with an import instead (see [RFC discussion](https://github.com/withastro/roadmap/blob/main/proposals/0001-style-unification.md))
2. Returning a function in a `.astro` files causes `astro check` to report the function as unused (see [open issue](https://github.com/withastro/language-tools/issues/476))
3. Currently Astro does not ship a test renderer, so there is no clean way to unit test `.astro` components in isolation. In practice this might mean writing components as React-y tsx/jsx. Astro will still render them on the server. For interactivity, we'd probably use React anyway. See [open discussion](https://github.com/withastro/roadmap/issues/533)
