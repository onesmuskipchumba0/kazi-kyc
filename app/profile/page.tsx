import MasonProfile from '@/components/profile/MasonProfile';
import { masonData } from '../api/profile/dummyData';

export default function ProfilePage() {
  return <MasonProfile mason={masonData} />;
}