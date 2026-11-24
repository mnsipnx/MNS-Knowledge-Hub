import PortalShell from "@/components/PortalShell";
import PortalWelcome from "@/components/PortalWelcome";
import { requireRole } from "@/lib/auth";

export default async function ContractorPage() {
  const profile = await requireRole(["contractor"]);
  return (
    <PortalShell
      view="Contractor view"
      nav={["Standards", "Site procedures", "Checklists & forms", "Starter kit", "Contact"]}
      profile={profile}
    >
      <PortalWelcome profile={profile} blurb="You see only content shared with contractors." />
    </PortalShell>
  );
}
