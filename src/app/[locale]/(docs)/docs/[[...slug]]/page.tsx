import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getMDXComponents } from "@/mdx-components";
import { Children, cloneElement, createElement, isValidElement } from "react";
import type { ComponentProps, ReactNode } from "react";
import { icons } from "lucide-react";

const FRONTMATTER_BLOCK = /^(?:[\w-]+\s*:\s*.+)(?:\r?\n[\w-]+\s*:\s*.+)*$/;

function extractText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => (typeof child === "string" ? child : ""))
    .join("")
    .replace(/\r\n/g, "\n")
    .trim();
}

function createFrontmatterComponents() {
  let pendingHr: ComponentProps<"hr"> | null = null;
  let frontmatterDecisionMade = false;

  const flushPendingHr = () => {
    if (!pendingHr) return null;
    const element = <hr {...pendingHr} />;
    pendingHr = null;
    return element;
  };

  function Hr(props: ComponentProps<"hr">) {
    if (!frontmatterDecisionMade && pendingHr === null) {
      pendingHr = props;
      return null;
    }
    return <hr {...props} />;
  }

  function H2(props: ComponentProps<"h2">) {
    if (!frontmatterDecisionMade && pendingHr) {
      const text = extractText(props.children);
      if (text && FRONTMATTER_BLOCK.test(text)) {
        frontmatterDecisionMade = true;
        pendingHr = null;
        return null;
      }
      frontmatterDecisionMade = true;
      const hrElement = flushPendingHr();
      return (
        <>
          {hrElement}
          <h2 {...props} />
        </>
      );
    }
    return <h2 {...props} />;
  }

  function Paragraph(props: ComponentProps<"p">) {
    if (!frontmatterDecisionMade && pendingHr) {
      frontmatterDecisionMade = true;
      const hrElement = flushPendingHr();
      return (
        <>
          {hrElement}
          <p {...props} />
        </>
      );
    }
    return <p {...props} />;
  }

  return { hr: Hr, h2: H2, p: Paragraph };
}

function getDocIcon(icon: unknown): ReactNode | null {
  const baseProps = {
    className: "h-6 w-6 text-primary",
    "aria-hidden": true,
  };

  if (isValidElement(icon)) {
    return cloneElement(icon, {
      ...baseProps,
      className: `${baseProps.className} ${(icon.props as any)?.className ?? ""}`.trim(),
    } as any);
  }

  if (typeof icon === "string" && icon.length > 0) {
    const IconComponent = icons[icon as keyof typeof icons];

    if (IconComponent) {
      return createElement(IconComponent, baseProps);
    }
  }

  return null;
}

export default async function DocsContentPage(props: {
  params: Promise<{ slug?: string[]; locale?: string }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.locale);

  if (!page) notFound();

  const MDXContent = page.data.body;
  const frontmatterComponents = createFrontmatterComponents();
  const iconElement = getDocIcon(page.data.icon);
  const titleText =
    page.data.title ??
    (typeof (page.data as { pageTitle?: string }).pageTitle === "string"
      ? (page.data as { pageTitle?: string }).pageTitle
      : "");

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: "clerk",
      }}
    >
      <DocsTitle>
        <span
          className={iconElement ? "inline-flex items-center gap-2" : undefined}
        >
          {iconElement}
          {titleText}
        </span>
      </DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            ...frontmatterComponents,
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams("slug", "locale");
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[]; locale?: string }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.locale);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
