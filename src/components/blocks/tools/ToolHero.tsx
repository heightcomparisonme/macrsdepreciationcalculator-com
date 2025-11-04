import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import AIWorkstation from "@/components/ui/ai-workstation";
import HappyUsers from "../hero/happy-users";
import HeroBg from "../hero/bg";
import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";

export default function Hero({ hero }: { hero: HeroType }) {
  if (hero.disabled) {
    return null;
  }

  const highlightText = hero.highlight_text;
  let texts = null;
  if (highlightText) {
    texts = hero.title?.split(highlightText, 2);
  }

  return (
    <>
      <HeroBg />
      <section className="py-32 min-h-screen flex items-center bg-gradient-to-br from-background via-muted/10 to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-30" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-float-delayed" />
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px] relative">
            {/* Left Content */}
            <div className="flex flex-col justify-center relative z-0">
              {hero.show_badge && (
                <div className="flex items-center justify-start mb-10 animate-float">
                  <img
                    src="/imgs/badges/phdaily.svg"
                    alt="phdaily"
                    className="h-12 object-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
              )}
              
              <div className="text-left">
                {hero.announcement && (
                  <Link
                    href={hero.announcement.url as any}
                    className="mb-8 inline-flex items-center gap-4 rounded-full border border-border/50 px-6 py-3 text-sm bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                  >
                    {hero.announcement.label && (
                      <Badge className="!bg-orange-600 dark:!bg-orange-500 !text-white !border-0 px-4 py-1.5 text-xs font-bold shadow-lg !opacity-100">
                        {hero.announcement.label}
                      </Badge>
                    )}
                    <span className="text-foreground/100 font-medium">{hero.announcement.title}</span>
                  </Link>
                )}

                {texts && texts.length > 1 ? (
                  <h1 className="mb-8 text-balance text-5xl font-bold lg:text-6xl xl:text-7xl leading-tight bg-gradient-to-r from-foreground to-foreground/90 bg-clip-text">
                    {texts[0]}
                    <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                      {highlightText}
                    </span>
                    {texts[1]}
                  </h1>
                ) : (
                  <h1 className="mb-8 text-balance text-5xl font-bold lg:text-6xl xl:text-7xl leading-tight bg-gradient-to-r from-foreground to-foreground/90 bg-clip-text">
                    {hero.title}
                  </h1>
                )}

                <p
                  className="mb-12 max-w-lg text-muted-foreground text-xl lg:text-2xl leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: hero.description || "" }}
                />
                
                {hero.buttons && (
                  <div className="mb-8 flex flex-col gap-6 sm:flex-row">
                    {hero.buttons.map((item, i) => {
                      return (
                        <Link
                          key={i}
                          href={item.url as any}
                          target={item.target || ""}
                          className="flex items-center group"
                        >
                          <Button
                            className="w-full sm:w-auto px-10 py-7 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                            size="lg"
                            variant={item.variant || "default"}
                          >
                            {item.icon && <Icon name={item.icon} className="mr-3 size-5" />}
                            {item.title}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                )}
                
                {hero.tip && (
                  <p className="mb-8 text-base text-foreground/80 bg-gradient-to-r from-primary/10 to-primary/5 inline-block px-6 py-3 rounded-full border border-primary/20 backdrop-blur-sm shadow-sm">
                    {hero.tip}
                  </p>
                )}
                
                {hero.show_happy_users && (
                  <div className="flex justify-center">
                    <HappyUsers />
                  </div>
                )}
              </div>
            </div>

            {/* Right Content - AI Workstation */}
            <div className="flex items-center justify-end h-full relative animate-float-delayed">
              <div className="h-[500px] flex items-center">
                <div className="w-full h-full bg-gradient-to-br from-card/50 to-card/20 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl p-8 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Icon name="calculator" className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-lg font-medium">Tool Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
