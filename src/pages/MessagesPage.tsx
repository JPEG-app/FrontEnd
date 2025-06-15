import { useNavigate } from "react-router-dom"
import {
  LoadingIndicator,
  Chat,
  ChannelList,
  Channel,
  Window,
  MessageInput,
  MessageList,
  ChannelHeader,
} from "stream-chat-react"
import { ChannelListMessengerProps, useChatContext } from "stream-chat-react"
import { useLoggedInAuth } from "../contexts/AuthContext"
import { Button } from "../components/common/Button"

export function MessagesPage() {
  const { user, streamChat } = useLoggedInAuth()

  if (streamChat == null) return <LoadingIndicator />

  return (
    <Chat client={streamChat}>
      <ChannelList
        List={Channels}
        sendChannelsToList
        filters={{ members: { $in: [user.id] } }}
      />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  )
}

function Channels({ loadedChannels }: ChannelListMessengerProps) {
  const navigate = useNavigate()
  const { logout } = useLoggedInAuth()
  const { setActiveChannel, channel: activeChannel } = useChatContext()

  return (
    <div className="w-60 flex flex-col gap-4 m-3 h-full">
      <Button onClick={() => navigate("/messages/new")}>New Conversation</Button>
      <hr className="border-gray-500" />
      {loadedChannels != null && loadedChannels.length > 0
        ? loadedChannels.map(channel => {
            const isActive = channel === activeChannel
            const customData = channel.data as { image?: string; name?: string };

            const extraClasses = isActive
              ? "bg-blue-800 text-white"
              : "hover:bg-gray-800/80 bg-gray-900"
            return (
              <button
                onClick={() => setActiveChannel(channel)}
                disabled={isActive}
                className={`p-4 rounded-lg flex gap-3 items-center w-full ${extraClasses}`}
                key={channel.id}
              >
                {customData?.image && (
                  <img
                    src={customData.image}
                    className="w-10 h-10 rounded-full object-center object-cover"
                  />
                )}
                <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                  {customData?.name || channel.id}
                </div>
              </button>
            )
          })
        : "No Conversations"}
      <hr className="border-gray-500 mt-auto" />
      <Button
        onClick={() => logout()}
        className="bg-transparent border-gray-500 hover:bg-gray-800/40"
      >
        Logout
      </Button>
    </div>
  )
}