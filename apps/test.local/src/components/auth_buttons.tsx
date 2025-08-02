import { usePrivy } from "@privy-io/react-auth";


export function LoginButton() {
  const { login, authenticated } = usePrivy();

  const handleLogin = () => {
    login();
  };

  return (
    <button onClick={handleLogin} disabled={authenticated}>
      {authenticated ? "Logged In" : "Login with Privy"}
    </button>
  );
}

export function LogoutButton() {
  const { logout, authenticated } = usePrivy();

  const handleLogout = () => {
    logout();
  };

  return (
    <button onClick={handleLogout} disabled={!authenticated}>
      {authenticated ? "Logout" : "Not Logged In"}
    </button>
  );
}