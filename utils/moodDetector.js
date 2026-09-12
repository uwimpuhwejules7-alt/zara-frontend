// Detects mood from message text and returns color + label
export function detectMood(text) {
  const lower = text.toLowerCase();

  const moods = {
    happy: {
      keywords: ['happy', 'great', 'awesome', 'amazing', 'love', 'excellent', 'wonderful', 'fantastic', 'yay', '', '', '', 'thanks', 'thank you', 'appreciate', 'glad', 'excited'],
      bubble: '#dcfce7',
      text: '#166534',
      label: 'Happy & positive',
      dot: '#22c55e'
    },
    urgent: {
      keywords: ['urgent', 'asap', 'immediately', 'emergency', 'critical', 'important', 'deadline', 'hurry', 'now', 'quick'],
      bubble: '#fee2e2',
      text: '#991b1b',
      label: 'Urgent tone',
      dot: '#dc2626'
    },
    question: {
      keywords: ['?', 'how', 'what', 'when', 'where', 'why', 'who', 'could you', 'can you', 'would you', 'help'],
      bubble: '#eff6ff',
      text: '#1d4ed8',
      label: 'Curious & questioning',
      dot: '#3b82f6'
    },
    professional: {
      keywords: ['meeting', 'report', 'project', 'deadline', 'schedule', 'update', 'review', 'discuss', 'agenda', 'proposal'],
      bubble: '#f8fafc',
      text: '#0f172a',
      label: 'Professional tone',
      dot: '#64748b'
    },
    friendly: {
      keywords: ['hey', 'hi', 'hello', 'haha', 'lol', 'bro', 'buddy', 'friend', '', '', '', 'cool', 'nice', 'wow'],
      bubble: '#fef3c7',
      text: '#92400e',
      label: 'Friendly & casual',
      dot: '#f59e0b'
    }
  };

  for (const [mood, data] of Object.entries(moods)) {
    if (data.keywords.some(k => lower.includes(k))) {
      return { mood, ...data };
    }
  }

  return {
    mood: 'neutral',
    bubble: '#f1f5f9',
    text: '#0f172a',
    label: 'Neutral tone',
    dot: '#94a3b8'
  };
}

// AI coach feedback on message tone
export function getCoachFeedback(text) {
  const lower = text.toLowerCase();

  if (text.length < 3) return null;

  if (lower.includes('?') && text.length < 20) {
    return { type: 'tip', message: ' Short question  consider adding more context.' };
  }
  if (lower.match(/\b(stupid|idiot|hate|terrible|worst)\b/)) {
    return { type: 'warn', message: ' This might come across as harsh  consider softening it.' };
  }
  if (text.toUpperCase() === text && text.length > 5) {
    return { type: 'warn', message: ' ALL CAPS can feel aggressive  is that intended?' };
  }
  if (text.length > 200) {
    return { type: 'tip', message: ' Long message  consider breaking it into smaller parts.' };
  }
  if (lower.includes('sorry') || lower.includes('apologize')) {
    return { type: 'good', message: ' Thoughtful and considerate tone.' };
  }
  if (lower.includes('thank') || lower.includes('appreciate')) {
    return { type: 'good', message: ' Warm and appreciative  great message!' };
  }
  if (text.length > 10) {
    return { type: 'good', message: ' Clear and direct  good to send.' };
  }

  return null;
}

// Suggest emoji reaction based on message
export function suggestReaction(text) {
  const lower = text.toLowerCase();
  if (lower.includes('thank') || lower.includes('appreciate')) return '';
  if (lower.includes('great') || lower.includes('awesome') || lower.includes('amazing')) return '';
  if (lower.includes('haha') || lower.includes('lol') || lower.includes('funny')) return '';
  if (lower.includes('love') || lower.includes('heart')) return '';
  if (lower.includes('agree') || lower.includes('yes') || lower.includes('correct')) return '';
  if (lower.includes('congrat') || lower.includes('well done')) return '';
  if (lower.includes('?')) return '';
  return '';
}
