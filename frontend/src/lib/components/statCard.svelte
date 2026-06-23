<script lang="ts">
	type Color =
		| 'blue'
		| 'green'
		| 'yellow'
		| 'red'
		| 'purple'
		| 'orange';

	interface Props {
		title: string;
		value: number;
		color?: Color;
	}

	const colors: Record<Color, string> = {
		blue: 'bg-blue-500',
		green: 'bg-green-500',
		yellow: 'bg-yellow-500',
		red: 'bg-red-500',
		purple: 'bg-purple-500',
		orange: 'bg-orange-500'
	};

	let { title, value, color = 'blue' }: Props = $props();
</script>

<div
	class="bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition"
>
	<div class="flex items-center justify-between">

		<div>
			<p class="text-sm text-gray-500">
				{title}
			</p>

			<h2 class="text-3xl font-bold mt-2">
				{value}
			</h2>
		</div>

		<div
			class={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${colors[color]}`}
		>
			📊
		</div>

	</div>
</div>