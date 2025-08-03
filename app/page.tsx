import { SignedIn, SignedOut, SignInButton, SignOutButton, } from "@clerk/nextjs";
export default function Home() {
  return (
    <div>
      Hello world
      <SignOutButton />
    </div>
  );
}
