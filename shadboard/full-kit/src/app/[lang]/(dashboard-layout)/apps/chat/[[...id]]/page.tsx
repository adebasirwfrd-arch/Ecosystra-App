import { ChatBox } from "../_components/chat-box"
import { ChatBoxPlaceholder } from "../_components/chat-box-placeholder"

export default async function ChatBoxPage(props: {
  params: Promise<{ id: string[] }>
}) {
  const params = await props.params
  const chatIdParam = params.id?.[0]

  if (!chatIdParam) return <ChatBoxPlaceholder />

  return <ChatBox />
}
