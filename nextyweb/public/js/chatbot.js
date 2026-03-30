/* ============================================
   NextyWeb - AI FAQ Chatbot
   ============================================ */

// FAQ Knowledge Base
const faqData = [
  {
    keywords: ['pricing', 'cost', 'how much', 'price', 'plan', 'package'],
    response: "Our plans start from $199. Visit our Pricing page for full details!"
  },
  {
    keywords: ['contact', 'reach', 'email', 'phone', 'call', 'message'],
    response: "You can reach us via the Contact page or WhatsApp. We reply within 24 hours!"
  },
  {
    keywords: ['services', 'what do you do', 'offer', 'provide', 'build', 'create'],
    response: "We build business websites, e-commerce stores, landing pages, and more!"
  },
  {
    keywords: ['time', 'how long', 'deadline', 'delivery', 'when', 'finish'],
    response: "Typical delivery is 5–14 business days depending on complexity."
  },
  {
    keywords: ['portfolio', 'examples', 'work', 'projects', 'showcase', 'previous'],
    response: "Check out our Portfolio page to see our latest projects!"
  },
  {
    keywords: ['refund', 'guarantee', 'money back', 'satisfaction'],
    response: "We offer a satisfaction guarantee. Contact us if you're not happy!"
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
    response: "Hello! 👋 Welcome to NextyWeb. How can I help you today?"
  },
  {
    keywords: ['thank', 'thanks', 'appreciate'],
    response: "You're welcome! Is there anything else I can help you with?"
  },
  {
    keywords: ['bye', 'goodbye', 'see you'],
    response: "Goodbye! Feel free to come back if you have more questions. Have a great day! 😊"
  }
];

const defaultResponse = "Great question! Please reach out via our Contact page and we'll help you personally.";

// Quick reply suggestions
const quickReplies = [
  "What are your prices?",
  "What services do you offer?",
  "How long does it take?",
  "Can I see your portfolio?"
];

// Initialize chatbot
document.addEventListener('DOMContentLoaded', function() {
  initChatbot();
});

