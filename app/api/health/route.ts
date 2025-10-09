import { getDb } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDb()
    const admin = db.admin()
    const info = await admin.ping()
    return Response.json({ ok: true, info })
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 })
  }
}
