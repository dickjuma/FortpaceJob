/**
 * Public marketplace URLs for admin "view as user" actions.
 */
export function getPublicProfileUrl(user) {
  if (!user?.id) return null;
  const id = user.username || user.id;
  if (user.userGroup === 'freelancer') {
    return `/talent/${id}`;
  }
  if (user.userGroup === 'client') {
    return `/clients/${user.id}`;
  }
  return null;
}
