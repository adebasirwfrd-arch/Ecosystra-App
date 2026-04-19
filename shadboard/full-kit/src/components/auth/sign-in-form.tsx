"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"

import type { LocaleType, SignInFormType } from "@/types"

import { userData } from "@/data/user"

import { SignInSchema } from "@/schemas/sign-in-schema"

import { sanitizeAppHomePathname } from "@/lib/app-default-home"
import { ensureLocalizedPathname } from "@/lib/i18n"

import { toast } from "@/hooks/use-toast"
import { ButtonLoading } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SeparatorWithText } from "@/components/ui/separator"
import { OAuthLinks } from "./oauth-links"

export function SignInForm() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const redirectPathname = ensureLocalizedPathname(
    sanitizeAppHomePathname(
      searchParams.get("redirectTo") ||
        process.env.NEXT_PUBLIC_HOME_PATHNAME ||
        "/apps/ecosystra"
    ),
    params.lang as LocaleType
  )

  const form = useForm<SignInFormType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: userData.email,
      password: userData.password,
    },
  })

  const { isSubmitting } = form.formState
  const isDisabled = isSubmitting // Disable button if form is submitting

  async function onSubmit(data: SignInFormType) {
    const { email, password } = data

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result && result.error) {
        throw new Error(result.error)
      }

      router.push(redirectPathname)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6"
        autoComplete="on"
      >
        <div className="grid grow gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
          Sign In with Email
        </ButtonLoading>
        <SeparatorWithText>Or continue with</SeparatorWithText>
        <OAuthLinks />
      </form>
    </Form>
  )
}
