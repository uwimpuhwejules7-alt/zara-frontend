import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import socket from '../socket';
import { detectMood, getCoachFeedback, suggestReaction } from '../utils/moodDetector';
import '../styles/chat.css';
import {
  FiMessageCircle, FiSearch, FiEdit, FiBell, FiSettings,
  FiLogOut, FiInbox, FiStar, FiSend, FiFileText, FiArchive,
  FiTrash2, FiUsers, FiPhone, FiVideo, FiMoreVertical,
  FiSmile, FiPaperclip, FiMic, FiCalendar, FiZap, FiTag,
  FiMapPin, FiBellOff, FiDownload, FiSlash, FiMoon, FiSun
} from 'react-icons/fi';

const conversations = [
  { id: 1, name: 'Sara A.', initials: 'SA', color: '#dbeafe', textColor: '#1d4ed8', preview: 'Thanks for the file!', time: '10:42', unread: 3, online: true },
  { id: 2, name: 'James K.', initials: 'JK', color: '#dcfce7', textColor: '#166534', preview: 'Can we meet tomorrow?', time: '9:15', unread: 0, online: false },
  { id: 3, name: 'Design Group', initials: 'DG', color: '#fef3c7', textColor: '#92400e', preview: 'Layla: Updated mockups', time: 'Tue', unread: 0, online: true },
  { id: 4, name: 'Rami M.', initials: 'RM', color: '#fce7f3', textColor: '#9d174d', preview: 'Got it, will check tonight', time: 'Mon', unread: 0, online: false },
  { id: 5, name: 'Lara T.', initials: 'LT', color: '#ede9fe', textColor: '#5b21b6', preview: 'See you at the event!', time: 'Sun', unread: 0, online: false },
];

const timeline = [
  { label: 'First message', date: 'Mar 12, 2023', color: '#dbeafe', textColor: '#1d4ed8' },
  { label: 'Shared Q2 report', date: 'Apr 3, 2023', color: '#dcfce7', textColor: '#166534' },
  { label: 'First video call', date: 'May 18, 2023', color: '#fef3c7', textColor: '#92400e' },
  { label: 'Starred 14 messages', date: 'Aug 2024', color: '#ede9fe', textColor: '#5b21b6' },
  { label: '42 photos shared', date: 'Ongoing', color: '#fce7f3', textColor: '#9d174d' },
];

const REACTIONS = ['👍', '❤️', '😂', '😮', '🔥', '🎉'];

