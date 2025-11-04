import { respData, respErr } from "@/lib/resp";
import { getUserInfo } from "@/services/user";
import { getUserCredits } from "@/services/credit";

export async function GET() {
  try {
    const userInfo = await getUserInfo();
    if (!userInfo || !userInfo.email) {
      return respErr("用户未登录");
    }

    const credits = await getUserCredits(userInfo.uuid);
    
    return respData({
      credits: credits.left_credits,
      isPro: credits.is_pro,
      isRecharged: credits.is_recharged,
    });
  } catch (err) {
    console.log("get user credits failed:", err);
    return respErr("获取积分信息失败");
  }
}
