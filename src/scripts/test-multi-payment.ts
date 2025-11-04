/**
 * 多支付提供商系统测试脚本
 * 用于验证三个支付提供商是否可以同时工作
 */

const API_BASE = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";

interface TestResult {
  provider: string;
  success: boolean;
  error?: string;
  response?: any;
}

// 测试产品数据
const testProduct = {
  product_id: "test-monthly",
  currency: "usd",
  locale: "en",
};

// 测试单个支付提供商
async function testPaymentProvider(provider: string): Promise<TestResult> {
  try {
    console.log(`🧪 测试 ${provider} 支付提供商...`);

    const response = await fetch(`${API_BASE}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...testProduct,
        provider, // 指定支付提供商
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        provider,
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    // 检查必要的响应字段
    const requiredFields = ["order_no", "session_id"];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return {
        provider,
        success: false,
        error: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }

    return {
      provider,
      success: true,
      response: {
        order_no: data.order_no,
        session_id: data.session_id,
        checkout_url: data.checkout_url || data.checkoutUrl,
      },
    };

  } catch (error) {
    return {
      provider,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 测试所有支付提供商
async function testAllProviders(): Promise<TestResult[]> {
  const providers = ["stripe", "paypal", "creem"];
  
  console.log("🚀 开始测试多支付提供商系统...\n");
  
  // 并行测试所有提供商
  const results = await Promise.all(
    providers.map(provider => testPaymentProvider(provider))
  );

  return results;
}

// 显示测试结果
function displayResults(results: TestResult[]) {
  console.log("\n📊 测试结果汇总:");
  console.log("=" .repeat(50));

  let successCount = 0;
  let failureCount = 0;

  results.forEach(result => {
    const status = result.success ? "✅ 成功" : "❌ 失败";
    console.log(`${result.provider.padEnd(10)} | ${status}`);
    
    if (result.success) {
      successCount++;
      console.log(`  订单号: ${result.response?.order_no}`);
      console.log(`  会话ID: ${result.response?.session_id}`);
      if (result.response?.checkout_url) {
        console.log(`  支付链接: ${result.response.checkout_url}`);
      }
    } else {
      failureCount++;
      console.log(`  错误: ${result.error}`);
    }
    console.log("");
  });

  console.log("=" .repeat(50));
  console.log(`✅ 成功: ${successCount} | ❌ 失败: ${failureCount} | 总计: ${results.length}`);

  if (successCount === results.length) {
    console.log("🎉 所有支付提供商测试通过！系统支持多支付提供商同时运行。");
  } else if (successCount > 0) {
    console.log("⚠️  部分支付提供商测试通过，请检查失败的提供商配置。");
  } else {
    console.log("🚨 所有支付提供商测试失败，请检查系统配置。");
  }
}

// 检测环境变量配置
function checkEnvironmentConfig() {
  console.log("🔍 检查环境变量配置...\n");

  const requiredEnvVars = [
    // Stripe
    { name: "STRIPE_PRIVATE_KEY", required: false },
    { name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", required: false },
    
    // PayPal  
    { name: "PAYPAL_CLIENT_ID", required: false },
    { name: "PAYPAL_CLIENT_SECRET", required: false },
    { name: "NEXT_PUBLIC_PAYPAL_CLIENT_ID", required: false },
    
    // Creem
    { name: "CREEM_API_KEY", required: false },
    
    // 通用
    { name: "NEXT_PUBLIC_WEB_URL", required: false },
  ];

  requiredEnvVars.forEach(({ name, required }) => {
    const value = process.env[name];
    const status = value ? "✅" : (required ? "❌" : "⚠️");
    const statusText = value ? "已配置" : (required ? "缺失(必需)" : "未配置(可选)");
    
    console.log(`${status} ${name.padEnd(35)} | ${statusText}`);
  });

  console.log("\n💡 提示: 只需要配置您要使用的支付提供商的环境变量");
  console.log("");
}

// 主函数
async function main() {
  try {
    checkEnvironmentConfig();
    const results = await testAllProviders();
    displayResults(results);
    
    // 提供后续步骤建议
    console.log("\n📝 后续步骤:");
    console.log("1. 检查失败的支付提供商的环境变量配置");
    console.log("2. 确保数据库已运行最新的迁移: npm run db:migrate");
    console.log("3. 在前端使用 UnifiedPayment 或 SimplePaymentOptions 组件");
    console.log("4. 配置各支付提供商的webhook端点");
    
  } catch (error) {
    console.error("❌ 测试过程中发生错误:", error);
    process.exit(1);
  }
}

// 如果是直接运行此脚本
if (require.main === module) {
  main();
}

export { testPaymentProvider, testAllProviders, checkEnvironmentConfig };

