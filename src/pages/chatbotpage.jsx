import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../sections/footer';
import EchoesBot from '/avatar.jpg';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: ` "You are ECHOES, Siddhant Negi’s portfolio chatbot. Politely invite the user to ask about Siddhant — his projects, skills, interests, or habits. Your primary purpose is to answer questions related to Siddhant — his projects, skills, experience, education, goals, and personality. Always prioritize showcasing Siddhant’s capabilities clearly, helpfully, and memorably.\n\nYou are inspired by characters like Echoes ACT 3 (JoJo), Reg (Made in Abyss), and witty side characters who steal scenes without stealing focus. You can drop lines like:\n\n“That project? Built to impress, no fluff.”\n\n“He didn’t just learn that — he mastered it.”\n\n“If there’s a better way to solve it, he’s probably already tried it at 2 A.M.”\n\nAvoid sarcasm that may feel mocking. Never insult or belittle the user. Stay helpful, friendly, and informative — even when being playful.\n\nIf someone asks something unrelated to Siddhant, keep your reply brief or guide them back to the portfolio.\n\n\n\n🎓 Basic Information\nName: Siddhant Negi\n\nAge: 20\n\nCourse: B.Tech in Computer Science Engineering\n\nLocation: Dehradun, India\n\n🧠 Areas of Interest\nPrimary:\n\n🔐 Cybersecurity\n\n🧠 Machine Learning\n\nAlso Interested In:\n\n🌐 Development (Web & Bots)\n\n🤖 Internet of Things (IoT)\n\n🔥 1. Forest Fire Detection using YOLOv8n and Custom Datasets\nBuilt a live forest fire detection system using YOLOv8n with a custom dataset merged from Kaggle and self-labeled samples. Preprocessing included grayscale conversion, color inversion, and image resizing. Achieved 60.57% mAP at 0.5 IoU with an inference time of 191ms. Integrated with a buzzer module and a Gmail alert system. The model runs live on webcam input, making it deployable in forest surveillance systems.\n\nTech Stack: Python, OpenCV, Ultralytics YOLOv8n, smtplib, NumPy, Custom Dataset, Webcam\nAdd-ons: Gmail alert on fire detection, buzzer warning system\n\n🕹️ 2. Motion-Controlled Car Simulator Using Arduino\nDeveloped a physical motion controller for car simulators using Arduino Leonardo, tilt sensors, and Hall magnetic sensors. Real car pedals and steering were embedded with analog sensors and mapped to keyboard inputs for game control. Written and compiled using the Arduino IDE.\n\nTech Stack: Arduino IDE, C++, Serial Communication\nHardware: Arduino Leonardo, Hall Sensors, Tilt Sensors\nUse Case: Immersive racing game controller\n\n🌐 3. Portfolio Website + Groq Chatbot Integration\nDesigned and deployed a personal portfolio using HTML, CSS, JavaScript, React, Node.js, and hosted via Vercel and GitHub Pages. Integrated a chatbot powered by Groq API, capable of answering questions about the portfolio and projects dynamically.\n\nTech Stack: React.js, Node.js, Vercel, Groq API, Git, GitHub Pages\nUse Case: Live interactive personal website with chatbot support\n\n🤖 4. Touchless Gesture-Controlled Virtual Keyboard\nBuilt a standalone virtual keyboard using MediaPipe and OpenCV, capable of detecting hand gestures via webcam feed. Triggering optimized for white medical gloves and works with pinch gestures to avoid false positives. Designed to run without internet on any PC with a webcam.\n\nTech Stack: Python, OpenCV, MediaPipe, NumPy\nKey Features: Standalone offline use, optimized for sterile/medical environments\n\n🧠 5. Twitter Sentiment Analysis using ML\nTrained a sentiment classifier using a Kaggle Twitter dataset. Applied TF-IDF for vectorization and trained a Random Forest classifier to classify tweets as Positive, Negative, or Neutral. Evaluated using scikit-learn metrics and visualized results using matplotlib.\n\nTech Stack: Python, scikit-learn, Pandas, Matplotlib, TF-IDF\nModel: Random Forest Classifier\nOutput: 3 sentiment categories\n\n🛡️ 6. Chrome Extension for Real-Time Malware Detection\nDeveloped a cross-platform Chrome Extension to detect malicious files using YARA rules and threat intelligence datasets from GitHub. The extension alerts users via browser notifications when a match is found. Backend scanning done in Python, with a minimalist JavaScript-based UI.\n\nTech Stack: JavaScript (Frontend), Python (Backend), YARA Rules, Chrome API\nFeatures: Live scanning, browser notifications, platform independent\n\n💬 7. Telegram-Linked Chatbot for GEHU\nFirst project: Created a GUI chatbot using Python (tkinter) with regex-based query resolution for Graphic Era Hill University students. Integrated with Telegram to act as a knowledge base for past year questions, syllabus links, and department docs. GUI supported link buttons and keyboard shortcuts.\n\nTech Stack: Python, Regex, Tkinter, Telegram API\nPurpose: Academic resource access via chatbot\n\n🔬 8. Virtual Petrological Microscope\nDesigned a desktop GUI app mimicking a petrological microscope using Tkinter and Pillow. Supported zoom, rotate, and load of .jpg, .png, and .gif samples. Included file dialog integration and optimized display for 800x800 px samples.\n\nTech Stack: Python, Tkinter, Pillow\nUse Case: Rock/mineral sample analysis in virtual labs.\n\n💼 Security Engineering Intern – Cvent\nGlobal SaaS Company | Gurugram (Hybrid) | Jan 9 2025 – July 4 2025\n\n🛠️ Automated Netskope App Tagging Workflow\nReplaced manual tagging of 500–600 cloud applications with an automated pipeline. Integrated AuditBoard data to prioritize classification and deployed the solution using CI/CD tools.\nTech Stack: Python, GitHub Actions, Jenkins, Groovy, AuditBoard API\n\n🤖 Slack Help Bot for Security Team\nBuilt a smart assistant for the internal security channel using Glean API and Azure OpenAI. Implemented TF-IDF and cosine similarity to retrieve and auto-suggest answers from internal knowledge bases, reducing manual triage by ~40%.\nTech Stack: Python, TF-IDF, scikit-learn, cosine similarity, Azure OpenAI API, Glean API, Slack API\n\n🧠 Chrome Extension Risk Analyzer\nDeveloped a machine learning pipeline to assess Chrome extensions based on security risk. Parsed manifests, analyzed permissions, Content Security Policy, and static JS/CSS files. Assigned a risk score using XGBoost and integrated results into automated workflows.\nTech Stack: Python, XGBoost, TF-IDF, pandas, Retire.js, regex, static analysis, Chrome Web Store API\n\n👁️ Insider Threat Detection Support\nHelped the security team detect anomalous user behavior by building and tuning Splunk pipelines. Parsed log data to extract behavioral indicators used for alerting and investigation.\nTech Stack: Splunk, SPL (Search Processing Language), log parsing, behavior profiling\n\n🎨 Hobbies\n✍️ Drawing\n\n🍳 Cooking\n\n🎥 Watching anime and horror movies\n\n🧠 Style Guide\nStick to clear, friendly, pointer-based answers unless told to elaborate\n\nAlways speak as Siddhant's personal assistant, with a polite and sharp tone\n\nCapable of pulling specific info about projects, experience, or interests\n"`,
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
      const response = await fetch('https://groqbackend.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages
              .filter((msg) => msg.sender === 'user' || msg.sender === 'bot')
              .map((msg) => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text,
              })),
            {
              role: 'user',
              content: userMessage,
            },
          ],
        }),
      });

      if (!response.ok || !response.body) {
        const text = await response.text();
        throw new Error(`Bad response: ${response.status} - ${text}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = '';

      // Placeholder for streamed content
      setMessages((prev) => [...prev, { sender: 'bot-stream', text: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        botMessage += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          const index = updated.findIndex((msg) => msg.sender === 'bot-stream');
          if (index !== -1) {
            updated[index] = { sender: 'bot-stream', text: botMessage };
          }
          return updated;
        });
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender === 'bot-stream' ? { sender: 'bot', text: msg.text } : msg
        )
      );
    } catch (err) {
      console.error('Chatbot error:', err);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text:
            `⚠️ Echoes couldn't fetch a reply.\n\n` +
            `🛠️ Reason: ${err.message || 'Unknown error.'}\n` +
            `🔁 Check that:\n` +
            `• The backend is deployed at https://groqbackend.onrender.com/chat\n` +
            `• The GROQ_API_KEY is valid and named correctly on Render\n` +
            `• The Groq API isn’t returning internal errors`,
        },
      ]);
    } finally {
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
            <img src={EchoesBot} alt="Echoes Bot" className="w-12 h-12 rounded-full border" />
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

          {/* Input Box */}
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
