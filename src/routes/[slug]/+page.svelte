<script lang="ts">
    import BotLog from "$lib/components/BotLog.svelte";
    import { onMount } from "svelte";
    import { currentBot } from "$lib/stores.js";
    import type { BotNames } from "$lib/types.js";
    import RestartButton from "$lib/components/RestartButton.svelte";

    export let data;

    onMount(() => {
        currentBot.update((x) => data.botName as BotNames);
    });
</script>

<div class="flex flex-col h-screen">
    <div class="flex justify-between">
        <h2 class="text-xl font-bold">Logs for `{data.botName}Bot`</h2>
        <RestartButton />
    </div>
    <BotLog log={data.log} />
</div>

<style lang="postcss">
</style>
