import { Suspense } from "react"

import type { DictionaryType } from "@/lib/get-dictionary"

import {
  Auth,
  AuthDescription,
  AuthForm,
  AuthFormSuspenseFallback,
  AuthHeader,
  AuthTitle,
} from "./auth-layout"
import { NewPasswordForm } from "./new-password-form"

export function NewPassword({ dictionary }: { dictionary: DictionaryType }) {
  return (
    <Auth dictionary={dictionary}>
      <AuthHeader>
        <AuthTitle>New Password</AuthTitle>
        <AuthDescription>Enter your new password</AuthDescription>
      </AuthHeader>
      <AuthForm>
        <Suspense fallback={<AuthFormSuspenseFallback />}>
          <NewPasswordForm />
        </Suspense>
      </AuthForm>
    </Auth>
  )
}
