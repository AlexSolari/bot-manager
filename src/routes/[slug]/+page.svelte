<script lang="ts">
    import ActionCard from '../../lib/components/ActionCard.svelte';
    import BotLog from '$lib/components/BotLog.svelte';
    import { currentBot } from '$lib/stores.svelte.js';
    import { ActionType, BotNames, type BotPageProps } from '$lib/types.js';
    import RestartButton from '$lib/components/RestartButton.svelte';
    // @ts-ignore
    import { Tabs, Tab, TabList, TabPanel } from 'svelte-tabs';

    let { data }: { data: BotPageProps } = $props();
    let currentTime = new Date();

    $effect(() => {
        currentBot.name = data.botName as BotNames;

        const interval = setInterval(() => {
            currentTime = new Date();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });

    function getStateWithMetadata(name: string, state: any) {
        const metadata = data.actionsMetadata.get(name);

        if (!metadata) {
            return null;
        }

        const canTrigger =
            metadata.type == ActionType.Command
                ? (currentTime.getTime() -
                      new Date(state['lastExecutedDate']).getTime()) /
                      1000 >
                  metadata.cooldownInSeconds
                : false;

        return {
            metadata,
            state,
            canTrigger
        };
    }
</script>

<RestartButton />
<div class="flex flex-col h-screen xl:flex-wrap">
    {#if data.botName == BotNames.funny}
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-6">Actions</h1>
            <Tabs>
                <TabList>
                    {#each Object.keys(data.storedChatData) as chatName}
                        <Tab>{chatName}</Tab>
                    {/each}
                </TabList>
                {#each Object.keys(data.storedChatData) as chatName}
                    <TabPanel>
                        <h2 class="text-xl font-semibold mb-4">
                            {chatName}
                        </h2>
                        <div
                            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {#each Object.entries(data.storedChatData[chatName])
                                .map( ([name, state]) => getStateWithMetadata(name, state) )
                                .filter((x) => x != null) as { metadata, state, canTrigger }}
                                <ActionCard
                                    {metadata}
                                    botState={state}
                                    {canTrigger}
                                />
                            {/each}
                        </div>
                    </TabPanel>
                {/each}
            </Tabs>
        </div>
    {/if}
    <BotLog log={data.log} botName={data.botName} />
</div>

<style lang="postcss">
    @media (min-width: 1280px) {
        .container {
            max-width: 50%;
        }
    }

    .grid {
        display: grid;
        gap: 1rem;
    }
</style>
