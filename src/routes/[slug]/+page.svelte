<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";
    import { post } from "$lib";
    import { currentBot } from "$lib/stores.js";
    import type { BotNames } from "$lib/types.js";

    export let data;

    async function restartBot() {
        await post("/restart");
    }

    function refresh() {
        setTimeout(() => refresh(), 3000);
        invalidateAll();
    }

    onMount(() => {
        refresh();
        currentBot.update(x => data.botName as BotNames);
    });
</script>
<div class="flex flex-col h-screen">
    <div class="flex justify-between">
        <h2 class="text-xl font-bold">Logs for `{data.botName}Bot`</h2>
        <button
            on:click={restartBot}
            class="whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground h-10 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/90 focus:bg-primary/90 focus:text-primary-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mr-2 h-4 w-4"
            >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
                ></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
                ></path>
                <path d="M8 16H3v5"></path>
            </svg>
            Restart
        </button>
    </div>
    <main class="flex-1 overflow-auto">
        <div class="container mx-auto bg-muted rounded-md text-sm text-muted-foreground">
            {#each data.log as entry, i}
                <div class="{i % 2 == 0 ? "bg-white" : "bg-slate-200" }">{entry}<br/></div>
            {/each}
        </div>
    </main>
</div>

<style lang="postcss">
</style>