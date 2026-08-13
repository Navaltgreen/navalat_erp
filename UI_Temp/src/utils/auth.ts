export function parseRoles(
  roles: string | string[] | null | undefined,
): string[] {
  if (Array.isArray(roles)) {
    return roles.map((role) => role.trim()).filter(Boolean);
  }

  if (!roles) {
    return [];
  }

  return roles
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
}

export function hasRouteAccess(
  userRoles: string[],
  routeRoles: string[],
): boolean {
  if (routeRoles.length === 0) return true;
  return routeRoles.some((role) => userRoles.includes(role));
}
