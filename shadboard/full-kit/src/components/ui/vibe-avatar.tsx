"use client"

import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva } from "class-variance-authority"
import { User } from "lucide-react"
import {
  Children,
  cloneElement,
  isValidElement,
  type AriaRole,
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react"

import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/** Monday-style palette names → CSS colors (see Bluprint/Avatar.md). */
export const AVATAR_BACKGROUND_COLORS: Record<string, string> = {
  "chili-blue": "hsl(211 100% 45%)",
  lipstick: "hsl(340 82% 52%)",
  "done-green": "hsl(var(--success))",
  "bright-blue": "hsl(211 90% 60%)",
  aquamarine: "hsl(168 76% 42%)",
  working_orange: "hsl(36 98% 55%)",
  peach: "hsl(24 95% 88%)",
  bubble: "hsl(280 60% 92%)",
  berry: "hsl(330 55% 45%)",
  "berry-500": "hsl(330 55% 45%)",
}

export type AvatarSize = "xs" | "small" | "medium" | "large"
export type AvatarType = "img" | "text" | "icon"

export type AvatarBadgeProps = {
  src?: string
  icon?: LucideIcon
  tabIndex?: number
  className?: string
  size?: AvatarSize
}

const SIZE_PX: Record<AvatarSize, number> = {
  xs: 20,
  small: 28,
  medium: 36,
  large: 48,
}

const BADGE_SCALE: Record<AvatarSize, number> = {
  xs: 0.42,
  small: 0.38,
  medium: 0.34,
  large: 0.3,
}

const vibeShellVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden font-medium text-white ring-background transition-opacity",
  {
    variants: {
      shape: {
        circle: "rounded-full",
        square: "rounded-md",
      },
      border: {
        on: "ring-2",
        off: "",
      },
      disabled: {
        true: "cursor-not-allowed opacity-45 grayscale",
        false: "",
      },
      interactive: {
        true: "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring",
        false: "",
      },
    },
    defaultVariants: {
      shape: "circle",
      border: "on",
      disabled: false,
      interactive: false,
    },
  }
)

function resolveBg(color?: string): string | undefined {
  if (!color) return undefined
  return AVATAR_BACKGROUND_COLORS[color] ?? color
}

function AvatarCornerBadge({
  position,
  parentPx,
  props,
}: {
  position: "tl" | "tr" | "bl" | "br"
  parentPx: number
  props: AvatarBadgeProps
}) {
  const badgeSizeKey = props.size ?? "small"
  const scale = BADGE_SCALE[badgeSizeKey]
  const s = Math.max(12, Math.round(parentPx * scale))
  const pos =
    position === "tl"
      ? "left-0 top-0 -translate-x-1/4 -translate-y-1/4"
      : position === "tr"
        ? "right-0 top-0 translate-x-1/4 -translate-y-1/4"
        : position === "bl"
          ? "left-0 bottom-0 -translate-x-1/4 translate-y-1/4"
          : "right-0 bottom-0 translate-x-1/4 translate-y-1/4"

  const Icon = props.icon

  return (
    <span
      className={cn(
        "pointer-events-none absolute z-10 flex items-center justify-center rounded-full border-2 border-background bg-background shadow-sm",
        pos,
        props.className
      )}
      style={{ width: s, height: s }}
      tabIndex={props.tabIndex}
    >
      {props.src ? (
        <img
          src={props.src}
          alt=""
          className="size-full rounded-full object-cover"
        />
      ) : Icon ? (
        <Icon className="size-[55%] text-foreground" aria-hidden />
      ) : null}
    </span>
  )
}

export type VibeAvatarProps = {
  id?: string
  type?: AvatarType
  size?: AvatarSize
  /** Overrides `size` when set (pixels). */
  customSize?: number
  src?: string
  text?: string
  icon?: LucideIcon
  /** Named palette key (see `AVATAR_BACKGROUND_COLORS`) or any CSS color. */
  backgroundColor?: string
  square?: boolean
  disabled?: boolean
  withoutBorder?: boolean
  withoutTooltip?: boolean
  className?: string
  avatarContentWrapperClassName?: string
  textClassName?: string
  /** Required for accessibility when the avatar is meaningful (per Bluprint/Avatar.md). */
  ariaLabel: string
  ariaHidden?: boolean
  role?: AriaRole
  tabIndex?: number
  "data-testid"?: string
  onClick?: (
    event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
  ) => void
  tooltipProps?: Partial<{
    content: ReactNode
    side: ComponentProps<typeof TooltipContent>["side"]
    delayDuration: number
  }>
  topLeftBadgeProps?: AvatarBadgeProps
  topRightBadgeProps?: AvatarBadgeProps
  bottomLeftBadgeProps?: AvatarBadgeProps
  bottomRightBadgeProps?: AvatarBadgeProps
}

