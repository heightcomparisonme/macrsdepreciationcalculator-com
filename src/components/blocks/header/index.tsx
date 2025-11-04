"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Header as HeaderType } from "@/types/blocks/header";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import LocaleToggle from "@/components/locale/toggle";
import { Menu } from "lucide-react";
import SignToggle from "@/components/sign/toggle";
import ThemeToggle from "@/components/theme/toggle";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Header({ header }: { header: HeaderType }) {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<{
    index: number;
    offset: number;
  } | null>(null);
  const triggerRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (activeDropdown?.index == null) {
      return;
    }

    const handleResize = () => {
      const currentTrigger = triggerRefs.current[activeDropdown.index];
      if (!currentTrigger) {
        return;
      }

      const offset = currentTrigger.offsetLeft;

      setActiveDropdown((prev) => {
        if (!prev) {
          return prev;
        }

        if (prev.offset === offset) {
          return prev;
        }

        return {
          index: prev.index,
          offset,
        };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeDropdown?.index]);

  const navigationMenuStyle = useMemo(() => {
    if (!activeDropdown) {
      return undefined;
    }

    return {
      "--menu-dropdown-offset": `${activeDropdown.offset}px`,
    } as CSSProperties;
  }, [activeDropdown]);

  if (header.disabled) {
    return null;
  }

  const registerTriggerRef = (index: number, node: HTMLButtonElement | null) => {
    triggerRefs.current[index] = node;

    if (activeDropdown?.index === index && node) {
      const offset = node.offsetLeft;
      setActiveDropdown((prev) => {
        if (prev && prev.offset === offset) {
          return prev;
        }
        return {
          index,
          offset,
        };
      });
    }
  };

  const updateDropdownOffset = (
    index: number,
    node: HTMLButtonElement | null
  ) => {
    if (!node) {
      return;
    }

    const offset = node.offsetLeft;

    setActiveDropdown((prev) => {
      if (prev && prev.index === index && prev.offset === offset) {
        return prev;
      }

      return {
        index,
        offset,
      };
    });
  };

  return (
    <section className="py-3">
      <div className="container">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link
              href={(header.brand?.url as any) || "/"}
              className="flex items-center gap-2"
            >
              {header.brand?.logo?.src && (
                <img
                  src={header.brand.logo.src}
                  alt={header.brand.logo.alt || header.brand.title}
                  className="w-8"
                />
              )}
              {header.brand?.title && (
                <span className="text-xl text-primary font-bold">
                  {header.brand?.title || ""}
                </span>
              )}
            </Link>
            <div className="flex items-center">
              <NavigationMenu style={navigationMenuStyle}>
                <NavigationMenuList>
                  {header.nav?.items?.map((item, i) => {
                    if (item.children && item.children.length > 0) {
                      return (
                        <NavigationMenuItem
                          key={i}
                          className="text-muted-foreground"
                        >
                          <NavigationMenuTrigger
                            ref={(node) => registerTriggerRef(i, node)}
                            onPointerEnter={(event) =>
                              updateDropdownOffset(i, event.currentTarget)
                            }
                            onPointerMove={(event) =>
                              updateDropdownOffset(i, event.currentTarget)
                            }
                            onFocus={(event) =>
                              updateDropdownOffset(i, event.currentTarget)
                            }
                            onClick={() => {
                              // Clicking title triggers navigation to parent link
                              if (item.url) {
                                if (item.target === "_blank") {
                                  window.open(item.url as string, "_blank");
                                } else {
                                  router.push(item.url as string);
                                }
                              }
                            }}
                          >
                            {item.icon && (
                              <Icon
                                name={item.icon}
                                className="size-4 shrink-0 mr-2"
                              />
                            )}
                            <span>{item.title}</span>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="p-0">
                            <div className="relative min-w-[320px] max-w-[520px] overflow-hidden rounded-2xl border border-white/10 bg-background/20 p-5 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.65)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/55 dark:border-white/5">
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent opacity-80 dark:from-white/10 dark:via-white/5" />
                              <div className="relative grid gap-3 sm:grid-cols-2">
                                {item.children.map((iitem, ii) => (
                                  <NavigationMenuLink key={ii} asChild>
                                    <Link
                                      className={cn(
                                        "group relative flex h-full select-none items-start gap-3 rounded-xl border border-white/10 bg-background/50 p-4 text-left transition-all duration-200 ease-out no-underline outline-hidden backdrop-blur overflow-hidden",
                                        "hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/10 focus-visible:-translate-y-1 focus-visible:border-primary focus-visible:bg-primary/10 focus-visible:outline-none"
                                      )}
                                      href={iitem.url as any}
                                      target={iitem.target}
                                    >
                                      <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground overflow-hidden">
                                        {iitem.icon ? (
                                          <Icon
                                            name={iitem.icon}
                                            className="size-5 shrink-0"
                                          />
                                        ) : (
                                          <span className="size-5" />
                                        )}
                                      </span>
                                      <div className="space-y-1 min-w-0">
                                        <span className="text-sm font-semibold text-foreground transition-colors duration-200 group-hover:text-primary line-clamp-1 break-words">
                                          {iitem.title}
                                        </span>
                                        {iitem.description && (
                                          <p className="text-xs leading-snug text-muted-foreground line-clamp-2 break-words">
                                            {iitem.description}
                                          </p>
                                        )}
                                      </div>
                                      <Icon
                                        name="RiArrowRightUpLine"
                                        className="ml-auto size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary"
                                      />
                                    </Link>
                                  </NavigationMenuLink>
                                ))}
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }

                    return (
                      <NavigationMenuItem key={i}>
                        <Link
                          className={cn(
                            "text-muted-foreground",
                            navigationMenuTriggerStyle,
                            buttonVariants({
                              variant: "ghost",
                            })
                          )}
                          href={item.url as any}
                          target={item.target}
                        >
                          {item.icon && (
                            <Icon
                              name={item.icon}
                              className="size-4 shrink-0 mr-0"
                            />
                          )}
                          {item.title}
                        </Link>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="shrink-0 flex gap-2 items-center">
            {header.show_locale && <LocaleToggle />}
            {/* {header.show_theme && <ThemeToggle />} */}

            {header.buttons?.map((item, i) => {
              return (
                <Button key={i} variant={item.variant}>
                  <Link
                    href={item.url as any}
                    target={item.target || ""}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    {item.title}
                    {item.icon && (
                      <Icon name={item.icon} className="size-4 shrink-0" />
                    )}
                  </Link>
                </Button>
              );
            })}
            {header.show_sign && <SignToggle />}
          </div>
        </nav>

        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link
              href={(header.brand?.url || "/") as any}
              className="flex items-center gap-2"
            >
              {header.brand?.logo?.src && (
                <img
                  src={header.brand.logo.src}
                  alt={header.brand.logo.alt || header.brand.title}
                  className="w-8"
                />
              )}
              {header.brand?.title && (
                <span className="text-xl font-bold">
                  {header.brand?.title || ""}
                </span>
              )}
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href={(header.brand?.url || "/") as any}
                      className="flex items-center gap-2"
                    >
                      {header.brand?.logo?.src && (
                        <img
                          src={header.brand.logo.src}
                          alt={header.brand.logo.alt || header.brand.title}
                          className="w-8"
                        />
                      )}
                      {header.brand?.title && (
                        <span className="text-xl font-bold">
                          {header.brand?.title || ""}
                        </span>
                      )}
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="mb-8 mt-8 flex flex-col gap-4">
                  <Accordion type="single" collapsible className="w-full">
                    {header.nav?.items?.map((item, i) => {
                      if (item.children && item.children.length > 0) {
                        return (
                          <AccordionItem
                            key={i}
                            value={item.title || ""}
                            className="border-b-0"
                          >
                            <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline text-left">
                              {item.title}
                            </AccordionTrigger>
                            <AccordionContent className="mt-2">
                              {item.children.map((iitem, ii) => (
                                <Link
                                  key={ii}
                                  className={cn(
                                    "flex select-none gap-4 rounded-md p-3 leading-none outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  )}
                                  href={iitem.url as any}
                                  target={iitem.target}
                                >
                                  {iitem.icon && (
                                    <Icon
                                      name={iitem.icon}
                                      className="size-4 shrink-0"
                                    />
                                  )}
                                  <div>
                                    <div className="text-sm font-semibold">
                                      {iitem.title}
                                    </div>
                                    <p className="text-sm leading-snug text-muted-foreground">
                                      {iitem.description}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      }
                      return (
                        <Link
                          key={i}
                          href={item.url as any}
                          target={item.target}
                          className="font-semibold my-4 flex items-center gap-2 px-4"
                        >
                          {item.icon && (
                            <Icon
                              name={item.icon}
                              className="size-4 shrink-0"
                            />
                          )}
                          {item.title}
                        </Link>
                      );
                    })}
                  </Accordion>
                </div>
                <div className="flex-1"></div>
                <div className="border-t pt-4">
                  <div className="mt-2 flex flex-col gap-3">
                    {header.buttons?.map((item, i) => {
                      return (
                        <Button key={i} variant={item.variant}>
                          <Link
                            href={item.url as any}
                            target={item.target || ""}
                            className="flex items-center gap-1"
                          >
                            {item.title}
                            {item.icon && (
                              <Icon
                                name={item.icon}
                                className="size-4 shrink-0"
                              />
                            )}
                          </Link>
                        </Button>
                      );
                    })}

                    {header.show_sign && <SignToggle />}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {header.show_locale && <LocaleToggle />}
                    <div className="flex-1"></div>

                    {/* {header.show_theme && <ThemeToggle />} */}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}
