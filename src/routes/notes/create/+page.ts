import type { PageLoad } from "./$types";

export const load = (({url}) => {
  return {
    redirectTo: url.searchParams.get("redirectTo")
  };
}) satisfies PageLoad;
