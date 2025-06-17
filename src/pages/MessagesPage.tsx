import { useState, KeyboardEvent } from 'react';
import { useNavigate } from "react-router-dom";
import {
  LoadingIndicator,
  Chat,
  ChannelList,
  Channel,
  MessageList,
  useChatContext,
  ChannelPreviewUIComponentProps,
  useMessageContext,
} from "stream-chat-react";
import { useLoggedInAuth } from "../contexts/AuthContext";
import TextareaAutosize from 'react-textarea-autosize';

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
const SendIcon = ({ disabled }: { disabled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${disabled ? 'text-gray-500' : 'text-blue-500'}`}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const CustomMessage = () => {
    const { message, isMyMessage, groupStyles } = useMessageContext();
    if (!message) return null;

    const isMine = isMyMessage();
    const messageGroupStyle = groupStyles?.[0] || '';
    let borderRadiusClasses = "rounded-2xl";
    if (messageGroupStyle === "top") borderRadiusClasses = isMine ? "rounded-t-2xl rounded-bl-2xl rounded-br-md" : "rounded-t-2xl rounded-br-2xl rounded-bl-md";
    else if (messageGroupStyle === "bottom") borderRadiusClasses = isMine ? "rounded-b-2xl rounded-tl-2xl rounded-tr-md" : "rounded-b-2xl rounded-tr-2xl rounded-tl-md";
    else if (messageGroupStyle === "middle") borderRadiusClasses = isMine ? "rounded-l-2xl rounded-r-md" : "rounded-r-2xl rounded-l-md";

    const timeString = message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '';

    return (
        <div className={`flex items-end gap-2 my-0.5 px-4 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`max-w-[70%] px-4 py-2 ${borderRadiusClasses} ${isMine ? 'bg-blue-500' : 'bg-gray-700'}`}>
                <p className="text-white whitespace-pre-wrap break-words">{message.text}</p>
            </div>
            <p className="text-xs text-gray-500 mb-1">{timeString}</p>
        </div>
    );
};

const StandaloneTwitterInput = () => {
    const { channel } = useChatContext();
    const [text, setText] = useState('');

    const sendMessage = async () => {
        if (!text.trim() || !channel) return;
        
        try {
            await channel.sendMessage({ text });
            setText('');
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };
    
    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="p-2 border-t border-gray-700/75 bg-black flex items-center gap-2">
            <div className="flex-grow bg-gray-800 rounded-2xl flex items-center px-2">
                <TextareaAutosize
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Start a new message"
                    className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none py-2.5 px-2"
                    maxRows={5}
                />
            </div>
            <button onClick={sendMessage} disabled={!text.trim()} className="p-2 disabled:cursor-not-allowed">
                <SendIcon disabled={!text.trim()} />
            </button>
        </div>
    );
}

const CustomChannelHeader = () => {
  const { channel, setActiveChannel } = useChatContext();
  if (!channel) return null;
  const customData = channel.data as { image?: string; name?: string };

  return (
    <div className="flex items-center gap-4 p-3 h-[53px] border-b border-gray-700/75 sticky top-0 bg-black/75 backdrop-blur-md z-10">
      <button onClick={() => setActiveChannel?.(undefined)} className="p-1 -ml-1 hover:bg-gray-800 rounded-full"><BackArrowIcon /></button>
      {customData?.image && <img src={customData.image} className="w-8 h-8 rounded-full object-center object-cover" alt={customData.name} />}
      <div className="flex flex-col"><span className="font-bold text-lg leading-tight">{customData?.name || channel.id}</span></div>
    </div>
  );
};

const ActiveChatWindow = () => {
  return (
    <div className="h-full flex flex-col">
      <Channel>
        <CustomChannelHeader />
        <div className="flex-grow overflow-y-auto">
          <MessageList Message={CustomMessage} />
        </div>
        <StandaloneTwitterInput />
      </Channel>
    </div>
  );
};

const ConversationPreview = (props: ChannelPreviewUIComponentProps) => {
  const { channel, setActiveChannel, latestMessagePreview, displayImage, displayTitle } = props;
  return (
    <button onClick={() => setActiveChannel?.(channel)} className="w-full text-left p-4 border-b border-gray-700/75 hover:bg-gray-800/40 flex gap-3 transition-colors duration-200">
      {displayImage && <img src={displayImage} className="w-12 h-12 rounded-full bg-gray-700" alt={displayTitle} />}
      <div className="flex-grow overflow-hidden">
        <div className="flex justify-between items-center"><span className="font-bold truncate">{displayTitle}</span></div>
        <p className="text-gray-400 truncate text-sm">{latestMessagePreview ?? 'No messages yet'}</p>
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
        <button onClick={() => navigate("/messages/new")} className="p-2 hover:bg-gray-800 rounded-full"><NewMessageIcon /></button>
      </div>
      <ChannelList filters={{ type: "messaging", members: { $in: [user.id] } }} sort={{ last_message_at: -1 }} Preview={ConversationPreview} setActiveChannelOnMount={false} />
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
      <div className="p-4 border-b border-gray-700/75 flex justify-center items-center h-24"><LoadingIndicator /></div>
    );
  }

  return (
    <Chat client={streamChat} theme="str-chat__theme-dark">
      <ChatLayout />
    </Chat>
  );
}