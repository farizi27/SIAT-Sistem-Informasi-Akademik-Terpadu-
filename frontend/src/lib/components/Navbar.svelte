<script lang="ts">
	import { browser } from '$app/environment';

	let user = $state({
		name: '',
		role: ''
	});

	if (browser) {

		const savedUser =
			localStorage.getItem(
				'user'
			);

		if (savedUser) {

			const parsed =
				JSON.parse(
					savedUser
				);

			user.name =
				parsed.name;

			user.role =
				parsed.role;
		}
	}
</script>

<div
	class="
		bg-white
		border-b
		shadow-sm
		px-6
		py-4
		flex
		justify-between
		items-center
	"
>

	<div>

		<h2
			class="font-bold text-xl"
		>
			Dashboard
		</h2>

		<p
			class="text-sm text-gray-500"
		>
			Selamat datang kembali
		</p>

	</div>

	<div
		class="
			flex
			items-center
			gap-3
			bg-slate-50
			px-4
			py-2
			rounded-xl
			hover:shadow-md
			transition
			cursor-pointer
		"
	>

		<div
			class="
				w-10
				h-10
				bg-blue-600
				text-white
				rounded-full
				flex
				items-center
				justify-center
				font-bold
			"
		>
			{user.name?.charAt(0)}
		</div>

		<div>

			<p
				class="font-semibold"
			>
				{user.name}
			</p>

			<p
				class="text-xs text-gray-500"
			>
				{user.role}
			</p>

		</div>

	</div>

</div>