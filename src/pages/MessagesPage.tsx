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
  useChatContext,
} from "stream-chat-react"
import { ChannelListMessengerProps } from "stream-chat-react"
import { useLoggedInAuth } from "../contexts/AuthContext"
import { Button } from "../components/common/Button"

const EmptyState = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Select a Conversation</h2>
        <p className="text-gray-400 mt-2">
          Choose from your existing conversations or start a new one.
        </p>
      </div>
    </div>
  );
};

const ChatContainer = () => {
  const { channel } = useChatContext();

  return (
    <div className="flex h-full w-full">
      <div className="w-80 shrink-0 border-r border-gray-700/75">
        <ChannelList List={Channels} sendChannelsToList />
      </div>
      <div className="flex-grow h-full">
        {channel ? (
          <Channel>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
          </Channel>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};


export function MessagesPage() {
  const { streamChat } = useLoggedInAuth()

  if (streamChat == null) return <LoadingIndicator />

  return (
    <Chat client={streamChat} theme="str-chat__theme-dark">
      <ChatContainer />
    </Chat>
  )
}

function Channels({ loadedChannels }: ChannelListMessengerProps) {
  const navigate = useNavigate()
  const { logout } = useLoggedInAuth()
  const { setActiveChannel, channel: activeChannel } = useChatContext()

  return (
    <div className="h-full flex flex-col gap-4 p-3">
      <Button onClick={() => navigate("/messages/new")}>New Conversation</Button>
      <hr className="border-gray-700" />
      <div className="flex-grow overflow-y-auto">
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
                className={`p-3 rounded-lg flex gap-3 items-center w-full text-left my-1 ${extraClasses}`}
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
      </div>
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