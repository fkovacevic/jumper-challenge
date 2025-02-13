import API_URL from "@/constants/api"

export const singUpUser = async (message: string, signature: string, address: string) => {
  try {
    const fetchedToken = await fetch(`${API_URL}/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, signature, address }),
    });
    const accessToken = await fetchedToken.json();
    localStorage.setItem('accessToken', accessToken.responseObject);
  } catch (e) {
    throw e;
  }
}