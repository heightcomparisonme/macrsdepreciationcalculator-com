import "@/app/globals.css";

import { getLocale, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/locale";
import Script from "next/script";
import { getBaseUrl } from "@/lib/url";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  setRequestLocale(locale);

  const baseUrl = getBaseUrl();
  const googleAdsenseCode = process.env.NEXT_PUBLIC_GOOGLE_ADCODE || "";

  // ---- OpenWidget envs ----
  const OW_ENABLED =
    (process.env.NEXT_PUBLIC_OPENWIDGET_ENABLED ?? "true").toLowerCase() !==
    "false";
  const OW_ORG = process.env.NEXT_PUBLIC_OPENWIDGET_ORG_ID ?? "";
  const OW_INTEGRATION =
    process.env.NEXT_PUBLIC_OPENWIDGET_INTEGRATION ?? "manual_settings";
  const OW_PRODUCT = process.env.NEXT_PUBLIC_OPENWIDGET_PRODUCT ?? "openwidget";
  // 以 JSON 字面量安全注入
  const jsOrg = JSON.stringify(OW_ORG);
  const jsIntegration = JSON.stringify(OW_INTEGRATION);
  const jsProduct = JSON.stringify(OW_PRODUCT);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {googleAdsenseCode && (
          <meta name="google-adsense-account" content={googleAdsenseCode} />
        )}

        <link rel="icon" href="/favicon.ico" />

        {locales?.map((loc) => (
          <link
            key={loc}
            rel="alternate"
            hrefLang={loc}
            href={`${baseUrl}${loc === "en" ? "" : `/${loc}`}/`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={baseUrl} />
      </head>
      <body>
        {children}

        {/* OpenWidget（仅在配置齐全且开启时注入） */}
        {OW_ENABLED && OW_ORG && (
          <>
            <Script
              id="openwidget"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.__ow = window.__ow || {};
                  window.__ow.organizationId = ${jsOrg};
                  window.__ow.integration_name = ${jsIntegration};
                  window.__ow.product_name = ${jsProduct};
                  ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[OpenWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0;n.type="text/javascript";n.src="https://cdn.openwidget.com/openwidget.js";t.head.appendChild(n)}};!n.__ow.asyncInit&&e.init(),n.OpenWidget=n.OpenWidget||e}(window,document,[].slice));
                `,
              }}
            />
            <noscript
              dangerouslySetInnerHTML={{
                __html:
                  'You need to <a href="https://www.openwidget.com/enable-javascript" rel="noopener nofollow">enable JavaScript</a> to use the communication tool powered by <a href="https://www.openwidget.com/" rel="noopener nofollow" target="_blank">OpenWidget</a>',
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
