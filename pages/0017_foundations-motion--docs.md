---
id: foundations-motion--docs
type: docs
title: "Foundations/Motion"
name: "Docs"
importPath: "./src/pages/foundations/motion/motion.mdx"
iframeUrl: https://vibe.monday.com/iframe.html?id=foundations-motion--docs&viewMode=docs
extractedWith: .sbdocs-wrapper
scrapedAt: 2026-04-17T16:31:21.630Z
---

Motion

Animation is a powerful tool for communication and is an integral part of the visual language of a product. It helps make the user interface easier to understand and navigate, intuitive to use, and more interactive to work with. Here are the four main processes that help bridge the gap between the virtual world we build and the physical world we know:

Orientation & Continuity
We use motion to give a sense of familiarity by helping us understand where things are located, where they're coming from, and where to find them again.
feedback & status - mediation
We use motion to earn the feeling of reassurance and control.It informs us when actions are in process and make things appear to happen faster than they actually do.
Focus
We use motion to helps focus user attention on what's important, without adding unnecessary distractions.
Delight
We use motion to celebrate moments in the user's journey. Motion creates emotional commitment and expresses our brand's personality and style.
Implementation - Duration and Ease
Duration - how long a transition lasts

Every move should feel smooth and contribute to the feeling that our platform is responsive, efficient, and fast. When elements change their state or position, the duration of the animation should be slow enough to give users the chance to notice the change, but quick enough to not keep them waiting.

The style and size of the motion determine the duration. There are two styles; Productive motion and Expressive motion. The Productive motion duration range is between 70 - 150 ms, while Expressive motion scopes between 250 to 400 ms.

Productive motion

Use Productive motion for moments when the user needs to focus on completing tasks.

Small motion - 70ms
Use when components require minor changes, micro-Interactions, and fades.

Token: --motion-productive-small

Medium motion - 100ms
Use when components require medium changes, small expansions, and notifications.

Token: --motion-productive-medium

Large motion - 150ms
Use when components require major changes, expansions, and distance movement.

Token: --motion-productive-long

Expressive motion

Use expressive motion when the movement itself is crucial in conveying the meaning of the action.

Small motion - 250ms
System alerts, notifications, attentions, and mediation.

Token: --motion-expressive-short

Large motion - 400ms
System alerts, notifications, attentions, and mediations that enter the screen with movement.

Token: --motion-expressive-long

Summary on duration
Token	Usage	Value
--motion-productive-short	Micro-Interactions	70ms
--motion-productive-medium	Small expansions, small notifications	100ms
--motion-productive-long	Expansions, distance movment	150ms
--motion-expressive-short	Notification - elastic/bounce	250ms
--motion-expressive-long	Notification - elastic/bounce + movment	400ms
Ease - acceleration over time

Since linear movements appear unnatural to a human eye, objects should always move with some acceleration or deceleration — just like all live objects in the physical world.

Do
Using ease to make movement feel natural.
Don't
Linear motion feels mechanical and unnatural.
Enter - Decelerated easing
Use when object enter from out of screen to reveal extra information.

cubic-bezier(0,0,0.35,1)

Token: --motion-timing-enter

Exit - Accelerated easing
Use when object leaves the screen to hide element.

cubic-bezier(0.4,0,1,1)

Token: --motion-timing-exit

Transition - Standard easing
Use to transition between different states of the same element in screen.

cubic-bezier((0.4,0,0.2,1))

Token: --motion-timing-transition

Emphesize - Elastic easing
Use to draw attention to a specific action or specific information.

cubic-bezier((0,0,0.2,1.4),(Duration must be over 200ms)

Token: --motion-timing-emphesize

Summary on easing
Token	Usage	Cubic bezier
--motion-timing-enter	Entrence	(0,0,0.35,1)	
--motion-timing-exit	Exit	(0.4,0,1,1)	
--motion-timing-transition	Transition	(0.4,0,0.2,1)	
--motion-timing-emphesize	Emphasized easing draws extra attention	(0,0,0.2,1.4)	
Do's and don'ts
Consistency

Similar elements must have similar moves. Implement easing curves and timing with a consistent rhythm to ensure motion is predictable and familiar to the user.

Do
Using ease to make movement feel natural.
Don't
Linear motion feels mechanical and unnatural.
Simplicity

Simple movements make it easier for the user to follow along and convey a clear message. Keep it simple and clever.

Do
Use only one primary action within a single view.
Don't
Don’t use multiple primary buttons within a single view.
Don’t delay the user

The user should never get the feeling that they are waiting for the animation to end.

Do
Use only one primary action within a single view.
Don't
Don’t use multiple primary buttons within a single view.
Animation Types
CSS - basic transitions (Position, Rotation, Scale)
Use CSS animations and transitions primarily for UI elements and other basic transitions and animations.
Lottie - complex and custom animations
Lottie is a Json file exported directly from After Effects. The file is Lightweight and scaleable. To be used mainly in mobile, however, can be utilized also in unique or inteactive animations in the Descktop.
SVG - lightweight, scalable, easy to replace
SVG animated file, exported from an animation software. Ideally to be used on icons or multiple assets. Easy to replace and adjust over time.
Sprite
A spritesheet is a PNG file that contains sequences of animation. It has improved performances when loading, but is not scaleable.
