export type ContactSettings = {
  email?: string;
  whatsapp?: string;
  instagram?: string;
};

export type PasswordPolicy = {
  enabled: boolean;
  minLength: number;
  requireLetter: boolean;
  requireNumber: boolean;
  requireSymbol: boolean;
};

export type ContentSettings = {
  privacy?: string;
  terms?: string;
};

export const defaultPasswordPolicy: PasswordPolicy = {
  enabled: true,
  minLength: 8,
  requireLetter: false,
  requireNumber: false,
  requireSymbol: false
};

export function normalizeWhatsapp(value?: string) {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
}

export function whatsappHref(value?: string) {
  const normalized = normalizeWhatsapp(value);
  return normalized ? `https://wa.me/${normalized}` : "";
}

export function validatePasswordPolicy(password: string, policy: PasswordPolicy) {
  if (!policy.enabled) return null;

  if (password.length < policy.minLength) {
    return `Password minimal ${policy.minLength} karakter.`;
  }

  if (policy.requireLetter && !/[a-zA-Z]/.test(password)) {
    return "Password harus berisi huruf.";
  }

  if (policy.requireNumber && !/\d/.test(password)) {
    return "Password harus berisi angka.";
  }

  if (policy.requireSymbol && !/[^a-zA-Z0-9]/.test(password)) {
    return "Password harus berisi simbol.";
  }

  return null;
}

export function passwordPolicyDescription(policy: PasswordPolicy) {
  if (!policy.enabled) return "Tidak ada aturan khusus.";

  const rules = [`minimal ${policy.minLength} karakter`];
  if (policy.requireLetter) rules.push("huruf");
  if (policy.requireNumber) rules.push("angka");
  if (policy.requireSymbol) rules.push("simbol");

  return `Password ${rules.join(", ")}.`;
}
