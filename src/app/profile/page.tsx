import { Navbar } from "@/components/layout/Navbar";
import { UserProfile } from "@/components/user/UserProfile";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <UserProfile />
    </div>
  );
}
