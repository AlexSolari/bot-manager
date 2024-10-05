<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import type { TraceGroup } from "$lib/types";
    import { onMount } from "svelte";

    export let log: TraceGroup[];

    function refresh() {
        setTimeout(() => refresh(), 5000);
        invalidateAll();
    }

    function getBotAndChatPrefixes(entryGroup: TraceGroup){
        if (entryGroup.chatName && entryGroup.botName)
            return `${entryGroup.botName.toUpperCase()} | ${entryGroup.chatName.split(' ').slice(0, 2).join(' ')} | `;

        return '';
    }

    onMount(() => {
        refresh();
    });
</script>

<main class="flex-1 overflow-auto">
    <div
        class="container mx-auto bg-muted rounded-md text-sm text-muted-foreground"
    >
        {#each log as entryGroup, i}
            <div id={entryGroup.traceId} class={i % 2 == 0 ? "bg-white log-entry" : "bg-slate-200 log-entry"}>
                {#each entryGroup.rows as entry}
                    {getBotAndChatPrefixes(entryGroup)}{entry}<br />
                {/each}
            </div>
        {/each}
    </div>
</main>
