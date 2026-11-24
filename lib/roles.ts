export type Role =
  | "staff"
  | "contractor"
  | "internal_customer"
  | "external_customer";

// Where each role lands after signing in. The role comes from the account
// an administrator set up. Users never choose it.
export function homeFor(role: Role): string {
  switch (role) {
    case "staff":
      return "/staff";
    case "contractor":
      return "/contractor";
    case "internal_customer":
    case "external_customer":
      return "/customer";
  }
}

export const roleLabel: Record<Role, string> = {
  staff: "Staff",
  contractor: "Contractor",
  internal_customer: "Internal customer",
  external_customer: "External customer",
};
