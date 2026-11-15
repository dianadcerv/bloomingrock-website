/** POST-only logout so incidental GETs (e.g. link prefetch) never clear the session. */
export function LogoutLink({ className }: { className?: string }) {
  return (
    <form action="/auth/logout" method="POST" className="portal-logout-form">
      <button type="submit" className={className ?? "portal-logout-form__button"}>
        Log out
      </button>
    </form>
  );
}
