<script lang="ts">
    import { goto } from "$app/navigation";
    import { currentBot } from "$lib/stores";
    import { BotNames } from "$lib/types";
    import "../app.css";

    const bots = Object.values(BotNames);
    let selectedBot = $currentBot;
    $: hideControl = selectedBot == null;

    currentBot.subscribe((x) => (selectedBot = x));

    function changeUser() {
        currentBot.update((_) => selectedBot);
        goto("/" + selectedBot);
    }
</script>

<main
    class="flex flex-col items-center justify-center pt-8 px-4 sm:px-6 lg:pt-8"
>
    <h1 class="text-2xl font-semibold font-mono header">
        ./bots/
        {#if !hideControl}
            <select
                class="text-gray-500"
                bind:value={selectedBot}
                on:change={changeUser}
                disabled={hideControl}
            >
                {#each bots as bot}
                    <option value={bot}>{bot}</option>
                {/each}
            </select>
        {/if}
    </h1>
    <slot />
</main>

<style lang="postcss">
</style>
