// import Pricing from "@/components/blocks/pricing";
// import { getPricingPage } from "@/services/page";

// export default async function PricingPage({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;
//   const page = await getPricingPage(locale);

//   return <>{page.pricing && <Pricing pricing={page.pricing} />}</>;
// }
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/");
}
// 这是一个重定向到主页，用于注释掉这个路由，需要用到的时候再打开