# Nama Nanti, Digital Dulu

Frontend MVP untuk platform request jasa digital: landing page, request form, client dashboard, admin dashboard, dan detail request.

## Routes

- `/` landing page
- `/request` form request
- `/auth` login/register placeholder
- `/dashboard` dashboard client preview
- `/dashboard/requests/req-1042` detail request client
- `/admin` dashboard admin preview
- `/admin/requests/req-1042` detail request admin

## Development

```powershell
npm install
npm run dev
```

Kalau dev mode kena kendala SWC/spawn di Windows, pakai:

```powershell
npm run build
npm run start
```

## Supabase

1. Buat project Supabase.
2. Copy `.env.example` menjadi `.env.local`.
3. Isi:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

4. Jalankan SQL di `supabase/schema.sql` lewat Supabase SQL Editor.
5. Buat bucket private:
   - `request-files`
   - `deliverables`
6. Untuk Google login, set redirect URL di Google/Supabase ke:

```text
http://localhost:3000/auth/callback
https://domain-kamu.com/auth/callback
http://localhost:3000/auth/update-password
https://domain-kamu.com/auth/update-password
```

7. Setelah akun admin pertama dibuat, jadikan admin lewat SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'email-admin-kamu@example.com';
```

8. Test koneksi dari project:

```powershell
npm run supabase:test
```

Tahap berikutnya: sambungkan auth, submit request, upload file, dashboard data asli, admin update status, offer, dan message thread.

## Google OAuth Branding

Di Google Cloud OAuth consent screen, set:

- App name: `Nama Nanti, Digital Dulu`
- Authorized domain: domain production kamu jika sudah tersedia
- Authorized JavaScript origins:
  - `http://localhost:3000`
  - `https://domain-kamu.com`
- Authorized redirect URI Google tetap callback Supabase:
  - `https://PROJECT_REF.supabase.co/auth/v1/callback`

Catatan: pada free setup, layar Google kadang tetap menampilkan domain Supabase karena redirect URI OAuth memang memakai callback Supabase. Nama aplikasi tetap bisa dibuat sesuai brand lewat OAuth consent screen. Untuk mengganti domain callback sepenuhnya biasanya perlu custom auth domain/custom domain Supabase.
