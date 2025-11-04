import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import Link from "next/link";
import { Section as SectionType } from "@/types/blocks/section";
import styles from "./cta.module.css";

export default function CTA({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16">
      <div className="px-8">
        <div className='relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-black px-8 py-12 text-center md:p-16 overflow-hidden'>
          {/* 同心圆动画背景 */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* 外圈 */}
            <div className={styles.outerCircle}></div>
            {/* 中圈 */}
            <div className={styles.middleCircle}></div>
            {/* 内圈 */}
            <div className={styles.innerCircle}></div>
            {/* 核心圈 */}
            <div className={styles.coreCircle}></div>
          </div>
          
          {/* 内容 */}
          <div className="relative z-10 mx-auto max-w-(--breakpoint-md)">
            <h2 className="mb-4 text-balance text-3xl font-semibold md:text-5xl">
              {section.title}
            </h2>
            <p className="text-muted-foreground md:text-lg">
              {section.description}
            </p>
            {section.buttons && (
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                {section.buttons.map((item, idx) => (
                  <Button key={idx} variant={item.variant || "default"}>
                    <Link
                      href={item.url || ""}
                      target={item.target}
                      className="flex items-center justify-center gap-1"
                    >
                      {item.title}
                      {item.icon && (
                        <Icon name={item.icon as string} className="size-6" />
                      )}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
