import React from 'react';
import EchoesBot from '/avatar.jpg';

const ChatbotCard = () => {
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 text-white">
      <div className="flex items-center space-x-4">
        <img
          src={EchoesBot}
          alt="Echoes Bot"
          className="w-16 h-16 rounded-full border border-gray-500 object-cover"
        />
        <div>
          <h2 className="text-xl font-bold">Echoes Companion</h2>
          <p className="text-sm text-gray-300 italic">
            "Let’s make it stand out, one punch at a time."
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-gray-200 mb-3">
          Ask me anything about Siddhant’s portfolio, projects, or skills.
        </p>
        <iframe
          src="https://your-chatbot-url.com/embed" // Replace with real embed URL
          className="w-full h-80 rounded-md border border-gray-600"
          title="Echoes Bot"
        />
      </div>
    </div>
  );
};

export default ChatbotCard;
