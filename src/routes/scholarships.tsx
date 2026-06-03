// Scholarships section replaced by School section.
// This route redirects to /school so any old bookmarks still work.
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/scholarships")({
  beforeLoad: () => { throw redirect({ to: "/school", replace: true }); },
  component: () => null,
});
