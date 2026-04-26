import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, UserPlus, MessageCircle, Send, Search, 
  Check, X, Zap, Target, Shield, Bell, Loader2,
  ChevronRight, ArrowLeft
} from 'lucide-react';
import socialService from '../services/socialService';
import chatService from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Community = () => {
  const { user } = useAuth();
  const [partners, setPartners] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);
  const pollInterval = useRef(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll for new data every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedPartner) {
      fetchChatHistory();
      // Start polling for new messages when a partner is selected
      if (pollInterval.current) clearInterval(pollInterval.current);
      pollInterval.current = setInterval(fetchChatHistory, 3000); // Faster polling for active chat
    } else {
      if (pollInterval.current) clearInterval(pollInterval.current);
    }
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [selectedPartner]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchData = async () => {
    try {
      const [partnersData, requestsData] = await Promise.all([
        socialService.getPartners(),
        socialService.getRequests()
      ]);
      setPartners(partnersData);
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    if (!selectedPartner) return;
    try {
      const history = await chatService.getHistory(selectedPartner.id);
      setMessages(history);
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;
    try {
      await socialService.sendRequest(searchUsername);
      toast.success(`Request sent to ${searchUsername}`);
      setSearchUsername('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'User not found');
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await socialService.acceptRequest(requestId);
      toast.success('Partnership accepted!');
      fetchData();
    } catch (error) {
      toast.error('Could not accept request');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPartner) return;
    
    setSending(true);
    try {
      await chatService.sendMessage(selectedPartner.id, newMessage);
      setNewMessage('');
      fetchChatHistory();
    } catch (error) {
      toast.error('Message failed to send');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-fg pb-12 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Users className="text-primary" size={36} />
              Community
            </h1>
            <p className="text-text-secondary">Your accountability circle for unstoppable growth.</p>
          </div>

          <form onSubmit={handleSendRequest} className="relative group w-full md:w-96">
            <input 
              type="text"
              placeholder="Search by username..."
              className="w-full bg-surface-raised border border-border/50 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted group-focus-within:text-primary transition-colors" size={20} />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-bg font-bold py-1.5 px-4 rounded-lg text-sm hover:scale-105 active:scale-95 transition-all"
            >
              Invite
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Partners Column */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Pending Requests */}
            {requests.length > 0 && (
              <div className="bg-surface-raised/50 border border-indigo-500/10 rounded-2xl p-6 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
                  <Bell size={16} />
                  Pending Invites
                </h2>
                <div className="space-y-4">
                  {requests.map(req => (
                    <div key={req.id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-primary">
                          {req.sender.username[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm">{req.sender.username}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAcceptRequest(req.id)}
                          className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-bg transition-colors"
                        >
                          <Check size={18} />
                        </button>
                        <button className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Partners List */}
            <div className="bg-surface border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-fg-muted mb-6">Accountability Circle</h2>
              <div className="space-y-3">
                {partners.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-fg-muted mx-auto mb-4 opacity-20" />
                    <p className="text-sm text-text-secondary">No partners yet. Invite some friends to start competing!</p>
                  </div>
                ) : partners.map(partner => (
                  <div 
                    key={partner.id}
                    onClick={() => setSelectedPartner(partner)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group ${
                      selectedPartner?.id === partner.id 
                      ? 'bg-primary/5 border-primary shadow-sm' 
                      : 'bg-surface-raised/30 border-transparent hover:border-border/50 hover:bg-surface-raised/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-2 border-primary/20 p-0.5 overflow-hidden">
                        {partner.profileImageUrl ? (
                          <img src={partner.profileImageUrl} alt={partner.username} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full bg-surface-overlay flex items-center justify-center font-bold text-primary">
                            {partner.username[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{partner.username}</h4>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <Zap size={12} className="text-yellow-500" />
                          <span>12 Day Streak</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <span className="text-[10px] uppercase font-bold text-green-400">Online</span>
                       <ChevronRight size={16} className={`text-fg-muted transition-transform ${selectedPartner?.id === partner.id ? 'translate-x-1 text-primary' : 'group-hover:translate-x-1'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Column */}
          <div className="lg:col-span-2">
            {selectedPartner ? (
              <div className="bg-surface border border-border/50 rounded-3xl h-[600px] flex flex-col shadow-xl overflow-hidden animate-in slide-in-from-right-4 duration-500">
                
                {/* Chat Header */}
                <div className="p-6 border-b border-border/50 bg-surface-raised/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSelectedPartner(null)}
                      className="lg:hidden p-2 hover:bg-surface-overlay rounded-lg transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {selectedPartner.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold">{selectedPartner.username}</h3>
                      <p className="text-xs text-green-400 font-semibold">Active Now</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="p-2.5 hover:bg-surface-overlay rounded-xl text-fg-muted transition-colors">
                      <Target size={20} />
                    </button>
                    <button className="p-2.5 hover:bg-surface-overlay rounded-xl text-fg-muted transition-colors">
                      <Shield size={20} />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-90">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12">
                      <div className="w-20 h-20 bg-surface-raised rounded-full flex items-center justify-center mb-6">
                        <MessageCircle size={40} className="text-fg-muted opacity-20" />
                      </div>
                      <h4 className="text-lg font-bold mb-2">No messages yet</h4>
                      <p className="text-sm text-text-secondary max-w-xs">
                        Start your accountability journey by sending a motivational message to {selectedPartner.username}!
                      </p>
                    </div>
                  ) : messages.map((msg, idx) => {
                    const isMine = msg.sender.username === user.username;
                    return (
                      <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                          isMine 
                          ? 'bg-primary text-bg rounded-tr-none' 
                          : 'bg-surface-raised border border-border/50 rounded-tl-none'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <span className={`text-[10px] block mt-2 opacity-50 ${isMine ? 'text-bg' : 'text-fg'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-6 bg-surface border-t border-border/50">
                  <div className="flex gap-3 relative">
                    <input 
                      type="text"
                      placeholder={`Message ${selectedPartner.username}...`}
                      className="flex-1 bg-surface-raised border border-border/50 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-fg-muted/50"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="bg-primary text-bg p-4 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg shadow-primary/20"
                    >
                      {sending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                    </button>
                  </div>
                </form>

              </div>
            ) : (
              <div className="hidden lg:flex bg-surface-raised/30 border border-dashed border-border/50 rounded-3xl h-[600px] flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 bg-surface rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                  <MessageCircle size={48} className="text-primary/20" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Your Conversations</h3>
                <p className="text-text-secondary max-w-sm">
                  Select an accountability partner from your circle to view their progress and start chatting.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Community;
