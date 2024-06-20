<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";

    export let log: string[];

    function refresh() {
        setTimeout(() => refresh(), 5000);
        invalidateAll();
    }

    onMount(() => {
        refresh();
    });
</script>

<main class="flex-1 overflow-auto">
    <div
        class="container mx-auto bg-muted rounded-md text-sm text-muted-foreground"
    >
        {#each log as entry, i}
            <div class={i % 2 == 0 ? "bg-white" : "bg-slate-200"}>
                {entry}<br />
            </div>
        {/each}
    </div>
</main>
