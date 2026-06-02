import { prisma } from "./db";
import { PRICING, AppKey, getSubscriptionFor } from "./stripe";

const monthStart = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

export type AppUsage = {
  app: AppKey;
  used: number;
  limit: number;
  remaining: number;
  active: boolean;
  periodEnd: Date | null;
  unit: string;
};

export async function getAppUsage(userId: string, app: AppKey): Promise<AppUsage> {
  const sub = await getSubscriptionFor(userId, app);
  if (sub) {
    return {
      app,
      used: 0,
      limit: Infinity,
      remaining: Infinity,
      active: true,
      periodEnd: sub.currentPeriodEnd,
      unit: "unlimited",
    };
  }

  const limit = PRICING[app].free;
  const start = monthStart();

  let used = 0;
  if (app === "a") {
    used = await prisma.conversation.count({
      where: { userId, createdAt: { gte: start } },
    });
  } else if (app === "b") {
    const u = await prisma.user.findUnique({ where: { id: userId }, include: { ownedFamilies: true } });
    const familyIds = u?.ownedFamilies.map((f) => f.id) ?? [];
    used = await prisma.family.count({
      where: { id: { in: familyIds }, createdAt: { gte: start } },
    });
  } else if (app === "c") {
    used = await prisma.mealPlan.count({
      where: { userId, createdAt: { gte: start } },
    });
  } else if (app === "d") {
    used = await prisma.friend.count({ where: { userId } });
  }

  return {
    app,
    used,
    limit,
    remaining: Math.max(0, limit - used),
    active: false,
    periodEnd: null,
    unit: PRICING[app].freeUnit,
  };
}

export async function canUseApp(userId: string, app: AppKey): Promise<boolean> {
  const sub = await getSubscriptionFor(userId, app);
  if (sub) return true;
  const usage = await getAppUsage(userId, app);
  return usage.used < usage.limit;
}
