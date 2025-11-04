import { db } from "@/db";
import { ai_workstation_images } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export type AIWorkstationImageRow = typeof ai_workstation_images.$inferSelect;
export type NewAIWorkstationImage = typeof ai_workstation_images.$inferInsert;

// 新增：创建一条图片记录
export async function createAIWorkstationImage(
  input: NewAIWorkstationImage,
): Promise<AIWorkstationImageRow> {
  const database = db();
  const [row] = await database
    .insert(ai_workstation_images)
    .values(input)
    .returning();
  return row;
}

// 查询：分页获取图片记录
export async function listAIWorkstationImages(
  page: number = 1,
  limit: number = 50,
): Promise<AIWorkstationImageRow[]> {
  const database = db();
  const offset = (page - 1) * limit;
  const rows = await database
    .select()
    .from(ai_workstation_images)
    .orderBy(desc(ai_workstation_images.created_at))
    .limit(limit)
    .offset(offset);
  return rows;
}

// 查询：根据 uuid 获取单条记录
export async function getAIWorkstationImageByUuid(
  uuid: string,
): Promise<AIWorkstationImageRow | null> {
  const database = db();
  const rows = await database
    .select()
    .from(ai_workstation_images)
    .where(eq(ai_workstation_images.uuid, uuid))
    .limit(1);
  return rows[0] ?? null;
}

// 更新：根据 uuid 更新记录（部分字段）
export async function updateAIWorkstationImageByUuid(
  uuid: string,
  updates: Partial<NewAIWorkstationImage>,
): Promise<AIWorkstationImageRow | null> {
  const database = db();
  const [row] = await database
    .update(ai_workstation_images)
    .set(updates)
    .where(eq(ai_workstation_images.uuid, uuid))
    .returning();
  return row ?? null;
}

// 删除：根据 uuid 删除记录
export async function deleteAIWorkstationImageByUuid(
  uuid: string,
): Promise<number> {
  const database = db();
  const result = await database
    .delete(ai_workstation_images)
    .where(eq(ai_workstation_images.uuid, uuid));
  // drizzle 返回 `{ rowCount?: number }`（postgres 驱动）
  return (result as unknown as { rowCount?: number }).rowCount ?? 0;
}