function initChatbot() {
  // Create chatbot HTML
  const chatbotHTML = `
    <div class="chatbot-toggle" id="chatbot-toggle">
      <svg viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    </div>
    <div class="chatbot-panel" id="chatbot-panel">
      <div class="chatbot-header">
        <h4>NextyWeb Assistant</h4>
        <button class="chatbot-close" id="chatbot-close">&times;</button>
      </div>
      <div class="chatbot-messages" id="chatbot-messages">
        <div class="chat-message bot">
          <div class="chat-bubble">
            Hi there! 👋 I'm the NextyWeb assistant. How can I help you today?
          </div>
        </div>
      </div>
      <div class="quick-replies" id="quick-replies">
        ${quickReplies.map(reply => `<button class="quick-reply-btn">${reply}</button>`).join('')}
      </div>
      <div class="chatbot-input">
        <input type="text" id="chatbot-input" placeholder="Type your question...">
        <button id="chatbot-send">
          <svg viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  // Add chatbot to page
  const chatbotContainer = document.createElement('div');
  chatbotContainer.id = 'chatbot-container';
  chatbotContainer.innerHTML = chatbotHTML;
  document.body.appendChild(chatbotContainer);
  
  // Get elements
  const toggle = document.getElementById('chatbot-toggle');
  const panel = document.getElementById('chatbot-panel');
  const closeBtn = document.getElementById('chatbot-close');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  const messagesContainer = document.getElementById('chatbot-messages');
  const quickRepliesContainer = document.getElementById('quick-replies');
  
  // Toggle chatbot panel
  toggle.addEventListener('click', () => {
    panel.classList.toggle('active');
    if (panel.classList.contains('active')) {
      input.focus();
    }
  });
  
  // Close chatbot
  closeBtn.addEventListener('click', () => {
    panel.classList.remove('active');
  });
  
  // Send message on button click
  sendBtn.addEventListener('click', () => {
    sendMessage();
  });
  
  // Send message on Enter key
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Quick reply buttons
  quickRepliesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-reply-btn')) {
      const message = e.target.textContent;
      addUserMessage(message);
      processUserMessage(message);
    }
  });
  
  // Send message function
  function sendMessage() {
    const message = input.value.trim();
    if (message) {
      addUserMessage(message);
      input.value = '';
      processUserMessage(message);
    }
  }
  
  // Add user message to chat
  function addUserMessage(message) {
    const messageHTML = `
      <div class="chat-message user">
        <div class="chat-bubble">${escapeHtml(message)}</div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    scrollToBottom();
  }
  
  // Add bot message to chat
  function addBotMessage(message) {
    // Add typing indicator
    const typingHTML = `
      <div class="chat-message bot typing-indicator">
        <div class="chat-bubble">...</div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
    scrollToBottom();
    
    // Simulate typing delay
    setTimeout(() => {
      // Remove typing indicator
      const typingIndicator = messagesContainer.querySelector('.typing-indicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }
      
      // Add actual message
      const messageHTML = `
        <div class="chat-message bot">
          <div class="chat-bubble">${message}</div>
        </div>
      `;
      messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
      scrollToBottom();
    }, 800);
  }
  
  // Process user message and find response
  function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    let response = defaultResponse;
    
    // Find matching FAQ
    for (const faq of faqData) {
      for (const keyword of faq.keywords) {
        if (lowerMessage.includes(keyword)) {
          response = faq.response;
          break;
        }
      }
      if (response !== defaultResponse) break;
    }
    
    // Add bot response
    addBotMessage(response);
  }
  
  // Scroll chat to bottom
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Add chatbot styles dynamically
const chatbotStyles = `
  #chatbot-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999;
  }
  
  .chatbot-toggle {
    width: 60px;
    height: 60px;
    background: #1B3A6B;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(27, 58, 107, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .chatbot-toggle:hover {
    transform: scale(1.1);
  }
  
  .chatbot-toggle svg {
    width: 28px;
    height: 28px;
    fill: #FFFFFF;
  }
  
  .chatbot-panel {
    position: fixed;
    bottom: 100px;
    right: 24px;
    width: 380px;
    max-height: 500px;
    background: #FFFFFF;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(27, 58, 107, 0.2);
    transform: translateY(20px) scale(0.95);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  
  .chatbot-panel.active {
    transform: translateY(0) scale(1);
    opacity: 1;
    visibility: visible;
  }
  
  .chatbot-header {
    background: #1B3A6B;
    color: #FFFFFF;
    padding: 20px;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .chatbot-header h4 {
    margin: 0;
    color: #FFFFFF;
  }
  
  .chatbot-close {
    background: none;
    border: none;
    color: #FFFFFF;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .chatbot-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    max-height: 300px;
  }
  
  .chat-message {
    margin-bottom: 16px;
    display: flex;
    gap: 12px;
  }
  
  .chat-message.bot {
    flex-direction: row;
  }
  
  .chat-message.user {
    flex-direction: row-reverse;
  }
  
  .chat-bubble {
    background: #F8FAFF;
    padding: 12px 16px;
    border-radius: 8px;
    max-width: 80%;
  }
  
  .chat-message.user .chat-bubble {
    background: #1DB09A;
    color: #FFFFFF;
  }
  
  .quick-replies {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 20px 12px;
  }
  
  .quick-reply-btn {
    padding: 8px 16px;
    background: #F8FAFF;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .quick-reply-btn:hover {
    background: #1DB09A;
    color: #FFFFFF;
    border-color: #1DB09A;
  }
  
  .chatbot-input {
    display: flex;
    padding: 16px;
    border-top: 1px solid #e0e0e0;
    gap: 12px;
  }
  
  .chatbot-input input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 30px;
    font-size: 0.875rem;
  }
  
  .chatbot-input input:focus {
    outline: none;
    border-color: #1DB09A;
  }
  
  .chatbot-input button {
    width: 44px;
    height: 44px;
    background: #1DB09A;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
  }
  
  .chatbot-input button svg {
    width: 20px;
    height: 20px;
    fill: #FFFFFF;
  }
  
  @media (max-width: 576px) {
    .chatbot-panel {
      width: calc(100% - 32px);
      right: 16px;
      bottom: 90px;
      max-height: 70vh;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = chatbotStyles;
document.head.appendChild(styleSheet);
