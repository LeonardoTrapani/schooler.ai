import { SubscriptionPlan } from "types"
import { env } from "@/env.mjs"

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description:
    "The free plan has a system to easily organize professors, sections and classes. It has a limit of 5 schedules and no help of Artificial Intelligence.",
}

export const proPlan: SubscriptionPlan = {
  name: "PRO",
  description:
    "The PRO plan has unlimited schedules and the help of Artificial Intelligence.",
  stripePriceId: env.STRIPE_PRO_YEARLY_PLAN_ID,
}
