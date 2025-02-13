import { createContext, PropsWithChildren,  useContext, useEffect, useState, useSyncExternalStore } from "react";
import { useAccount } from "wagmi";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return localStorage.getItem("accessToken");
}
function getServerSnapshot() {
  return null;
}

export function useAccessToken() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

type AuthContext = {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}
export const AuthContext = createContext<AuthContext>({ isAuthenticated: false, setIsAuthenticated: (newValue: boolean) => ''});

function getAddressFromJWT(accessToken: string) {
    // Decode the JWT payload (middle part of the token)
    const base64Url = accessToken.split(".")[1]; // Extract the payload part
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Convert to Base64 standard
    const jsonPayload = JSON.parse(atob(base64)); // Decode and parse JSON

    return jsonPayload.address;
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { address: wagmiAddress } = useAccount();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const accessToken = useAccessToken();

  useEffect(() => {
      if (accessToken) {
          const addressFromJWT = getAddressFromJWT(accessToken);
          setIsAuthenticated(addressFromJWT === wagmiAddress);
      }
  }, [accessToken, wagmiAddress]);

	return (
		<AuthContext.Provider
			value={{
        isAuthenticated,
        setIsAuthenticated,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => useContext(AuthContext);