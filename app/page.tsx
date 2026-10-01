import { getUser } from "@/prisma/lib/get-user"

export default async function Home() {
  const user = await getUser()

  return (
    <div style={{ padding: 24 }}>
      <h1>Cuptrail</h1>
      <p>Signed in as: {user?.email ?? "not signed in"}</p>
    </div>
  )
}