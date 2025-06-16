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
    <Chat client={streamChat} theme="str-chat__theme-dark">
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
    <div className="w-80 flex flex-col gap-4 p-3 h-full border-r border-gray-700/75">
      <Button onClick={() => navigate("/messages/new")}>New Conversation</Button>
      <hr className="border-gray-700" />
      {loadedChannels != null && loadedChannels.length > 0
        ? loadedChannels.map(channel => {
            const isActive = channel === activeChannel
            const customData = channel.data as { image?: string; name?: string };

            const extraClasses = isActive
              ? "bg-gray-700"
              : "hover:bg-gray-800/80"
            return (
              <button
                onClick={() => setActiveChannel(channel)}
                disabled={isActive}
                className={`p-3 rounded-lg flex gap-3 items-center w-full text-left ${extraClasses}`}
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
        : <div className="text-gray-500 text-center p-4">No Conversations</div>
      }
      <hr className="border-gray-700 mt-auto" />
      <Button
        onClick={() => logout()}
        className="bg-transparent border-gray-500 hover:bg-gray-800/40"
      >
        Logout
      </Button>
    </div>
  )
}