import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../sections/footer';
import EchoesBot from '/avatar.jpg';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hi! I'm Echoes — Siddhant's assistant. Ask me anything about his projects, skills, or what makes him tick.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch('https://groqbackend.onrender.com/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'moonshotai/kimi-k2-instruct',
          prompt: userMessage,
        }),
      });

      if (!response.ok || !response.body) {
        const text = await response.text();
        throw new Error(`Bad response: ${response.status} - ${text}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = '';

      // 👇 Initialize empty streaming message
      setMessages((prev) => [...prev, { sender: 'bot-stream', text: '' }]);

      const streamMessage = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          botMessage += chunk;

          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.findIndex((m) => m.sender === 'bot-stream');
            if (lastIndex !== -1) {
              updated[lastIndex] = { sender: 'bot-stream', text: botMessage };
              return updated;
            }
            return [...updated, { sender: 'bot-stream', text: botMessage }];
          });
        }

        // Finalize streaming message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === 'bot-stream' ? { sender: 'bot', text: msg.text } : msg
          )
        );
        setIsStreaming(false);
      };

      await streamMessage();
    } catch (err) {
      console.error('Chatbot error:', err);

      const errorMessage =
        `⚠️ Echoes couldn't fetch a reply.\n` +
        `Reason: ${err.message || 'Unknown error.'}\n` +
        `Check if the backend at https://groqbackend.onrender.com/ is running and accessible.`;

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: errorMessage,
        },
      ]);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-bg text-light-black dark:bg-dark-bg dark:text-dark-white">
      <Navbar />

      <main className="flex-grow flex justify-center py-10 px-4">
        <div className="w-full max-w-2xl bg-white dark:bg-dark-primary rounded-lg shadow-lg flex flex-col p-4">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={EchoesBot}
              alt="Echoes Bot"
              className="w-12 h-12 rounded-full border"
            />
            <div>
              <h2 className="text-xl font-bold text-dark-secondary dark:text-light-secondary">
                Echoes Companion
              </h2>
              <p className="text-sm italic text-gray-600 dark:text-gray-300">
                “Let’s make it stand out, one punch at a time.”
              </p>
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[500px] pr-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] px-4 py-2 rounded-lg whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white self-end ml-auto'
                    : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 border-t pt-2">
            <textarea
              rows={1}
              placeholder="Ask Echoes something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isStreaming}
              className="flex-1 resize-none rounded-md p-2 border border-gray-300 dark:border-gray-600 dark:bg-dark-secondary dark:text-white"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              disabled={isStreaming}
            >
              Send
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChatbotPage;
