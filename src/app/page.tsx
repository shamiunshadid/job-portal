import { getCurrentUser } from "@/features/auth/server/auth.queries";


export default async function Home() {
  const user = await getCurrentUser();
  // console.log(user);

  return (
    <div className="font-sans grid  items-center justify-items-center min-h-screen p-2  gap-6 sm:p-10">
      <h1>{`Hello ${user?.name}`}</h1>
      <h1>{`Your userName is ${user?.userName}`}</h1>
      <h1>{`And email is: ${user?.email}`}</h1>
    </div>
  );
}
