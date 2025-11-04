src/models 目录是数据访问层（DAL）/仓储层，主要职责是“跟数据库打交道”的那一层：
核心作用
封装对数据库的 CRUD 操作（基于 src/db/schema.ts + Drizzle ORM）
按领域拆分文件（如 order.ts、user.ts、post.ts），每个文件负责对应表/聚合的读写
将底层表结构与上层业务解耦，提供更稳定的函数接口给 services、api、页面使用
与 src/types 的类型配合，保证输入输出的类型安全
你当前目录中的例子
ai_workstation_image.ts: 针对 ai_workstation_images 表的增删改查、分页查询等
order.ts: 订单读写、状态更新、关联查询（支付相关）
user.ts: 用户增删改查、用户信息/状态维护
其他同理（credit.ts、post.ts、feedback.ts、category.ts、apikey.ts、affiliate.ts）
位置关系
db/：连接与表结构定义（Drizzle schema）
models/：基于 schema 封装数据库操作
services/：组合多个 model，承载业务流程与规则
types/：共享的 TypeScript 接口与类型
简单说：models 把“怎么查库”藏起来，对外只暴露“能做什么”，让上层更专注业务而不是 SQL/查询细节。