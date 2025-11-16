---
sidebar_position: 40
---

# Scroll Area
```html
<div class="bg-gray-800 h-dvh w-dvw">
    <div class="flex flex-row h-full max-w-full">
        <div class="flex flex-col w-56 h-full border">
            <h1 class="border text-white">Text2</h1>
            <ScrollArea class="flex-1 min-h-0">
                <div class="h-[1500px] bg-amber-200">Scroll</div>
                <h1 class="border text-white">Text1</h1>
            </ScrollArea>
            <h1 class="border text-white">Text2</h1>
        </div>

        <div class="flex-1 h-full flex flex-col min-w-0">
            <div class="border bg-blue-400">Nav</div>
            <div class="bg-violet-400 border">Breadcrumbs</div>
            <div class="flex-1 min-h-0 overflow-x-auto">z
                <div class="flex flex-row h-full">
                    <ScrollArea class="border">
                        <div class="h-[2000px] w-36 bg-pink-300">ScrollA</div>
                        <h1 class="border">Text1</h1>
                    </ScrollArea>
                    <ScrollArea class="border">
                        <div class="h-[2000px] w-36 bg-pink-600">Scroll</div>
                        <h1 class="border">Text1</h1>
                    </ScrollArea>
                    <ScrollArea class="border">
                        <div class="w-[2000px] bg-pink-900">Scroll</div>
                        <input value={name} />
                    </ScrollArea>
                    <h1 class="border">Text1</h1>
                </div>
            </div>

             <h1 class="border text-white">Text2</h1>
        </div>
    </div>
</div>
```