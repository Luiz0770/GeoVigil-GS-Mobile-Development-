export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validarSenha(senha: string): boolean {
  return senha.length >= 6;
}
