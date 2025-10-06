export function success(code: number, message: string, data?: any) {
  return { success: true, code, message, data };
}

export function fail(code: number, message: string, errors?: any) {
  return { success: false, code, message, errors };
}
