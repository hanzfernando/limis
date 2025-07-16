const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function verifyEmail(token: string, email: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/verify-email?token=${token}&email=${email}`);

    const data = await res.json();

    return {
      ok: res.ok,
      status: res.status,
      message: data.message,
    };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return {
      ok: false,
      status: 500,
      message: "Something went wrong.",
    };
  }
}
