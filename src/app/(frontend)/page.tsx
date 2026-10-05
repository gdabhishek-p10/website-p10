import { draftMode } from 'next/headers'

import HomeClient from '@/components/HomeClient'
import RefreshRouteOnSave from '@/components/RefreshRouteOnSave'
import { getHomeData } from '@/lib/homepage'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { isEnabled } = await draftMode()
  const data = await getHomeData(isEnabled)

  return (
    <>
      {isEnabled && <RefreshRouteOnSave />}
      <HomeClient data={data} />
    </>
  )
}
