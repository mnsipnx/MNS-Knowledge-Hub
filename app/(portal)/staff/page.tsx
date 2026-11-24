import PortalShell from "@/components/PortalShell";
import PortalWelcome from "@/components/PortalWelcome";
import { requireRole } from "@/lib/auth";

export default async function StaffPage() {
  const profile = await requireRole(["staff"]);
  return (
    <PortalShell
      view="Staff view"
      nav={["Home", "Departments", "Documents", "Templates", "Projects", "Onboarding"]}
      profile={profile}
    >
      <PortalWelcome profile={profile} blurb="You are signed in to the staff view." />
    </PortalShell>
  );
}
