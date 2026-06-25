<script lang="ts">

	type Variant =
		| 'success'
		| 'danger'
		| 'warning'
		| 'info';

	let {
		text,
		variant = 'info'
	}: {
		text: string;
		variant?: Variant;
	} = $props();

	const colors = {
		success:
			'bg-green-100 text-green-700',

		danger:
			'bg-red-100 text-red-700',

		warning:
			'bg-yellow-100 text-yellow-700',

		info:
			'bg-blue-100 text-blue-700'
	};

</script>

<span
	class={`
		px-3
		py-1
		text-xs
		font-semibold
		rounded-full
		${colors[variant]}
	`}
>
	{text}
</span>