export default function Chat() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [mobileTab, setMobileTab] = useState('chats');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [coachFeedback, setCoachFeedback] = useState(null);
  const [currentMood, setCurrentMood] = useState(null);
  const [msgReactions, setMsgReactions] = useState({});
  const [showReactions, setShowReactions] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    socket.connect();
    socket.emit('user_join', user.id);
    return () => socket.disconnect();
  }, [user.id]);

  useEffect(() => {
    socket.emit('join_conversation', activeConv.id);
    setMessages([
      { id: 1, content: 'Hey! Did you finish the report?', sender_id: 99, created_at: '10:30', chapter: 'Morning' },
      { id: 2, content: 'Yes! Sending it over now — check your inbox.', sender_id: user.id, created_at: '10:38' },
      { id: 3, content: 'Thanks for the file! The new design looks amazing 🎉', sender_id: 99, created_at: '10:42' },
      { id: 4, content: 'Glad you like it! Let me know if anything needs tweaking.', sender_id: user.id, created_at: '10:44', chapter: 'Afternoon' },
      { id: 5, content: 'Will do! Can we hop on a quick call later?', sender_id: 99, created_at: '14:00' },
      { id: 6, content: 'Sure! 3pm works for me 👍', sender_id: user.id, created_at: '14:02' },
    ]);
  }, [activeConv, user.id]);

  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    socket.on('user_typing', (data) => {
      setIsTyping(true);
      setTypingUser(data.name);
    });
    socket.on('user_stop_typing', () => {
      setIsTyping(false);
      setTypingUser('');
    });
    return () => {
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    socket.disconnect();
    navigate('/');
  };

  const handleTyping = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val.length > 3) {
      setCoachFeedback(getCoachFeedback(val));
      setCurrentMood(detectMood(val));
    } else {
      setCoachFeedback(null);
      setCurrentMood(null);
    }
    socket.emit('typing', { conversation_id: activeConv.id, userId: user.id, name: user.name });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { conversation_id: activeConv.id, userId: user.id });
    }, 2000);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const mood = detectMood(input);
    const messageData = {
      id: Date.now(),
      sender_id: user.id,
      conversation_id: activeConv.id,
      content: input,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood
    };
    socket.emit('send_message', messageData);
    setMessages(prev => [...prev, messageData]);
    setInput('');
    setCoachFeedback(null);
    setCurrentMood(null);
    socket.emit('stop_typing', { conversation_id: activeConv.id, userId: user.id });
  };

  const handleKey = (e) => { if (e.key === 'Enter') sendMessage(); };

  const toggleReaction = (msgId, emoji) => {
    setMsgReactions(prev => {
      const current = prev[msgId] || {};
      return { ...prev, [msgId]: { ...current, [emoji]: current[emoji] ? 0 : 1 } };
    });
    setShowReactions(null);
  };

  const getMoodBar = () => currentMood || { dot: '#60a5fa', label: 'Friendly tone detected — relaxed conversation' };

  return (
    <div className={`app-wrap ${darkMode ? 'dark' : ''}`}>
      <div className="topnav">
        <div className="nav-logo">
          <div className="nav-logo-icon">💬</div>
          <span>Zara</span>
        </div>
        <div className="nav-search">
          <FiSearch className="search-icon" />
          <input placeholder="Search messages, people, files…" />
        </div>
        <div className="nav-actions">
          <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FiSun size={13} /> : <FiMoon size={13} />}
            {darkMode ? ' Light' : ' Dark'}
          </button>
          <button className="nav-icon-btn"><FiEdit /></button>
          <button className="nav-icon-btn"><FiBell /><span className="nav-badge"></span></button>
          <Link to="/settings" className="nav-icon-btn" style={{display:'flex',alignItems:'center',justifyContent:'center',color:'#64748b',width:'34px',height:'34px',borderRadius:'8px'}}><FiSettings /></Link>
          <button className="nav-icon-btn" onClick={handleLogout}><FiLogOut /></button>
          <div className="nav-avatar">{initials}</div>
        </div>
      </div>

      <div className="body-area">
        <nav className="sidebar">
          <button className="sidebar-btn active"><FiInbox /><span className="sb-badge">12</span></button>
          <button className="sidebar-btn"><FiStar /></button>
          <button className="sidebar-btn"><FiSend /></button>
          <button className="sidebar-btn"><FiFileText /><span className="sb-badge">2</span></button>
          <button className="sidebar-btn"><FiArchive /></button>
          <button className="sidebar-btn"><FiTrash2 /></button>
          <div className="sidebar-divider"></div>
          <button className="sidebar-btn"><FiUsers /></button>
          <button className="sidebar-btn"><FiTag /></button>
        </nav>

        <div className="conv-list">
          <div className="conv-list-top">
            <div className="conv-search">
              <FiSearch className="search-icon" />
              <input placeholder="Search chats…" />
            </div>
          </div>
          <div className="conv-filters">
            {['All', 'Unread', 'Groups', 'Important'].map(f => (
              <div key={f} className={`conv-filter ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</div>
            ))}
          </div>
          <div className="conv-items">
            {conversations.map(conv => (
              <div key={conv.id} className={`conv-item ${activeConv.id === conv.id ? 'active' : ''}`} onClick={() => setActiveConv(conv)}>
                <div className="conv-avatar" style={{ background: conv.color, color: conv.textColor }}>
                  {conv.initials}
                  {conv.online && <div className="online-dot"></div>}
                </div>
                <div className="conv-meta">
                  <div className="conv-top">
                    <span className="conv-name">{conv.name}</span>
                    <span className="conv-time">{conv.time}</span>
                  </div>
                  <div className="conv-preview">
                    {conv.preview}
                    {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-window">
          <div className="chat-header">
            <div className="conv-avatar" style={{ background: activeConv.color, color: activeConv.textColor, width: 36, height: 36, fontSize: 12 }}>
              {activeConv.initials}
              {activeConv.online && <div className="online-dot"></div>}
            </div>
            <div className="chat-header-info">
              <div className="chat-header-name">{activeConv.name}</div>
              <div className="chat-header-status">
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}></div>
                {activeConv.online ? 'Online' : 'Offline'}
              </div>
            </div>
            <div className="chat-header-actions">
              <button className="chat-action-btn"><FiPhone /></button>
              <button className="chat-action-btn"><FiVideo /></button>
              <button className="chat-action-btn"><FiSearch /></button>
              <button className="chat-action-btn"><FiMoreVertical /></button>
            </div>
          </div>

          <div className="mood-bar" style={{ borderColor: getMoodBar().dot }}>
            <div className="mood-dot" style={{ background: getMoodBar().dot }}></div>
            <span>{getMoodBar().label}</span>
          </div>

          <div className="messages-area">
            {messages.map((msg, i) => {
              const isMine = msg.sender_id === user.id;
              const moodStyle = msg.mood && !isMine ? { background: msg.mood.bubble, color: msg.mood.text, border: `1px solid ${msg.mood.dot}44` } : {};
              const reactions = msgReactions[msg.id] || {};
              const suggested = suggestReaction(msg.content);
              return (
                <React.Fragment key={msg.id || i}>
                  {msg.chapter && (
                    <div className="chapter-sep"><span>📖 {msg.chapter}</span></div>
                  )}
                  <div className={`msg-row ${isMine ? 'mine' : ''}`} onMouseEnter={() => setShowReactions(msg.id)} onMouseLeave={() => setShowReactions(null)}>
                    <div className="msg-avatar" style={{ background: isMine ? '#2563EB' : activeConv.color, color: isMine ? '#fff' : activeConv.textColor }}>
                      {isMine ? initials.slice(0, 2) : activeConv.initials}
                    </div>
                    <div style={{ maxWidth: '70%' }}>
                      <div className={`bubble ${isMine ? 'mine' : 'theirs'}`} style={!isMine ? moodStyle : {}}>
                        {msg.content}
                      </div>
                      <div className="msg-meta">{msg.created_at}</div>
                      {Object.entries(reactions).some(([, v]) => v > 0) && (
                        <div className="reactions">
                          {Object.entries(reactions).filter(([, v]) => v > 0).map(([emoji]) => (
                            <button key={emoji} className="reaction-btn active" onClick={() => toggleReaction(msg.id, emoji)}>{emoji}</button>
                          ))}
                        </div>
                      )}
                      {showReactions === msg.id && (
                        <div className="reactions">
                          {REACTIONS.map(emoji => (
                            <button key={emoji} className={`reaction-btn ${reactions[emoji] ? 'active' : ''}`} onClick={() => toggleReaction(msg.id, emoji)}>{emoji}</button>
                          ))}
                          <button className="reaction-btn" style={{ background: '#eff6ff', color: '#2563EB' }}>💡 {suggested}</button>
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            {isTyping && (
              <div className="msg-row">
                <div className="msg-avatar" style={{ background: activeConv.color, color: activeConv.textColor }}>{activeConv.initials}</div>
                <div>
                  <div className="typing-bubble">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                  <div className="msg-meta">{typingUser} is typing...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {coachFeedback && (
            <div className={`ai-coach ${coachFeedback.type}`}>
              <span>🤖 AI Coach:</span>
              <span>{coachFeedback.message}</span>
            </div>
          )}

          <div className="input-area">
            <div className="input-toolbar">
              <button className="tool-btn"><FiSmile /></button>
              <button className="tool-btn"><FiPaperclip /></button>
              <button className="tool-btn"><FiMic /></button>
              <button className="tool-btn"><FiCalendar /></button>
              <button className="tool-btn"><FiZap /></button>
            </div>
            <div className="input-row">
              <input className="msg-input" type="text" placeholder="Type a message…" value={input} onChange={handleTyping} onKeyDown={handleKey} />
              <button className="send-btn" onClick={sendMessage}>➤</button>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="rp-header">
            <div className="rp-avatar" style={{ background: activeConv.color, color: activeConv.textColor }}>{activeConv.initials}</div>
            <div className="rp-name">{activeConv.name}</div>
            <div className="rp-email">Online</div>
          </div>
          <div className="rp-section">
            <div className="rp-section-title">Your story together</div>
            <div className="timeline">
              {timeline.map((item, i) => (
                <div key={i} className="tl-item">
                  <div className="tl-dot" style={{ background: item.color, color: item.textColor }}>●</div>
                  <div>
                    <div className="tl-label">{item.label}</div>
                    <div className="tl-date">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rp-section">
            <div className="rp-section-title">Shared media</div>
            <div className="media-grid">
              {['#dbeafe','#dcfce7','#fef3c7','#fce7f3','#ede9fe','#fee2e2'].map((c, i) => (
                <div key={i} className="media-thumb" style={{ background: c }}></div>
              ))}
            </div>
          </div>
          <div className="rp-section">
            <div className="rp-section-title">Actions</div>
            <div className="rp-action"><FiMapPin /> Pinned messages</div>
            <div className="rp-action"><FiBellOff /> Mute</div>
            <div className="rp-action"><FiArchive /> Archive</div>
            <div className="rp-action"><FiDownload /> Export chat</div>
            <div className="rp-action danger"><FiSlash /> Block</div>
            <div className="rp-action danger"><FiTrash2 /> Delete chat</div>
          </div>
        </div>
      </div>

      <div className="mobile-nav">
        <div className="mobile-nav-inner">
          <div className={`mobile-nav-item ${mobileTab==='chats'?'active':''}`} onClick={()=>setMobileTab('chats')}><FiMessageCircle size={22}/><span>Chats</span><span className="mob-badge"></span></div>
          <div className={`mobile-nav-item ${mobileTab==='groups'?'active':''}`} onClick={()=>setMobileTab('groups')}><FiUsers size={22}/><span>Groups</span></div>
          <div className={`mobile-nav-item ${mobileTab==='search'?'active':''}`} onClick={()=>setMobileTab('search')}><FiSearch size={22}/><span>Search</span></div>
          <div className={`mobile-nav-item ${mobileTab==='alerts'?'active':''}`} onClick={()=>setMobileTab('alerts')}><FiBell size={22}/><span>Alerts</span></div>
          <div className={`mobile-nav-item ${mobileTab==='profile'?'active':''}`} onClick={()=>setMobileTab('profile')}><div className="nav-avatar" style={{width:24,height:24,fontSize:10}}>{initials}</div><span>Profile</span></div>
        </div>
      </div>
    </div>
  );
}
