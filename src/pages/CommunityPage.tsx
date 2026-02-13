import React, { useEffect, useState } from 'react';
import { Bell, Calendar, MessageSquare, AlertCircle, Loader } from 'lucide-react';
import { NoticeBoard } from '@/components/NoticeBoard';
import { EventList } from '@/components/EventList';
import { ChatBox } from '@/components/ChatBox';
import { Notice, Event, ChatMessage, getAllNotices, getAllEvents, getAllChatMessages } from '@/services/community';

type TabType = 'notices' | 'events' | 'chat';

export const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('notices');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotices = async () => {
    try {
      setError(null);
      const data = await getAllNotices();
      setNotices(data.sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notices');
    }
  };

  const loadEvents = async () => {
    try {
      setError(null);
      const data = await getAllEvents();
      setEvents(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    }
  };

  const loadMessages = async () => {
    try {
      setError(null);
      const data = await getAllChatMessages();
      setMessages(data.sort((a, b) => a.timestamp - b.timestamp));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadNotices(), loadEvents(), loadMessages()]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Reload specific data based on active tab
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'notices') {
        loadNotices();
      } else if (activeTab === 'events') {
        loadEvents();
      } else if (activeTab === 'chat') {
        loadMessages();
      }
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-black pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🌐 Community Hub</h1>
          <p className="text-gray-400">
            Stay connected with notices, upcoming events, and community chat
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-yellow-600/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-xs text-gray-400">Notices</p>
                <p className="text-2xl font-bold text-white">{notices.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-yellow-600/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-xs text-gray-400">Upcoming Events</p>
                <p className="text-2xl font-bold text-white">
                  {events.filter(e => new Date(e.date) >= new Date()).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-yellow-600/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-xs text-gray-400">Messages</p>
                <p className="text-2xl font-bold text-white">{messages.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-yellow-600/30">
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-3 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'notices'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notices
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-3 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'events'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Events
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-3 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-600/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Content Area */}
        {isLoading && activeTab === 'notices' && notices.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <Loader className="w-8 h-8 text-yellow-600 animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'notices' && (
              <NoticeBoard
                notices={notices}
                isLoading={false}
                onNoticeDeleted={loadNotices}
              />
            )}

            {activeTab === 'events' && (
              <EventList
                events={events}
                isLoading={false}
                onEventDeleted={loadEvents}
              />
            )}

            {activeTab === 'chat' && (
              <ChatBox
                messages={messages}
                isLoading={false}
                onMessageSent={loadMessages}
                onMessageDeleted={loadMessages}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
