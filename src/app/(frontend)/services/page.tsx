import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ServicesView from '@/components/ServicesView'
import { getChrome, getServicesData } from '@/lib/services'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Services — People10',
  description: 'AI services, product engineering, modernization and managed operations, from one team.',
}

export default async function ServicesPage() {
  const [data, chrome] = await Promise.all([getServicesData(), getChrome()])

  return (
    <>
      <Header header={chrome.header} homeHref="/" />
      <main>
        <ServicesView data={data} ctaLabel={chrome.header.ctaLabel} ctaHref={chrome.header.ctaHref} />
      </main>
      <Footer footer={chrome.footer} />
    </>
  )
}
