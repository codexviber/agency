import { createFileRoute } from "@tanstack/react-router";
import { PublicSite } from "@/components/site/public-site";
import { getPublicSite } from "@/lib/cms.functions";

export const Route = createFileRoute("/")({
  loader: () => getPublicSite(),
  component: Home,
});

function Home() {
  const site = Route.useLoaderData();
  return <PublicSite site={site} />;
}
