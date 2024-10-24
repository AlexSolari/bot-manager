<script lang="ts">
	let passwordInput: HTMLInputElement | undefined = $state();

	$effect(() => {
		passwordInput!.focus();
	});
</script>

<div class="w-full max-w-xs mt-4">
	<form
		method="post"
		action="?/auth"
		class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
	>
		<div class="mb-6">
			<input
				bind:this={passwordInput}
				class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
				type="password"
				name="password"
			/>
		</div>
		<div class="flex items-center justify-between">
			<input
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-auto"
				type="submit"
				value="Login"
			/>
		</div>
	</form>
</div>

<style lang="postcss">
</style>
