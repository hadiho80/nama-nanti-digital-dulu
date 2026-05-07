export function translateAuthError(message?: string | null) {
  const lower = (message ?? "").toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "Email atau password salah. Kalau belum punya akun, silakan daftar dulu.";
  }

  if (lower.includes("auth session missing") || lower.includes("session")) {
    return "Sesi reset password tidak ditemukan. Buka link reset dari email di browser yang sama, atau copy link reset ke browser ini.";
  }

  if (lower.includes("user already registered") || lower.includes("already registered")) {
    return "Email ini sudah terdaftar. Silakan login.";
  }

  if (lower.includes("password")) {
    return "Password terlalu lemah atau terlalu pendek. Gunakan minimal 6 karakter.";
  }

  if (lower.includes("email not confirmed")) {
    return "Email belum diverifikasi. Cek inbox dan klik link verifikasi dulu.";
  }

  if (lower.includes("rate limit")) {
    return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";
  }

  return message || "Terjadi kendala. Coba beberapa saat lagi.";
}
