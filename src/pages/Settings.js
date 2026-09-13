import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiUser, FiBell, FiMonitor, FiGlobe,
  FiTrash2, FiShield, FiSmartphone, FiDatabase, FiKey,
  FiHelpCircle, FiInfo, FiZap, FiHeart, FiEye,
  FiCamera, FiWifi, FiClock, FiStar, FiSliders
} from 'react-icons/fi';

const tabs = [
  { id: 'general', label: 'General', icon: <FiUser />, desc: 'Profile & account' },
  { id: 'appearance', label: 'Appearance', icon: <FiMonitor />, desc: 'Theme & display' },
  { id: 'notifications', label: 'Notifications', icon: <FiBell />, desc: 'Alerts & sounds' },
  { id: 'privacy', label: 'Privacy', icon: <FiEye />, desc: 'Visibility settings' },
  { id: 'security', label: 'Security', icon: <FiShield />, desc: 'Password & 2FA' },
  { id: 'devices', label: 'Devices', icon: <FiSmartphone />, desc: 'Active sessions' },
  { id: 'storage', label: 'Storage', icon: <FiDatabase />, desc: 'Files & cache' },
  { id: 'accessibility', label: 'Accessibility', icon: <FiHeart />, desc: 'Display & motion' },
  { id: 'shortcuts', label: 'Shortcuts', icon: <FiKey />, desc: 'Keyboard shortcuts' },
  { id: 'language', label: 'Language', icon: <FiGlobe />, desc: 'Language & region' },
  { id: 'ai', label: 'AI Features', icon: <FiZap />, desc: 'Coach & mood AI' },
  { id: 'chat', label: 'Chat', icon: <FiSliders />, desc: 'Message settings' },
  { id: 'media', label: 'Media', icon: <FiCamera />, desc: 'Photos & videos' },
  { id: 'network', label: 'Network', icon: <FiWifi />, desc: 'Data & bandwidth' },
  { id: 'schedule', label: 'Schedule', icon: <FiClock />, desc: 'Focus & snooze' },
  { id: 'premium', label: 'Premium', icon: <FiStar />, desc: 'Upgrade Zara' },
  { id: 'help', label: 'Help & Support', icon: <FiHelpCircle />, desc: 'FAQ & contact' },
  { id: 'about', label: 'About Zara', icon: <FiInfo />, desc: 'Version & credits' },
];

function Toggle({ value, onChange }) {
  return (
    <div style={{ ...s.toggle, background: value ? '#2563EB' : '#e2e8f0' }} onClick={() => onChange(!value)}>
      <div style={{ ...s.toggleDot, transform: value ? 'translateX(20px)' : 'translateX(2px)' }}></div>
    </div>
  );
}

