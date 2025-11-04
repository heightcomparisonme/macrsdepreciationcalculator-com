/**
 * 数据库连接测试脚本
 * 用于验证数据库连接和基本操作是否正常
 */

import { db } from "@/db";
import { orders, users, credits } from "@/db/schema";
import { sql } from "drizzle-orm";

interface TestResult {
  test: string;
  success: boolean;
  error?: string;
  result?: any;
}

// 测试数据库连接
async function testDatabaseConnection(): Promise<TestResult> {
  try {
    console.log("🔌 测试数据库连接...");
    
    // 执行简单的查询来测试连接
    const result = await db().execute(sql`SELECT 1 as test_value`);
    
    return {
      test: "数据库连接",
      success: true,
      result: result[0],
    };
  } catch (error) {
    return {
      test: "数据库连接",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 测试数据库版本
async function testDatabaseVersion(): Promise<TestResult> {
  try {
    console.log("📋 获取数据库版本信息...");
    
    const result = await db().execute(sql`SELECT version() as db_version`);
    
    return {
      test: "数据库版本",
      success: true,
      result: result[0]?.db_version,
    };
  } catch (error) {
    return {
      test: "数据库版本",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 测试表是否存在
async function testTablesExist(): Promise<TestResult> {
  try {
    console.log("📊 检查数据库表结构...");
    
    // 查询所有表
    const result = await db().execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tableNames = result.map((row: any) => row.table_name);
    const expectedTables = ["orders", "users", "credits", "apikeys", "feedbacks", "posts", "categories", "affiliates"];
    const missingTables = expectedTables.filter(table => !tableNames.includes(table));
    
    return {
      test: "表结构检查",
      success: missingTables.length === 0,
      result: {
        existingTables: tableNames,
        missingTables: missingTables,
        tableCount: tableNames.length,
      },
      error: missingTables.length > 0 ? `缺少表: ${missingTables.join(", ")}` : undefined,
    };
  } catch (error) {
    return {
      test: "表结构检查",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 测试orders表的新字段
async function testOrdersTableSchema(): Promise<TestResult> {
  try {
    console.log("🛒 检查orders表结构...");
    
    const result = await db().execute(sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      ORDER BY ordinal_position
    `);
    
    const columns = result.map((row: any) => ({
      name: row.column_name,
      type: row.data_type,
      nullable: row.is_nullable === 'YES',
      default: row.column_default,
    }));
    
    // 检查新增的PayPal相关字段
    const paypalFields = ["paypal_subscription_id", "paypal_plan_id", "payment_provider"];
    const existingPaypalFields = columns.filter(col => paypalFields.includes(col.name));
    const missingPaypalFields = paypalFields.filter(field => 
      !columns.some(col => col.name === field)
    );
    
    return {
      test: "orders表结构",
      success: missingPaypalFields.length === 0,
      result: {
        totalColumns: columns.length,
        paypalFields: existingPaypalFields,
        missingPaypalFields: missingPaypalFields,
        allColumns: columns.map(col => col.name),
      },
      error: missingPaypalFields.length > 0 ? `orders表缺少字段: ${missingPaypalFields.join(", ")}` : undefined,
    };
  } catch (error) {
    return {
      test: "orders表结构",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 测试基本的CRUD操作
async function testBasicOperations(): Promise<TestResult> {
  try {
    console.log("✏️ 测试基本数据库操作...");
    
    // 测试查询操作
    const ordersCount = await db().execute(sql`SELECT COUNT(*) as count FROM orders`);
    const usersCount = await db().execute(sql`SELECT COUNT(*) as count FROM users`);
    const creditsCount = await db().execute(sql`SELECT COUNT(*) as count FROM credits`);
    
    return {
      test: "基本操作",
      success: true,
      result: {
        ordersCount: ordersCount[0]?.count || 0,
        usersCount: usersCount[0]?.count || 0,
        creditsCount: creditsCount[0]?.count || 0,
      },
    };
  } catch (error) {
    return {
      test: "基本操作",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 测试迁移状态
async function testMigrationStatus(): Promise<TestResult> {
  try {
    console.log("🔄 检查迁移状态...");
    
    // 检查是否存在迁移表
    const migrationTableExists = await db().execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = '__drizzle_migrations'
      ) as exists
    `);
    
    if (!migrationTableExists[0]?.exists) {
      return {
        test: "迁移状态",
        success: false,
        error: "迁移表不存在，请运行: npm run db:migrate",
      };
    }
    
    // 获取已应用的迁移
    const migrations = await db().execute(sql`
      SELECT hash, created_at 
      FROM __drizzle_migrations 
      ORDER BY created_at DESC
    `);
    
    return {
      test: "迁移状态",
      success: true,
      result: {
        migrationsApplied: migrations.length,
        latestMigration: migrations[0] || null,
        allMigrations: migrations,
      },
    };
  } catch (error) {
    return {
      test: "迁移状态",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 检查环境变量
function checkEnvironmentVariables(): TestResult {
  console.log("🔍 检查数据库环境变量...");
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    return {
      test: "环境变量",
      success: false,
      error: "DATABASE_URL 环境变量未设置",
    };
  }
  
  // 隐藏密码部分的URL
  const safeUrl = databaseUrl.replace(/:([^:@]+)@/, ':****@');
  
  return {
    test: "环境变量",
    success: true,
    result: {
      databaseUrlExists: true,
      databaseUrl: safeUrl,
    },
  };
}

// 显示测试结果
function displayResults(results: TestResult[]) {
  console.log("\n📊 数据库测试结果汇总:");
  console.log("=".repeat(60));

  let successCount = 0;
  let failureCount = 0;

  results.forEach(result => {
    const status = result.success ? "✅ 通过" : "❌ 失败";
    console.log(`${result.test.padEnd(15)} | ${status}`);
    
    if (result.success) {
      successCount++;
      if (result.result) {
        if (typeof result.result === 'object') {
          Object.entries(result.result).forEach(([key, value]) => {
            if (typeof value === 'object' && Array.isArray(value)) {
              console.log(`  ${key}: [${value.length} 项]`);
            } else {
              console.log(`  ${key}: ${value}`);
            }
          });
        } else {
          console.log(`  结果: ${result.result}`);
        }
      }
    } else {
      failureCount++;
      console.log(`  错误: ${result.error}`);
    }
    console.log("");
  });

  console.log("=".repeat(60));
  console.log(`✅ 通过: ${successCount} | ❌ 失败: ${failureCount} | 总计: ${results.length}`);

  if (successCount === results.length) {
    console.log("🎉 数据库连接和配置正常！");
  } else if (successCount > 0) {
    console.log("⚠️  数据库部分功能正常，请检查失败的测试项。");
  } else {
    console.log("🚨 数据库连接失败，请检查配置。");
  }
}

// 主函数
async function main() {
  try {
    console.log("🚀 开始数据库连接测试...\n");
    
    // 按顺序执行所有测试
    const tests = [
      checkEnvironmentVariables,
      testDatabaseConnection,
      testDatabaseVersion,
      testTablesExist,
      testOrdersTableSchema,
      testBasicOperations,
      testMigrationStatus,
    ];
    
    const results: TestResult[] = [];
    
    for (const test of tests) {
      if (typeof test === 'function') {
        if (test.constructor.name === 'AsyncFunction') {
          results.push(await test());
        } else {
          results.push(test());
        }
      }
    }
    
    displayResults(results);
    
    // 提供后续步骤建议
    console.log("\n📝 后续步骤建议:");
    const failedTests = results.filter(r => !r.success);
    
    if (failedTests.length === 0) {
      console.log("✅ 数据库一切正常，可以开始使用多支付提供商系统！");
      console.log("💡 您可以运行: npm run test:payment 来测试支付系统");
    } else {
      console.log("🔧 需要解决以下问题:");
      failedTests.forEach(test => {
        console.log(`   - ${test.test}: ${test.error}`);
      });
      
      if (failedTests.some(t => t.test === "环境变量")) {
        console.log("\n📋 请设置 DATABASE_URL 环境变量:");
        console.log("   DATABASE_URL=postgresql://username:password@localhost:5432/database");
      }
      
      if (failedTests.some(t => t.test === "迁移状态" || t.test === "orders表结构")) {
        console.log("\n🔄 请运行数据库迁移:");
        console.log("   npm run db:migrate");
      }
    }
    
  } catch (error) {
    console.error("❌ 测试过程中发生错误:", error);
    process.exit(1);
  }
}

// 如果是直接运行此脚本
if (require.main === module) {
  main();
}

export { 
  testDatabaseConnection, 
  testTablesExist, 
  testOrdersTableSchema,
  checkEnvironmentVariables 
};

