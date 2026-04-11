// More info: https://nextjs.org/docs/app/building-your-application/routing/internationalization#localization
import "server-only"

import { i18n } from "@/configs/i18n"
import type { LocaleType } from "@/types"

const dictionaries = {
  en: () =>
    import("@/data/dictionaries/en.json").then((module) => module.default),
  ar: () =>
    import("@/data/dictionaries/ar.json").then((module) => module.default),
}

export async function getDictionary(locale: LocaleType) {
  const load =
    dictionaries[locale] ??
    dictionaries[i18n.defaultLocale as LocaleType]
  return load()
}

export type DictionaryType = Awaited<ReturnType<typeof getDictionary>>
