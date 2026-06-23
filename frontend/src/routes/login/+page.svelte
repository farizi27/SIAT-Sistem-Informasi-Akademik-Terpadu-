<script lang="ts">
	import { goto } from '$app/navigation';
	import Swal from 'sweetalert2';

	import { login } from '$lib/api/auth';
    import { user } from "$lib/stores/auth";

	let email = $state('');
	let password = $state('');

	let loading = $state(false);

	async function handleLogin() {
		try {
			loading = true;

			const result = await login(
				email,
				password
			);

			localStorage.setItem(
				'token',
				result.token
			);
            localStorage.setItem(
                'user',
                JSON.stringify(result.user)
            );
            user.set(result.user);

			Swal.fire({
				icon: 'success',
				title: 'Login Berhasil',
				text: 'Selamat datang'
			});

			goto('/dashboard');
		} catch (error: any) {
			Swal.fire({
				icon: 'error',
				title: 'Login Gagal',
				text:
					error?.response?.data
						?.message ??
					'Terjadi kesalahan'
			});
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center">

	<div class="w-full max-w-md rounded-lg border p-6">

		<h1 class="text-2xl font-bold mb-6">
			SIAT Login
		</h1>

		<div class="space-y-4">

			<input
				bind:value={email}
				type="email"
				placeholder="Email"
				class="w-full border rounded p-2"
			/>

			<input
				bind:value={password}
				type="password"
				placeholder="Password"
				class="w-full border rounded p-2"
			/>

			<button
				onclick={handleLogin}
				disabled={loading}
				class="w-full border rounded p-2"
			>
				{loading
					? 'Loading...'
					: 'Login'}
			</button>

		</div>

	</div>

</div>