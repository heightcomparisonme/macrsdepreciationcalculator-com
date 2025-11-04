"use client";

import React, { useState } from "react";
import { UnifiedPayment, SimplePaymentOptions } from "@/components/payment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MultiPaymentDemo() {
  const [selectedDemo, setSelectedDemo] = useState<"unified" | "simple">("unified");

  // 示例产品数据
  const products = [
    {
      id: "basic-monthly",
      name: "基础版 - 月度订阅",
      price: 9.99,
      currency: "USD",
      interval: "month" as const,
      features: ["10GB 存储", "基础功能", "邮件支持"],
    },
    {
      id: "pro-monthly", 
      name: "专业版 - 月度订阅",
      price: 19.99,
      currency: "USD", 
      interval: "month" as const,
      features: ["100GB 存储", "高级功能", "优先支持", "API 访问"],
    },
    {
      id: "enterprise-yearly",
      name: "企业版 - 年度订阅",
      price: 299.99,
      currency: "USD",
      interval: "year" as const,
      features: ["无限存储", "所有功能", "24/7 支持", "定制开发"],
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const handlePaymentSuccess = (result: any) => {
    console.log("支付成功:", result);
    alert(`支付成功！订单ID: ${result.order_no || result.session_id || "未知"}`);
  };

  const handlePaymentError = (error: any) => {
    console.error("支付失败:", error);
    alert(`支付失败: ${error.message || "未知错误"}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">多支付提供商演示</h1>
        <p className="text-muted-foreground">
          支持 Stripe、PayPal 和 Creem 三种支付方式，用户可以自由选择
        </p>
        <div className="flex justify-center mt-4 space-x-2">
          <Badge variant="secondary">✅ Stripe</Badge>
          <Badge variant="secondary">✅ PayPal</Badge>
          <Badge variant="secondary">✅ Creem</Badge>
        </div>
      </div>

      {/* 产品选择 */}
      <Card>
        <CardHeader>
          <CardTitle>选择产品</CardTitle>
          <CardDescription>选择您想要购买的产品套餐</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`cursor-pointer transition-all ${
                  selectedProduct.id === product.id
                    ? "ring-2 ring-primary border-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <div className="text-2xl font-bold text-primary">
                    {product.currency} {product.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{product.interval}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1 text-sm">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 支付组件演示 */}
      <Card>
        <CardHeader>
          <CardTitle>支付方式</CardTitle>
          <CardDescription>选择您偏好的支付界面风格</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedDemo} onValueChange={(value: any) => setSelectedDemo(value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="unified">统一支付界面</TabsTrigger>
              <TabsTrigger value="simple">简单支付选项</TabsTrigger>
            </TabsList>

            <TabsContent value="unified" className="mt-6">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  统一支付界面提供了更好的用户体验，用户先选择支付方式，然后进入对应的支付流程。
                </div>
                <UnifiedPayment
                  productId={selectedProduct.id}
                  productName={selectedProduct.name}
                  price={selectedProduct.price}
                  currency={selectedProduct.currency}
                  interval={selectedProduct.interval}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            </TabsContent>

            <TabsContent value="simple" className="mt-6">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  简单支付选项直接显示所有支付方式，用户可以快速选择并支付。
                </div>
                <SimplePaymentOptions
                  productId={selectedProduct.id}
                  productName={selectedProduct.name}
                  price={selectedProduct.price}
                  currency={selectedProduct.currency}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 技术说明 */}
      <Card>
        <CardHeader>
          <CardTitle>技术实现</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">🔄 动态路由</h4>
              <p className="text-muted-foreground">
                checkout API 根据前端传递的 provider 参数动态选择支付提供商
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔒 独立处理</h4>
              <p className="text-muted-foreground">
                每个支付提供商都有独立的回调和 webhook 处理逻辑
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">📊 统一记录</h4>
              <p className="text-muted-foreground">
                所有订单都记录在统一的数据库中，包含支付提供商信息
              </p>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">环境变量配置</h4>
            <pre className="text-xs text-muted-foreground">
{`# 可以同时配置多个支付提供商
STRIPE_PRIVATE_KEY=sk_test_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
CREEM_API_KEY=...

# PAY_PROVIDER 现在只是默认值，可以被前端覆盖
PAY_PROVIDER=stripe`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

