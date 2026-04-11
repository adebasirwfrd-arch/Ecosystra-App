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
import { RegisterForm } from "./register-form"

export function Register({ dictionary }: { dictionary: DictionaryType }) {
  return (
    <Auth
      imgSrc="/images/illustrations/misc/welcome.svg"
      dictionary={dictionary}
    >
      <AuthHeader>
        <AuthTitle>Sign Up</AuthTitle>
        <AuthDescription>
          Enter your information to create an account
        </AuthDescription>
      </AuthHeader>
      <AuthForm>
        <Suspense fallback={<AuthFormSuspenseFallback />}>
          <RegisterForm />
        </Suspense>
      </AuthForm>
    </Auth>
  )
}
