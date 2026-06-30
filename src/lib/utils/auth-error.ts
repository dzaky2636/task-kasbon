export function translateAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "Email atau kata sandi salah";
  }
  if (lower.includes("email not confirmed")) {
    return "Email belum dikonfirmasi, cek inbox kamu";
  }
  if (lower.includes("user already registered")) {
    return "Email sudah terdaftar";
  }
  if (lower.includes("password")) {
    return "Kata sandi terlalu lemah, minimal 6 karakter";
  }
  if (lower.includes("rate limit")) {
    return "Terlalu banyak percobaan, coba lagi nanti";
  }

  return "Terjadi kesalahan, coba lagi";
}
