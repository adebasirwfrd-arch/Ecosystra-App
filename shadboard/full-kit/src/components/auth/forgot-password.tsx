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
import { ForgotPasswordForm } from "./forgot-password-form"

export function ForgotPassword({ dictionary }: { dictionary: DictionaryType }) {
  return (
    <Auth dictionary={dictionary}>
      <AuthHeader>
        <AuthTitle>Forgot Password</AuthTitle>
        <AuthDescription>
          Enter your email below to send you instructions to reset your password
        </AuthDescription>
      </AuthHeader>
      <AuthForm>
        <Suspense fallback={<AuthFormSuspenseFallback />}>
          <ForgotPasswordForm />
        </Suspense>
      </AuthForm>
    </Auth>
  )
}
