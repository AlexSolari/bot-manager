<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { currentBot } from '$lib/stores.svelte';
    import { BotNames, type TraceGroup } from '$lib/types';
    interface Props {
        log: TraceGroup[];
        botName: string;
    }

    let { log, botName }: Props = $props();

    let classes = $derived(
        botName == BotNames.funny ? 'flex-1 half-width' : 'flex-1'
    );

    function getBotAndChatPrefixes(entryGroup: TraceGroup) {
        if (entryGroup.chatName && entryGroup.botName) {
            const botName =
                entryGroup.botName == 'kekruga'
                    ? '🦛'
                    : entryGroup.botName == 'botseiju'
                      ? '🤖'
                      : entryGroup.botName;

            return `${botName} | ${entryGroup.chatName.split(' ').slice(0, 2).join(' ')}`;
        }

        return '';
    }

    $effect(() => {
        const interval = setInterval(() => invalidateAll(), 5000);

        return () => {
            clearInterval(interval);
        };
    });
</script>

<main class={classes}>
    <div
        class="container mx-auto bg-muted rounded-md text-sm text-muted-foreground"
    >
        {#each log as entryGroup, i}
            <div
                id={entryGroup.traceId}
                class={i % 2 == 0
                    ? 'bg-white log-entry'
                    : 'bg-slate-200 log-entry'}
            >
                {#each entryGroup.rows as entry}
                    {#if currentBot.name == BotNames.minecraft}
                        {entry}
                    {:else}
                        <i>{getBotAndChatPrefixes(entryGroup)}</i> | {entry}
                    {/if}<br />
                {/each}
            </div>
        {/each}
    </div>
</main>

<style>
    @media (min-width: 1280px) {
        .half-width {
            max-width: 50%;
        }
    }
</style>