export function VibeAvatar({
  id,
  type: typeProp,
  size = "medium",
  customSize,
  src,
  text,
  icon: Icon,
  backgroundColor = "chili-blue",
  square = false,
  disabled = false,
  withoutBorder = false,
  withoutTooltip = false,
  className,
  avatarContentWrapperClassName,
  textClassName,
  ariaLabel,
  ariaHidden,
  role,
  tabIndex,
  "data-testid": dataTestId,
  onClick,
  tooltipProps,
  topLeftBadgeProps,
  topRightBadgeProps,
  bottomLeftBadgeProps,
  bottomRightBadgeProps,
}: VibeAvatarProps) {
  const px = customSize ?? SIZE_PX[size]
  const inferredType: AvatarType =
    typeProp ??
    (src ? "img" : Icon ? "icon" : "text")
  const bg = resolveBg(backgroundColor) ?? "hsl(var(--muted))"
  const fontSize = Math.max(9, Math.round(px * 0.36))
  const lightPastel =
    backgroundColor &&
    ["peach", "bubble"].includes(backgroundColor)
  const contentColor = lightPastel ? "#0f172a" : "#ffffff"
  const radiusImg = square ? "rounded-md" : "rounded-full"

  const shell = (
    <span
      id={id}
      data-testid={dataTestId}
      className={cn(
        vibeShellVariants({
          shape: square ? "square" : "circle",
          border: withoutBorder ? "off" : "on",
          disabled,
          interactive: !!(onClick && !disabled),
        }),
        className
      )}
      style={{
        width: px,
        height: px,
        backgroundColor:
          inferredType !== "img" ? bg : undefined,
      }}
      role={role ?? (onClick ? "button" : undefined)}
      tabIndex={tabIndex ?? (onClick && !disabled ? 0 : undefined)}
      aria-hidden={ariaHidden}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-disabled={disabled || undefined}
      onClick={
        onClick && !disabled
          ? (e) => onClick(e as MouseEvent<HTMLElement>)
          : undefined
      }
      onKeyDown={
        onClick && !disabled
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick(e as KeyboardEvent<HTMLElement>)
              }
            }
          : undefined
      }
    >
      <span
        className={cn(
          "flex size-full items-center justify-center overflow-hidden",
          inferredType === "img" && "rounded-[inherit] bg-muted",
          avatarContentWrapperClassName
        )}
      >
        {inferredType === "img" && src ? (
          <AvatarPrimitive.Root className={cn("size-full", radiusImg)}>
            <AvatarPrimitive.Image
              src={src}
              alt=""
              className={cn("size-full object-cover", radiusImg)}
            />
            <AvatarPrimitive.Fallback
              delayMs={0}
              className={cn(
                "flex size-full items-center justify-center bg-muted text-muted-foreground",
                radiusImg
              )}
            >
              <User className="size-[55%]" aria-hidden />
            </AvatarPrimitive.Fallback>
          </AvatarPrimitive.Root>
        ) : inferredType === "icon" && Icon ? (
          <Icon
            style={{
              width: px * 0.55,
              height: px * 0.55,
              color: contentColor,
            }}
            aria-hidden
          />
        ) : (
          <span
            className={cn(
              "font-semibold leading-none tracking-tight",
              textClassName
            )}
            style={{ fontSize, color: contentColor }}
          >
            {(text ?? "?").slice(0, 3)}
          </span>
        )}
      </span>

      {topLeftBadgeProps ? (
        <AvatarCornerBadge
          position="tl"
          parentPx={px}
          props={topLeftBadgeProps}
        />
      ) : null}
      {topRightBadgeProps ? (
        <AvatarCornerBadge
          position="tr"
          parentPx={px}
          props={topRightBadgeProps}
        />
      ) : null}
      {bottomLeftBadgeProps ? (
        <AvatarCornerBadge
          position="bl"
          parentPx={px}
          props={bottomLeftBadgeProps}
        />
      ) : null}
      {bottomRightBadgeProps ? (
        <AvatarCornerBadge
          position="br"
          parentPx={px}
          props={bottomRightBadgeProps}
        />
      ) : null}
    </span>
  )

  const tip =
    tooltipProps?.content !== undefined ? tooltipProps.content : ariaLabel

  if (withoutTooltip || ariaHidden) {
    return shell
  }

  return (
    <TooltipProvider delayDuration={tooltipProps?.delayDuration ?? 300}>
      <Tooltip>
        <TooltipTrigger asChild>{shell}</TooltipTrigger>
        <TooltipContent side={tooltipProps?.side ?? "top"}>
          {tip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export type AvatarGroupProps = {
  id?: string
  children: ReactNode
  max: number
  size?: AvatarSize
  disabled?: boolean
  className?: string
  counterProps?: {
    color?: "light" | "dark"
    /** Accessible label for the +N chip (per blueprint `counterAriaLabel`). */
    ariaLabel?: string
  }
  counterTooltipCustomProps?: Partial<{
    side: ComponentProps<typeof TooltipContent>["side"]
  }>
}

export function AvatarGroup({
  id,
  children,
  max,
  size = "large",
  disabled = false,
  className,
  counterProps,
  counterTooltipCustomProps,
}: AvatarGroupProps) {
  const flat = Children.toArray(children).filter(Boolean)
  const shown = flat.slice(0, max)
  const rest = Math.max(0, flat.length - max)
  const dark = counterProps?.color === "dark"

  return (
    <div
      id={id}
      className={cn("flex items-center", disabled && "opacity-45", className)}
      aria-disabled={disabled || undefined}
    >
      {shown.map((child, i) => (
        <div
          key={i}
          className="-ms-2 first:ms-0 relative"
          style={{ zIndex: shown.length - i }}
        >
          {isValidElement(child)
            ? cloneElement(child as ReactElement<{ size?: AvatarSize }>, {
                size:
                  (child as ReactElement<{ size?: AvatarSize }>).props.size ??
                  size,
              })
            : child}
        </div>
      ))}
      {rest > 0 ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "-ms-2 flex items-center justify-center rounded-full border-2 border-background font-medium ring-0",
                  dark
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
                style={{
                  width: SIZE_PX[size],
                  height: SIZE_PX[size],
                  fontSize: Math.max(10, Math.round(SIZE_PX[size] * 0.32)),
                }}
                aria-label={
                  counterProps?.ariaLabel ?? `${rest} more`
                }
              >
                +{rest}
              </div>
            </TooltipTrigger>
            <TooltipContent side={counterTooltipCustomProps?.side ?? "bottom"}>
              {counterProps?.ariaLabel ?? `${rest} more people`}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </div>
  )
}
