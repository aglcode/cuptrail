import { LinkButton } from '@/components/ui/link-button';
import { Icon } from '@/components/ui/icon';
export default function NotFound() {
  return <main id="main-content" className="page-width empty-state min-h-[60vh]"><Icon name="compass" size={40}/><p className="eyebrow">Page not found</p><h1>This spot is off the map.</h1><p>Head back to discover and find your next coffee stop.</p><LinkButton href="/" className="button button-dark">Back to discover<Icon name="arrow" size={16}/></LinkButton></main>;
}
