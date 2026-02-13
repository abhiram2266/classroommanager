import React, { useEffect, useRef, useState } from 'react';
import { Send, AlertCircle, Loader } from 'lucide-react';
import { ChatMessage, sendChatMessage, deleteChatMessage } from '@/services/community';

interface ChatBoxProps {
  messages: ChatMessage[];
  onSend: () => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSend }) => {
  const [newMessage, setNewMessage] = useState('');
  const [senderName, setSenderName] = useState('Anonymous');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      setError('Message cannot be empty');
      return;
    }
    if (!senderName.trim()) {
      setError('Please enter your name');
      return;
    }

    setError(null);
    setIsSending(true);
    try {
      await sendChatMessage(senderName, newMessage);
      setNewMessage('');
      onSend();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    setDeletingId(id);
    try {
      await deleteChatMessage(id);
      onSend();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black rounded-lg border border-yellow-600/30 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="group">
              <div className="bg-gray-900/50 rounded-lg p-3 border border-yellow-600/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-yellow-600">{msg.senderName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      disabled={deletingId === msg.id}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-600/20 rounded text-xs disabled:opacity-50"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 text-sm break-words">{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-900/30 border-t border-red-600/50 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="p-4 border-t border-yellow-600/30 bg-gray-900/50">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Your name"
            maxLength={30}
            className="flex-1 bg-black border border-yellow-600/30 rounded px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-600"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isSending}
            className="flex-1 bg-black border border-yellow-600/30 rounded px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSending}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold rounded disabled:opacity-50 flex items-center gap-2"
          >
            {isSending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
