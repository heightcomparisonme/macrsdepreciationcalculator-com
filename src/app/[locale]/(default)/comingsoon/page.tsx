import { getTranslations } from 'next-intl/server'
import { ComingSoon } from '@/components/blocks/comingsoon'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'pages.comingsoon',
  })

  return {
    title: t('comingsoon.metadata.title'),
    description: t('comingsoon.metadata.description'),
  }
}

export default async function ComingSoonPage() {
  return <ComingSoon />
}
