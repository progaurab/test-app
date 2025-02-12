import { AuthProvider } from "./providers";

export default function Home() {
  return (
    <AuthProvider>
      <div>Welcome to Raptor</div>
    </AuthProvider>
  );
}
