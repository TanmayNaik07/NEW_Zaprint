import { createClient } from "./server"

export async function getSiteSettings() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")

  if (error) {
    console.error("Error fetching site settings:", error)
    return {}
  }

  return data.reduce((acc: any, item: any) => {
    acc[item.key] = item.value
    return acc
  }, {})
}

export async function getSettingByKey(key: string, defaultValue: any = null) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single()

  if (error) {
    return defaultValue
  }

  return data.value || defaultValue
}
