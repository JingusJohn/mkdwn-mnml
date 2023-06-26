import type { PageLoad } from "./$types"

export const load = (({params}: any) => {
  return {
    subjectId: params.subjectId as number
  };
}) satisfies PageLoad;
