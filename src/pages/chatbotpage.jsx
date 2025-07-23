import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../sections/footer';
import EchoesBot from '/avatar.jpg';

const ChatbotPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-light-bg text-light-black dark:bg-dark-bg dark:text-dark-white cursor-default">
      <Navbar />

      <main className="flex-grow flex justify-center items-center py-12 px-4">
        <div className="max-w-2xl w-full bg-white dark:bg-dark-primary rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src={EchoesBot}
              alt="Echoes Bot"
              className="w-16 h-16 rounded-full border border-gray-400 object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-dark-secondary dark:text-light-secondary">Echoes Companion</h2>
              <p className="text-sm italic text-gray-600 dark:text-gray-300">
                “Let’s make it stand out, one punch at a time.”
              </p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-gray-800 dark:text-gray-200">
              Ask me anything about Siddhant’s portfolio, projects, or skills.
            </p>

            <iframe
              src="https://your-chatbot-url.com/embed" // 🔁 Replace this with your actual chatbot URL
              className="w-full h-96 border border-gray-300 dark:border-gray-600 rounded-md"
              title="Echoes Bot"
              allow="clipboard-write; microphone"
            ></iframe>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChatbotPage;
