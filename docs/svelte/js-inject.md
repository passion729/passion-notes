---
sidebar_position: 2
---

# Inject local js file as npm package
This method has been tested in React, Vue and Svelte.

All the packages released by iife CDN can use the same operation.

---

## Install dependencies
The core plugin: [vite-plugin-externals](https://github.com/crcong/vite-plugin-externals)

`pnpm install vite-plugin-externals -D`


Use lcjs for example: 

lcjs npm package for auto completion and typescript

`pnpm install --save @lightningchart/lcjs@7.1.1`

## Configure vite
```js title="vite.config.js"
import { viteExternalsPlugin } from 'vite-plugin-externals';

export default defineConfig(async () => ({
    plugins: [
        sveltekit(),
        // must add this after framework plugin
        // adds
        viteExternalsPlugin({
            '@lightningchart/lcjs': 'lcjs',
        }),
        // adde
    ]
}))
```

## Import local script
```html
// App.html
<head>
  <!-- script path in Svelte Kit: /static/lcjs.js -->
    // add
  <script src="lcjs.js"></script>
  ...
</head>
```

## Enjoy the hacking
Import and use like normal npm packages, while on build, the package will auto be replaced by the `vite-plugin-externals` plugin

```typescript
import { lightningChart, Themes } from "@lightningchart/lcjs";
```

## Advanced references
- [彻底搞懂Vite+Vue如何通过CDN加载资源](https://juejin.cn/post/7329206771565461531)
- [看完这篇你也能手写Vite插件](https://juejin.cn/post/7329782406541901862)
- [封装了一个好用的vite-plugin-external插件](https://juejin.cn/post/7392248233194881060)