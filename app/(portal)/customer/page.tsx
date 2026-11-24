import PortalShell from "@/components/PortalShell";
import PortalWelcome from "@/components/PortalWelcome";
import { requireRole } from "@/lib/auth";

export default async function CustomerPage() {
  const profile = await requireRole(["internal_customer", "external_customer"]);
  return (
    <PortalShell
      view="Customer view"
      nav={["Products", "My projects", "Forms & templates", "Contact"]}
      profile={profile}
    >
      <PortalWelcome profile={profile} blurb="You see only content shared with you." />
    </PortalShell>
  );
}
