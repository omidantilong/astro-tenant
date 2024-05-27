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
3. ✅ Currently Astro does not ship a test renderer, so there is no clean way to unit test `.astro` components in isolation. In practice this might mean writing components as React-y tsx/jsx. Astro will still render them on the server. For interactivity, we'd probably use React anyway. Fixed in Astro 4.9.
4. Per the documentation, [Astro does not ship with built-in support for remote Markdown](https://docs.astro.build/en/guides/markdown-content/#fetching-remote-markdown). This is fine really, and we have several options. We could use a no-frills parser like [micromark](https://github.com/micromark/micromark), or the React-specific [react-remark](https://github.com/remarkjs/react-remark), or go all in with [remark + unified](https://github.com/remarkjs/remark). In practice, we probably would need to go for the third option as it would allow us to build custom bits into the parser, such as adding support for the Contentful Image API.
5. Astro support for async React Server Components is not great. But this is not limited to Astro, in fact Remix specifically state they are only working towards support for [async RSC in their v3 release](https://remix.run/blog/remix-v2#what-about-rsc). Currently, as far as I can tell, the neatest way to solve point 4 is to put any async logic inside a `.astro` component - but then we are back to needing a way to test Astro components in isolation as in point 3. Further reading - there was an [RFC thread about this](https://github.com/withastro/astro/issues/1097) from a couple of years back where someone had patched the React renderer. Presumably once RSC lands in a stable React release, Astro will eventually support this out of the box.
