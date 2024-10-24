<script lang="ts">
	import { type FunnyBotActionMetadata } from "$lib/types.js";
	import StatsCollapsibleCard from "./StatsCollapsibleCard.svelte";

	interface Props {
		metadata: FunnyBotActionMetadata;
		botState: any;
		canTrigger: boolean;
	}

	let { metadata, botState, canTrigger }: Props = $props();

	let lastExecutedDate = new Date(botState["lastExecutedDate"]);
	let currentTime = $state(new Date());

	const timeSinceExecution = $derived(() => {
		if (!lastExecutedDate) return "Never executed";
		const diff = currentTime.getTime() - lastExecutedDate.getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
		if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
		if (minutes > 0)
			return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
		return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
	});

	$effect(() => {
		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	function convertSeconds(seconds: number) {
		if (seconds < 60) {
			return `${seconds} seconds`;
		} else if (seconds < 3600) {
			const minutes = Math.floor(seconds / 60);
			return `${minutes} minutes`;
		} else {
			const hours = Math.floor(seconds / 3600);
			return `${hours} hours`;
		}
	}
</script>

<div
	class="bg-white rounded-lg shadow-md flex flex-col {canTrigger
		? 'border-green-400'
		: 'border-gray-400'} border-2"
>
	<header class="p-4 flex items-center justify-between border-b">
		<h2 class="text-xl font-semibold overflow-ellipsis">
			{metadata.name}
		</h2>
	</header>
	<div class="p-4 flex-grow">
		<div class="text-muted-foreground">
			{#if metadata.cooldownInSeconds}
				<div>
					Cooldown: {convertSeconds(metadata.cooldownInSeconds)}
				</div>
			{:else}
				<div>No cooldown</div>
			{/if}
			{#if metadata.timeInHours}
				<div>
					Triggers at {metadata.timeInHours}
				</div>
			{/if}
			{#if botState["scoreBoard"]}
				<StatsCollapsibleCard stats={botState["scoreBoard"]} />
			{/if}
		</div>
	</div>
	<footer class="p-4">
		<p class="text-sm font-medium">
			{timeSinceExecution()}
		</p>
	</footer>
</div>
