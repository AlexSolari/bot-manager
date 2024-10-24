<script lang="ts">
	let { stats }: { stats: Record<string, number> } = $props();
	let isOpen = $state(false);
</script>

<div>
	<button class="font-semibold" onclick={() => (isOpen = !isOpen)}>
		<u>Scoreboard ↴</u>
	</button>
	<div class={isOpen ? "" : "hidden"}>
		<ul>
			{#each Object.entries(stats) as [key, value]}
				<li>
					<strong>{key}</strong>: {value}
				</li>
			{/each}
		</ul>
	</div>
</div>
