import { siteConfig } from "@/config/site"

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function LandingPage() {
  return (
    <div>
      <h1>Landing page</h1>
    </div>
  )
}
