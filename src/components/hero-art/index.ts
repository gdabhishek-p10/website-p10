import HeroArtFlow from './HeroArtFlow'
import HeroArtBuild from './HeroArtBuild'
import HeroArtField from './HeroArtField'

export const HERO_ARTS = [
  { id: 'flow', label: 'Flow', Component: HeroArtFlow },
  { id: 'build', label: 'Build', Component: HeroArtBuild },
  { id: 'field', label: 'Field', Component: HeroArtField },
] as const
