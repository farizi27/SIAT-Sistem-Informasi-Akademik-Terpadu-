<script lang="ts">
  import { onMount } from 'svelte';
  import { getMahasiswaProfile, updateMahasiswaProfile, changeMahasiswaPassword } from '$lib/api/mahasiswa';
  import FormInput from '$lib/components/form/FormInput.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import Modal from '$lib/components/modal/Modal.svelte';
  import Swal from 'sweetalert2';
  import { logActivity } from '$lib/utils/activityLog';

  let loading = $state(false);
  let profile = $state({ name: '', email: '', nim: '' });
  let showPwModal = $state(false);
  let oldPassword = $state('');
  let newPassword = $state('');
  let confirmPassword = $state('');

  async function loadProfile() {
    loading = true;
    try {
      const data = await getMahasiswaProfile();
      profile = { name: data.name, email: data.email, nim: data.nim };
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Gagal memuat profil' });
    } finally {
      loading = false;
    }
  }

  async function saveProfile() {
    loading = true;
    try {
      await updateMahasiswaProfile({ name: profile.name, email: profile.email, nim: profile.nim });
      Swal.fire({ icon: 'success', title: 'Profil berhasil disimpan' });
      logActivity({ type: 'update', module: 'Profil Mahasiswa', description: `Profil mahasiswa "${profile.name}" diperbarui.` });
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Gagal menyimpan profil' });
    } finally {
      loading = false;
    }
  }

  async function changePassword() {
    if (newPassword !== confirmPassword) {
      Swal.fire({ icon: 'warning', title: 'Konfirmasi tidak cocok' });
      return;
    }
    loading = true;
    try {
      await changeMahasiswaPassword(oldPassword, newPassword);
      Swal.fire({ icon: 'success', title: 'Password berhasil diubah' });
      logActivity({ type: 'update', module: 'Password', description: `Password mahasiswa "${profile.name}" diubah.` });
      showPwModal = false;
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Gagal mengubah password' });
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    const current = JSON.parse(localStorage.getItem('user') || '{}');
    if (current.role !== 'MAHASISWA') {
      // security fallback
    }
    loadProfile();
  });
</script>

<style>
  .form-section { @apply space-y-4; }
</style>

<div class="max-w-2xl mx-auto p-6">
  <h1 class="text-2xl font-bold mb-6">Profil Mahasiswa</h1>
  <div class="form-section">
    <FormInput label="Nama" name="name" bind:value={profile.name} required />
    <FormInput label="Email" name="email" type="email" bind:value={profile.email} required />
    <FormInput label="NIM" name="nim" bind:value={profile.nim} required />
  </div>
  <div class="mt-6 flex gap-4">
    <Button type="button" onclick={saveProfile} loading={loading}>Simpan Profil</Button>
    <Button type="button" variant="outline" onclick={() => (showPwModal = true)}>
      Ubah Password
    </Button>
  </div>

  {#if showPwModal}
    <Modal open={showPwModal} title="Ubah Password" size="sm" onClose={() => (showPwModal = false)}>
      <div class="space-y-4">
        <FormInput label="Password Lama" name="old" type="password" bind:value={oldPassword} required />
        <FormInput label="Password Baru" name="new" type="password" bind:value={newPassword} required />
        <FormInput label="Konfirmasi" name="confirm" type="password" bind:value={confirmPassword} required />
        <div class="flex justify-end gap-2 mt-2">
          <Button type="button" variant="outline" onclick={() => (showPwModal = false)} disabled={loading}>Batal</Button>
          <Button type="button" onclick={changePassword} loading={loading}>Ubah</Button>
        </div>
      </div>
    </Modal>
  {/if}
</div>
