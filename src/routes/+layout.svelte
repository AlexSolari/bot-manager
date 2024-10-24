<script lang="ts">
    import { goto } from "$app/navigation";
    import { currentBot } from "$lib/stores.svelte";
    import { BotNames } from "$lib/types";
    import "../app.css";
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    const bots = Object.values(BotNames);
    let hideControl = $derived(currentBot.name == null);

    function changeUser(event: Event) {
        currentBot.name = (event.target as any).value as BotNames;
        goto("/" + currentBot.name);
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
                onchange={changeUser}
            >
                {#each bots as bot}
                    <option value={bot}>{bot}</option>
                {/each}
            </select>
        {/if}
    </h1>
    {@render children?.()}
</main>

<style lang="postcss">
</style>
