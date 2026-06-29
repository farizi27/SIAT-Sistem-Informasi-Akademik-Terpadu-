<script lang="ts">
	import { goto } from '$app/navigation';
	import Swal from 'sweetalert2';

	import { login } from '$lib/api/auth';
	import { user } from '$lib/stores/auth';

	import Button from '$lib/components/common/Button.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import { LogIn, GraduationCap } from '@lucide/svelte';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);

	async function handleLogin() {
		try {
			loading = true;

			const result = await login(email, password);

			localStorage.setItem('token', result.token);
			localStorage.setItem('user', JSON.stringify(result.user));
			user.set(result.user);

			Swal.fire({
				icon: 'success',
				title: 'Login Berhasil',
				text: 'Selamat datang, ' + result.user.name,
				timer: 1500,
				showConfirmButton: false
			});

			if (result.user.role === 'DOSEN') {
				goto('/dosen');
			} else if (result.user.role === 'MAHASISWA') {
				goto('/mahasiswa');
			} else {
				goto('/dashboard');
			}

		} catch (error: any) {
			Swal.fire({
				icon: 'error',
				title: 'Login Gagal',
				text: error?.response?.data?.message ?? 'Terjadi kesalahan saat memproses login.'
			});
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>SIAT - Login Sistem Informasi Akademik</title>
</svelte:head>

<div class="min-h-screen flex bg-slate-50">
	<!-- Left Side - Branding (Hidden on mobile) -->
	<div class="hidden lg:flex lg:w-[55%] bg-blue-700 items-center justify-center relative overflow-hidden">
		<!-- Decorative elements -->
		<div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600 opacity-50 blur-3xl"></div>
		<div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-800 opacity-50 blur-3xl"></div>
		<div class="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-500 rounded-full blur-2xl opacity-40 mix-blend-screen"></div>
		
		<div class="relative z-10 flex flex-col items-center px-12 text-white text-center">
			<div class="p-6 bg-white/10 rounded-3xl backdrop-blur-md mb-8 shadow-2xl border border-white/20">
				<GraduationCap size={96} class="text-white drop-shadow-lg" strokeWidth={1.5} />
			</div>
			
			<h1 class="text-5xl font-extrabold mb-6 tracking-tight drop-shadow-md">
				S I A T
			</h1>
			
			<p class="text-xl text-blue-100 font-medium max-w-lg leading-relaxed shadow-sm">
				Sistem Informasi Akademik Terpadu. <br>
				Kelola data akademik kampus dengan mudah, terintegrasi, dan transparan.
			</p>
			
			<div class="mt-12 flex items-center justify-center space-x-6 text-sm text-blue-200">
				<div class="flex items-center">
					<div class="w-2 h-2 bg-green-400 rounded-full mr-2 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
					Sistem Berjalan Normal
				</div>
			</div>
		</div>
	</div>

	<!-- Right Side - Login Form -->
	<div class="w-full lg:w-[45%] flex flex-col items-center justify-center p-6 sm:p-12 relative bg-white">
		<div class="w-full max-w-md">
			
			<!-- Mobile Only Icon -->
			<div class="lg:hidden flex justify-center mb-8">
				<div class="p-4 bg-blue-600 rounded-2xl shadow-lg border border-blue-500">
					<GraduationCap size={48} class="text-white" />
				</div>
			</div>

			<div class="text-center mb-10">
				<h2 class="text-3xl font-bold text-slate-900 tracking-tight">Selamat Datang</h2>
				<p class="text-slate-500 mt-3 text-sm font-medium">Silakan masuk menggunakan akun Anda untuk mengakses sistem akademik.</p>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }} class="space-y-6">
				<FormInput
					label="Alamat Email"
					name="email"
					type="email"
					placeholder="Contoh: user@kampus.ac.id"
					required
					bind:value={email}
				/>

				<div class="space-y-2">
					<FormInput
						label="Kata Sandi"
						name="password"
						type="password"
						placeholder="Masukkan kata sandi"
						required
						bind:value={password}
					/>
				</div>

				<div class="pt-4">
					<Button
						type="submit"
						loading={loading}
					>
						{#if !loading}
							<LogIn size={20} class="mr-2" />
							Masuk ke Sistem
						{/if}
					</Button>
				</div>
			</form>
			
			<div class="mt-12 pt-8 border-t border-slate-100 text-center">
				<p class="text-xs text-slate-400 font-medium tracking-wide">
					&copy; {new Date().getFullYear()} SIAT. Dibuat untuk kemudahan akademik.
				</p>
			</div>
		</div>
	</div>
</div>