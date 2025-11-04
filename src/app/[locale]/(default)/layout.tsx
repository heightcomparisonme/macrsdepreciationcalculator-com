import Footer from "@/components/blocks/footer";
import Header from "@/components/blocks/header";
import { MobileNavigation } from "@/components/navigation/mobile-navigation";
// import Sidebar from "@/components/blocks/siderbar";
import { ReactNode } from "react";
import { getLandingPage } from "@/services/page";

export default async function DefaultLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getLandingPage(locale);

  return (
    <>
      {/* 侧边栏 - 固定在左侧，不遮挡内容 */}
      {/* <Sidebar /> */}
      
      {page.header && <Header header={page.header} />}
      <main className="overflow-x-hidden main-content pl-0 md:pl-0">{children}</main>
      {page.footer && <Footer footer={page.footer} />}
      {/* <Feedback socialLinks={page.footer?.social?.items} /> */}
      
      {/* 移动端底部导航 */}
      <MobileNavigation />
    </>
  );
}
