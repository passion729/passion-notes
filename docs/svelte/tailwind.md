---
sidebar_position: 10
---

# Tailwind 4.0
Automatic configuration:
```shell
pnpx sv add tailwindcss
```

or in Vite: 
```shell
pnpm install tailwindcss @tailwindcss/vite
```

```javascript title="vite.config.js"
import { defineConfig } from 'vite'
// add
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
      // add
    tailwindcss(),
  ],
})
```

```css title="app.css"
@import "tailwindcss";
```

:::tip
Remember to import `app.css` in `+layout` or `+paage`.
:::
