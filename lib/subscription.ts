import { UserSubscriptionPlan } from "types"
import { freePlan, proPlan } from "@/config/subscriptions"
import { db } from "@/lib/db"

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Check if user is on a pro plan.
  const isPro =
    !user.stripePriceId || !user.stripeCurrentPeriodEnd
      ? false
      : user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()

  const plan = isPro ? proPlan : freePlan

  if (!user.stripeCurrentPeriodEnd && isPro) {
    throw new Error("User is on a pro plan but has no current period end")
  }

  //@ts-ignore - The stripeCurrentPeriodEnd can be null if isPro is false - only case if we are here
  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime() ?? null,
    isPro,
  }
}
