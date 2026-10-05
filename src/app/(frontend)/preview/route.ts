import config from '@payload-config'
import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export async function GET(req: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const path = new URL(req.url).searchParams.get('path') ?? '/'

  if (!path.startsWith('/') || path.startsWith('//')) {
    return new Response('Preview only supports relative paths', { status: 400 })
  }

  const { user } = await payload.auth({ headers: await headers() })
  const draft = await draftMode()

  if (!user) {
    draft.disable()
    return new Response('Log in to the admin to preview drafts', { status: 403 })
  }

  draft.enable()
  redirect(path)
}