function SettingRow({ label, desc, value, onChange }) {
  return (
    <div>
      <div style={s.settingRow}>
        <div>
          <div style={s.settingLabel}>{label}</div>
          {desc && <div style={s.settingDesc}>{desc}</div>}
        </div>
        <Toggle value={value} onChange={onChange} />
      </div>
      <div style={s.divider}></div>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [activeTab, setActiveTab] = useState('general');
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  const [settings, setSettings] = useState({
    darkMode: false, compactMode: false, fontSize: 'Medium', bubbleColor: '#2563EB',
    showAvatars: true, animatedEmoji: true, messagePreview: true,
    msgNotif: true, groupNotif: true, mentionNotif: true, sounds: true,
    desktop: true, email: false, smsBackup: false, doNotDisturb: false,
    readReceipts: true, onlineStatus: true, lastSeen: true, typing: true,
    profilePhoto: true, ghostMode: false, hiddenChats: false,
    twoFactor: false, loginAlerts: true, sessionTimeout: false, encryptBackup: true,
    reduceMotion: false, highContrast: false, largeText: false, screenReader: false,
    aiCoach: true, moodDetection: true, smartReply: true, autoChapter: true,
    aiReactions: true, sentimentBar: true, aiCompose: false,
    enterToSend: true, autoScroll: true, linkPreview: true, emojiSuggestions: true,
    spellCheck: true, messageThreading: true, undoSend: true, scheduledMsg: true,
    autoDownload: true, autoPlay: false, saveToGallery: false, compressionOff: false,
    dataSaver: false, backgroundSync: true, wifiOnly: false,
    focusMode: false, autoReply: false, digestMode: false,
  });

  const set = (key) => (val) => setSettings(s => ({ ...s, [key]: val }));

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate('/app')}>
          <FiArrowLeft size={18} />
        </button>
        <div style={s.headerTitle}>⚙️ Settings</div>
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#94a3b8' }}>Zara v1.0.0</div>
      </div>

      <div style={s.body}>
        <div style={s.sidebar}>
          <div style={s.profileCard}>
            <div style={s.profileAvatar}>{initials}</div>
            <div style={s.profileName}>{user.name || 'User'}</div>
            <div style={s.profileEmail}>{user.email || ''}</div>
            <div style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', borderRadius: '20px', padding: '2px 10px', marginTop: '6px', display: 'inline-block' }}>● Online</div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {tabs.map(tab => (
              <div key={tab.id} style={{ ...s.tab, ...(activeTab === tab.id ? s.tabActive : {}) }} onClick={() => setActiveTab(tab.id)}>
                <span style={s.tabIcon}>{tab.icon}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>{tab.label}</div>
                  <div style={{ fontSize: '10px', color: activeTab === tab.id ? '#93c5fd' : '#94a3b8' }}>{tab.desc}</div>
                </div>
              </div>
            ))}
            <div style={{ ...s.tab, color: '#dc2626', marginTop: '8px' }} onClick={() => { localStorage.clear(); navigate('/'); }}>
              <span style={s.tabIcon}><FiTrash2 /></span>
              <div><div style={{ fontSize: '13px', fontWeight: '500' }}>Logout</div></div>
            </div>
          </div>
        </div>

        <div style={s.content}>
          {activeTab === 'general' && (
            <div>
              <div style={s.sectionTitle}>👤 Profile Information</div>
              <div style={s.card}>
                <div style={s.avatarBig}>{initials}</div>
                <button style={s.btnSecondary}>Change photo</button>
                <div style={{ height: 16 }} />
                {[['Full Name', user.name, 'text'], ['Username', user.username, 'text'], ['Email', user.email, 'email'], ['Phone', '', 'tel']].map(([label, val, type]) => (
                  <div key={label} style={s.field}>
                    <label style={s.label}>{label}</label>
                    <input style={s.input} type={type} defaultValue={val} placeholder={`Enter ${label.toLowerCase()}`} />
                  </div>
                ))}
                <div style={s.field}>
                  <label style={s.label}>Bio</label>
                  <textarea style={{ ...s.input, height: '80px', resize: 'vertical', paddingTop: '8px' }} placeholder="Tell people about yourself…" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Status message</label>
                  <input style={s.input} placeholder="e.g. Available, In a meeting…" />
                </div>
                <button style={s.btnPrimary}>Save changes</button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <div style={s.sectionTitle}>🎨 Appearance</div>
              <div style={s.card}>
                <SettingRow label="Dark Mode" desc="Switch to dark theme" value={settings.darkMode} onChange={set('darkMode')} />
                <SettingRow label="Compact Mode" desc="Show more messages on screen" value={settings.compactMode} onChange={set('compactMode')} />
                <SettingRow label="Show avatars" desc="Display profile photos in chat" value={settings.showAvatars} onChange={set('showAvatars')} />
                <SettingRow label="Animated emoji" desc="Enable emoji animations" value={settings.animatedEmoji} onChange={set('animatedEmoji')} />
                <SettingRow label="Message preview" desc="Show message preview in notifications" value={settings.messagePreview} onChange={set('messagePreview')} />
                <div style={s.field}>
                  <label style={s.label}>Font size</label>
                  <select style={s.input} value={settings.fontSize} onChange={e => set('fontSize')(e.target.value)}>
                    {['Small', 'Medium', 'Large', 'Extra Large'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Bubble color</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    {['#2563EB', '#7c3aed', '#db2777', '#059669', '#d97706', '#dc2626', '#0891b2', '#0f172a'].map(c => (
                      <div key={c} onClick={() => set('bubbleColor')(c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: settings.bubbleColor === c ? '3px solid #0f172a' : '2px solid transparent' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <div style={s.sectionTitle}>🔔 Notifications</div>
              <div style={s.card}>
                <SettingRow label="New messages" desc="Get notified for every new message" value={settings.msgNotif} onChange={set('msgNotif')} />
                <SettingRow label="Group messages" desc="Notifications from group chats" value={settings.groupNotif} onChange={set('groupNotif')} />
                <SettingRow label="Mentions" desc="When someone @mentions you" value={settings.mentionNotif} onChange={set('mentionNotif')} />
                <SettingRow label="Sounds" desc="Play notification sounds" value={settings.sounds} onChange={set('sounds')} />
                <SettingRow label="Desktop notifications" desc="Show system notifications" value={settings.desktop} onChange={set('desktop')} />
                <SettingRow label="Email notifications" desc="Get daily digest via email" value={settings.email} onChange={set('email')} />
                <SettingRow label="SMS backup" desc="Send critical alerts via SMS" value={settings.smsBackup} onChange={set('smsBackup')} />
                <SettingRow label="Do Not Disturb" desc="Mute all notifications temporarily" value={settings.doNotDisturb} onChange={set('doNotDisturb')} />
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <div style={s.sectionTitle}>👁️ Privacy</div>
              <div style={s.card}>
                <SettingRow label="Read receipts" desc="Show when you've read messages" value={settings.readReceipts} onChange={set('readReceipts')} />
                <SettingRow label="Online status" desc="Show when you're online" value={settings.onlineStatus} onChange={set('onlineStatus')} />
                <SettingRow label="Last seen" desc="Show when you were last active" value={settings.lastSeen} onChange={set('lastSeen')} />
                <SettingRow label="Typing indicator" desc="Show when you're typing" value={settings.typing} onChange={set('typing')} />
                <SettingRow label="Profile photo visibility" desc="Let others see your photo" value={settings.profilePhoto} onChange={set('profilePhoto')} />
                <SettingRow label="Ghost mode 👻" desc="Read messages without triggering receipts" value={settings.ghostMode} onChange={set('ghostMode')} />
                <SettingRow label="Hidden chats" desc="Lock specific chats with PIN" value={settings.hiddenChats} onChange={set('hiddenChats')} />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <div style={s.sectionTitle}>🛡️ Security</div>
              <div style={s.card}>
                <SettingRow label="Two-factor authentication" desc="Add extra layer of security" value={settings.twoFactor} onChange={set('twoFactor')} />
                <SettingRow label="Login alerts" desc="Get notified of new logins" value={settings.loginAlerts} onChange={set('loginAlerts')} />
                <SettingRow label="Session timeout" desc="Auto logout after inactivity" value={settings.sessionTimeout} onChange={set('sessionTimeout')} />
                <SettingRow label="Encrypted backup" desc="Encrypt your chat backups" value={settings.encryptBackup} onChange={set('encryptBackup')} />
                <div style={{ marginTop: '8px' }}>
                  <div style={s.settingLabel}>Change Password</div>
                  <div style={{ height: 8 }} />
                  {['Current password', 'New password', 'Confirm new password'].map(p => (
                    <div key={p} style={s.field}>
                      <input style={s.input} type="password" placeholder={p} />
                    </div>
                  ))}
                  <button style={s.btnPrimary}>Update password</button>
                </div>
                <div style={{ ...s.divider, margin: '16px 0' }} />
                <button style={{ ...s.btnPrimary, background: '#dc2626' }}>Logout from all devices</button>
              </div>
            </div>
          )}

          {activeTab === 'devices' && (
            <div>
              <div style={s.sectionTitle}>📱 Active Devices</div>
              <div style={s.card}>
                {[
                  { name: 'Windows PC — Chrome', location: 'Kigali, Rwanda', time: 'Active now', current: true },
                  { name: 'Android Phone', location: 'Kigali, Rwanda', time: '2 hours ago', current: false },
                  { name: 'iPad Safari', location: 'Kigali, Rwanda', time: 'Yesterday', current: false },
                ].map((device, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {device.name}
                        {device.current && <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', borderRadius: '20px', padding: '1px 8px' }}>This device</span>}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{device.location} · {device.time}</div>
                    </div>
                    {!device.current && <button style={{ ...s.btnSecondary, color: '#dc2626', borderColor: '#fca5a5' }}>Logout</button>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div>
              <div style={s.sectionTitle}>💾 Storage</div>
              <div style={s.card}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={s.settingLabel}>Used storage</span>
                    <span style={{ fontSize: '13px', color: '#2563EB', fontWeight: '500' }}>1.2 GB / 5 GB</span>
                  </div>
                  <div style={{ background: '#e2e8f0', borderRadius: '20px', height: '8px' }}>
                    <div style={{ background: '#2563EB', borderRadius: '20px', height: '8px', width: '24%' }}></div>
                  </div>
                </div>
                {[['Photos & Videos', '820 MB'], ['Documents', '210 MB'], ['Audio', '95 MB'], ['Other files', '75 MB'], ['Cache', '45 MB']].map(([label, size]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={s.settingLabel}>{label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{size}</span>
                      <button style={{ ...s.btnSecondary, fontSize: '11px', padding: '3px 8px' }}>Clear</button>
                    </div>
                  </div>
                ))}
                <button style={{ ...s.btnPrimary, background: '#dc2626', marginTop: '12px' }}>Clear all cache</button>
              </div>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div>
              <div style={s.sectionTitle}>♿ Accessibility</div>
              <div style={s.card}>
                <SettingRow label="Reduce motion" desc="Disable animations and transitions" value={settings.reduceMotion} onChange={set('reduceMotion')} />
                <SettingRow label="High contrast" desc="Increase text and element contrast" value={settings.highContrast} onChange={set('highContrast')} />
                <SettingRow label="Large text" desc="Increase font size across the app" value={settings.largeText} onChange={set('largeText')} />
                <SettingRow label="Screen reader support" desc="Optimized for screen readers" value={settings.screenReader} onChange={set('screenReader')} />
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div>
              <div style={s.sectionTitle}>⌨️ Keyboard Shortcuts</div>
              <div style={s.card}>
                {[
                  ['Send message', 'Enter'],
                  ['New line', 'Shift + Enter'],
                  ['Search', 'Ctrl + K'],
                  ['New message', 'Ctrl + N'],
                  ['Archive chat', 'Ctrl + A'],
                  ['Mute chat', 'Ctrl + M'],
                  ['Close chat', 'Escape'],
                  ['Bold text', 'Ctrl + B'],
                  ['Italic text', 'Ctrl + I'],
                  ['Emoji picker', 'Ctrl + E'],
                  ['Toggle dark mode', 'Ctrl + D'],
                  ['Mark as unread', 'Ctrl + U'],
                ].map(([action, shortcut]) => (
                  <div key={action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={s.settingLabel}>{action}</span>
                    <kbd style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontFamily: 'monospace', color: '#0f172a' }}>{shortcut}</kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div>
              <div style={s.sectionTitle}>🌍 Language & Region</div>
              <div style={s.card}>
                <div style={s.field}>
                  <label style={s.label}>App Language</label>
                  <select style={s.input}>
                    {['English', 'French', 'Arabic', 'Spanish', 'Kinyarwanda', 'Swahili', 'Portuguese', 'German', 'Chinese', 'Japanese'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Time format</label>
                  <select style={s.input}>
                    <option>12 hour (1:30 PM)</option>
                    <option>24 hour (13:30)</option>
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Date format</label>
                  <select style={s.input}>
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Timezone</label>
                  <select style={s.input}>
                    <option>Africa/Kigali (GMT+2)</option>
                    <option>UTC (GMT+0)</option>
                    <option>America/New_York (GMT-5)</option>
                    <option>Europe/London (GMT+0)</option>
                    <option>Asia/Dubai (GMT+4)</option>
                  </select>
                </div>
                <button style={s.btnPrimary}>Save preferences</button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              <div style={s.sectionTitle}>🤖 AI Features</div>
              <div style={s.card}>
                <SettingRow label="AI Conversation Coach" desc="Get tone feedback before sending" value={settings.aiCoach} onChange={set('aiCoach')} />
                <SettingRow label="Mood detection" desc="Detect tone and color bubbles accordingly" value={settings.moodDetection} onChange={set('moodDetection')} />
                <SettingRow label="Smart replies" desc="AI suggests quick replies" value={settings.smartReply} onChange={set('smartReply')} />
                <SettingRow label="Auto chapters" desc="Automatically group messages into chapters" value={settings.autoChapter} onChange={set('autoChapter')} />
                <SettingRow label="AI reaction suggestions" desc="Suggest best emoji reaction" value={settings.aiReactions} onChange={set('aiReactions')} />
                <SettingRow label="Sentiment bar" desc="Show mood bar in chat header" value={settings.sentimentBar} onChange={set('sentimentBar')} />
                <SettingRow label="AI compose (beta)" desc="Let AI help write your messages" value={settings.aiCompose} onChange={set('aiCompose')} />
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div>
              <div style={s.sectionTitle}>💬 Chat Settings</div>
              <div style={s.card}>
                <SettingRow label="Enter to send" desc="Press Enter to send messages" value={settings.enterToSend} onChange={set('enterToSend')} />
                <SettingRow label="Auto scroll" desc="Scroll to latest message automatically" value={settings.autoScroll} onChange={set('autoScroll')} />
                <SettingRow label="Link previews" desc="Show previews for URLs" value={settings.linkPreview} onChange={set('linkPreview')} />
                <SettingRow label="Emoji suggestions" desc="Suggest emojis as you type" value={settings.emojiSuggestions} onChange={set('emojiSuggestions')} />
                <SettingRow label="Spell check" desc="Highlight spelling errors" value={settings.spellCheck} onChange={set('spellCheck')} />
                <SettingRow label="Message threading" desc="Reply in threads like Slack" value={settings.messageThreading} onChange={set('messageThreading')} />
                <SettingRow label="Undo send" desc="Allow unsending messages within 5s" value={settings.undoSend} onChange={set('undoSend')} />
                <SettingRow label="Schedule messages" desc="Send messages at a later time" value={settings.scheduledMsg} onChange={set('scheduledMsg')} />
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div>
              <div style={s.sectionTitle}>📷 Media Settings</div>
              <div style={s.card}>
                <SettingRow label="Auto download media" desc="Automatically download photos and videos" value={settings.autoDownload} onChange={set('autoDownload')} />
                <SettingRow label="Auto play videos" desc="Play videos automatically in chat" value={settings.autoPlay} onChange={set('autoPlay')} />
                <SettingRow label="Save to gallery" desc="Automatically save received media" value={settings.saveToGallery} onChange={set('saveToGallery')} />
                <SettingRow label="Send original quality" desc="Send photos without compression" value={settings.compressionOff} onChange={set('compressionOff')} />
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div>
              <div style={s.sectionTitle}>📶 Network & Data</div>
              <div style={s.card}>
                <SettingRow label="Data saver" desc="Reduce data usage on mobile" value={settings.dataSaver} onChange={set('dataSaver')} />
                <SettingRow label="Background sync" desc="Sync messages in the background" value={settings.backgroundSync} onChange={set('backgroundSync')} />
                <SettingRow label="Wi-Fi only downloads" desc="Only download media on Wi-Fi" value={settings.wifiOnly} onChange={set('wifiOnly')} />
                <div style={{ marginTop: '8px' }}>
                  <div style={s.settingLabel}>Connection status</div>
                  <div style={{ fontSize: '12px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }}></div>
                    Connected — 45ms latency
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              <div style={s.sectionTitle}>⏰ Schedule & Focus</div>
              <div style={s.card}>
                <SettingRow label="Focus mode" desc="Block notifications during focus hours" value={settings.focusMode} onChange={set('focusMode')} />
                <SettingRow label="Auto reply" desc="Send auto reply when in focus mode" value={settings.autoReply} onChange={set('autoReply')} />
                <SettingRow label="Digest mode" desc="Group notifications into hourly digest" value={settings.digestMode} onChange={set('digestMode')} />
                <div style={s.field}>
                  <label style={s.label}>Focus hours start</label>
                  <input style={s.input} type="time" defaultValue="09:00" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Focus hours end</label>
                  <input style={s.input} type="time" defaultValue="17:00" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Auto reply message</label>
                  <textarea style={{ ...s.input, height: '70px', paddingTop: '8px', resize: 'vertical' }} placeholder="e.g. I'm currently in focus mode. I'll reply soon!" />
                </div>
                <button style={s.btnPrimary}>Save schedule</button>
              </div>
            </div>
          )}

          {activeTab === 'premium' && (
            <div>
              <div style={s.sectionTitle}>⭐ Zara Premium</div>
              <div style={{ ...s.card, background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', color: '#fff', textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>👑</div>
                <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Upgrade to Premium</div>
                <div style={{ fontSize: '13px', opacity: 0.85, marginBottom: '20px' }}>Unlock everything Zara has to offer</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', marginBottom: '20px' }}>
                  {['✅ Unlimited file storage', '✅ Custom themes & fonts', '✅ Priority AI coach', '✅ Advanced analytics', '✅ Custom domain', '✅ Admin dashboard', '✅ Priority support'].map(f => (
                    <div key={f} style={{ fontSize: '13px' }}>{f}</div>
                  ))}
                </div>
                <button style={{ background: '#fff', color: '#1d4ed8', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Upgrade — $4.99/month
                </button>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div>
              <div style={s.sectionTitle}>❓ Help & Support</div>
              <div style={s.card}>
                {[['📖 Documentation', 'Read the full Zara guide'], ['💬 Live chat support', 'Chat with our team'], ['🐛 Report a bug', 'Help us improve Zara'], ['💡 Feature request', 'Suggest a new feature'], ['📧 Email support', 'support@zara.app']].map(([title, desc]) => (
                  <div key={title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
                    <div>
                      <div style={s.settingLabel}>{title}</div>
                      <div style={s.settingDesc}>{desc}</div>
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '18px' }}>›</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div>
              <div style={s.sectionTitle}>ℹ️ About Zara</div>
              <div style={{ ...s.card, textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>💬</div>
                <div style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Zara</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Version 1.0.0 — Built with ❤️ by Jules</div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {['React', 'Node.js', 'Socket.io', 'PostgreSQL'].map(t => (
                    <span key={t} style={{ background: '#eff6ff', color: '#2563EB', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: '500' }}>{t}</span>
                  ))}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>© 2026 Zara Messaging. All rights reserved.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  wrap: { minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', fontFamily: 'Segoe UI, sans-serif' },
  header: { height: '52px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '12px', flexShrink: 0 },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '6px', borderRadius: '8px' },
  headerTitle: { fontSize: '16px', fontWeight: '600', color: '#0f172a' },
  body: { display: 'flex', flex: 1, overflow: 'hidden', maxWidth: '960px', margin: '24px auto', gap: '20px', padding: '0 16px', width: '100%' },
  sidebar: { width: '230px', display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0, maxHeight: 'calc(100vh - 100px)', overflow: 'hidden' },
  profileCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center', marginBottom: '8px', flexShrink: 0 },
  profileAvatar: { width: '52px', height: '52px', borderRadius: '50%', background: '#2563EB', color: '#fff', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' },
  profileName: { fontSize: '14px', fontWeight: '600', color: '#0f172a' },
  profileEmail: { fontSize: '11px', color: '#94a3b8' },
  tab: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', color: '#64748b' },
  tabActive: { background: '#eff6ff', color: '#2563EB' },
  tabIcon: { fontSize: '16px', display: 'flex', flexShrink: 0 },
  content: { flex: 1, overflow: 'auto', maxHeight: 'calc(100vh - 100px)' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '16px' },
  avatarBig: { width: '72px', height: '72px', borderRadius: '50%', background: '#2563EB', color: '#fff', fontSize: '24px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  field: { marginBottom: '12px' },
  label: { fontSize: '12px', color: '#64748b', fontWeight: '500', display: 'block', marginBottom: '6px' },
  input: { width: '100%', height: '38px', padding: '0 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#f8fafc', color: '#0f172a', boxSizing: 'border-box' },
  btnPrimary: { background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  btnSecondary: { background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', display: 'block', margin: '0 auto' },
  settingRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' },
  settingLabel: { fontSize: '13px', fontWeight: '500', color: '#0f172a' },
  settingDesc: { fontSize: '11px', color: '#94a3b8', marginTop: '2px' },
  toggle: { width: '44px', height: '24px', borderRadius: '20px', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 },
  toggleDot: { width: '20px', height: '20px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' },
  divider: { height: '1px', background: '#f1f5f9', margin: '10px 0' },
};