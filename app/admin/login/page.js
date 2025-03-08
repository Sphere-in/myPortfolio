import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn("credentials", { email: "admin@example.com", password: "password" })}>
        Sign in with Email
      </button>
    </div>
  );
}
