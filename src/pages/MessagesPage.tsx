import { useNavigate } from "react-router-dom";
import {
  LoadingIndicator,
  Chat,
  ChannelList,
  Channel,
  Window,
  MessageInput,
  MessageList,
  useChatContext,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";
import { useLoggedInAuth } from "../contexts/AuthContext";

const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
  </svg>
);

const NewMessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
  </svg>
);

const CustomChannelHeader = () => {
  const { channel, setActiveChannel } = useChatContext();

  if (!channel) return null;

  const customData = channel.data as { image?: string; name?: string };

  return (
    <div className="flex items-center gap-4 p-3 h-[53px] border-b border-gray-700/75 sticky top-0 bg-black/75 backdrop-blur-md z-10">
      <button onClick={() => setActiveChannel?.(undefined)} className="p-1 -ml-1 hover:bg-gray-800 rounded-full">
        <BackArrowIcon />
      </button>
      {customData?.image && (
        <img src={customData.image} className="w-8 h-8 rounded-full object-center object-cover" alt={customData.name} />
      )}
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-tight">
          {customData?.name || channel.id}
        </span>
      </div>
    </div>
  );
};

const ActiveChatWindow = () => {
  return (
    <div className="h-full flex flex-col">
      <Channel>
        <Window>
          <CustomChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
};

const ConversationPreview = (props: ChannelPreviewUIComponentProps) => {
  const { channel, setActiveChannel, latestMessagePreview, displayImage, displayTitle } = props;

  return (
    <button
      onClick={() => setActiveChannel?.(channel)}
      className="w-full text-left p-4 border-b border-gray-700/75 hover:bg-gray-800/40 flex gap-3 transition-colors duration-200"
    >
      {displayImage && <img src={displayImage} className="w-12 h-12 rounded-full bg-gray-700" alt={displayTitle} />}
      <div className="flex-grow overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="font-bold truncate">{displayTitle}</span>
        </div>
        <p className="text-gray-400 truncate text-sm">
          {latestMessagePreview ?? 'No messages yet'}
        </p>
      </div>
    </button>
  );
};

const ChannelListContainer = () => {
  const navigate = useNavigate();
  const { user } = useLoggedInAuth();

  return (
    <>
      <div className="flex items-center justify-between p-3 h-[53px] border-b border-gray-700/75 sticky top-0 bg-black/75 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold">Messages</h1>
        <button onClick={() => navigate("/messages/new")} className="p-2 hover:bg-gray-800 rounded-full">
          <NewMessageIcon />
        </button>
      </div>
      <ChannelList
        filters={{ type: "messaging", members: { $in: [user.id] } }}
        sort={{ last_message_at: -1 }}
        Preview={ConversationPreview}
      />
    </>
  );
};

const ChatLayout = () => {
  const { channel } = useChatContext();
  return <>{channel ? <ActiveChatWindow /> : <ChannelListContainer />}</>;
};

export function MessagesPage() {
  const { streamChat } = useLoggedInAuth();

  if (streamChat == null) {
    return (
      <div className="p-4 border-b border-gray-700/75 flex justify-center items-center h-24">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <Chat client={streamChat} theme="str-chat__theme-dark">
      <ChatLayout />
    </Chat>
  );
}