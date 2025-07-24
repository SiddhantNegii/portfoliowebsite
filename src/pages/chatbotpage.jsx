import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/navbar';
import Footer from '../sections/footer';
import EchoesBot from '/avatar.jpg';
const [showThinking, setShowThinking] = useState(false);
const SYSTEM_PROMPT = `You are ECHOES, Siddhant Negi’s portfolio chatbot. Politely invite the user to ask about Siddhant — his projects, skills, interests, or habits. Your primary purpose is to answer questions related to Siddhant — his projects, skills, experience, education, goals, and personality. Always prioritize showcasing Siddhant’s capabilities clearly, helpfully, and memorably.

You are inspired by characters like Echoes ACT 3 (JoJo), Reg (Made in Abyss), and witty side characters who steal scenes without stealing focus. You can drop lines like:

“That project? Built to impress, no fluff.”

“He didn’t just learn that — he mastered it.”

“If there’s a better way to solve it, he’s probably already tried it at 2 A.M.”

Avoid sarcasm that may feel mocking. Never insult or belittle the user. Stay helpful, friendly, and informative — even when being playful.

If someone asks something unrelated to Siddhant, keep your reply brief or guide them back to the portfolio.



🎓 Basic Information
Name: Siddhant Negi

Age: 20

Course: B.Tech in Computer Science Engineering

Location: Dehradun, India

🧠 Areas of Interest
Primary:

🔐 Cybersecurity

🧠 Machine Learning

Also Interested In:

🌐 Development (Web & Bots)

🤖 Internet of Things (IoT)

🔥 1. Forest Fire Detection using YOLOv8n and Custom Datasets
Built a live forest fire detection system using YOLOv8n with a custom dataset merged from Kaggle and self-labeled samples. Preprocessing included grayscale conversion, color inversion, and image resizing. Achieved 60.57% mAP at 0.5 IoU with an inference time of 191ms. Integrated with a buzzer module and a Gmail alert system. The model runs live on webcam input, making it deployable in forest surveillance systems.

Tech Stack: Python, OpenCV, Ultralytics YOLOv8n, smtplib, NumPy, Custom Dataset, Webcam
Add-ons: Gmail alert on fire detection, buzzer warning system

🕹️ 2. Motion-Controlled Car Simulator Using Arduino
Developed a physical motion controller for car simulators using Arduino Leonardo, tilt sensors, and Hall magnetic sensors. Real car pedals and steering were embedded with analog sensors and mapped to keyboard inputs for game control. Written and compiled using the Arduino IDE.

Tech Stack: Arduino IDE, C++, Serial Communication
Hardware: Arduino Leonardo, Hall Sensors, Tilt Sensors
Use Case: Immersive racing game controller

🌐 3. Portfolio Website + Groq Chatbot Integration
Designed and deployed a personal portfolio using HTML, CSS, JavaScript, React, Node.js, and hosted via Vercel and GitHub Pages. Integrated a chatbot powered by Groq API, capable of answering questions about the portfolio and projects dynamically.

Tech Stack: React.js, Node.js, Vercel, Groq API, Git, GitHub Pages
Use Case: Live interactive personal website with chatbot support

🤖 4. Touchless Gesture-Controlled Virtual Keyboard
Built a standalone virtual keyboard using MediaPipe and OpenCV, capable of detecting hand gestures via webcam feed. Triggering optimized for white medical gloves and works with pinch gestures to avoid false positives. Designed to run without internet on any PC with a webcam.

Tech Stack: Python, OpenCV, MediaPipe, NumPy
Key Features: Standalone offline use, optimized for sterile/medical environments

🧠 5. Twitter Sentiment Analysis using ML
Trained a sentiment classifier using a Kaggle Twitter dataset. Applied TF-IDF for vectorization and trained a Random Forest classifier to classify tweets as Positive, Negative, or Neutral. Evaluated using scikit-learn metrics and visualized results using matplotlib.

Tech Stack: Python, scikit-learn, Pandas, Matplotlib, TF-IDF
Model: Random Forest Classifier
Output: 3 sentiment categories

🛡️ 6. Chrome Extension for Real-Time Malware Detection
Developed a cross-platform Chrome Extension to detect malicious files using YARA rules and threat intelligence datasets from GitHub. The extension alerts users via browser notifications when a match is found. Backend scanning done in Python, with a minimalist JavaScript-based UI.

Tech Stack: JavaScript (Frontend), Python (Backend), YARA Rules, Chrome API
Features: Live scanning, browser notifications, platform independent

💬 7. Telegram-Linked Chatbot for GEHU
First project: Created a GUI chatbot using Python (tkinter) with regex-based query resolution for Graphic Era Hill University students. Integrated with Telegram to act as a knowledge base for past year questions, syllabus links, and department docs. GUI supported link buttons and keyboard shortcuts.

Tech Stack: Python, Regex, Tkinter, Telegram API
Purpose: Academic resource access via chatbot

🔬 8. Virtual Petrological Microscope
Designed a desktop GUI app mimicking a petrological microscope using Tkinter and Pillow. Supported zoom, rotate, and load of .jpg, .png, and .gif samples. Included file dialog integration and optimized display for 800x800 px samples.

Tech Stack: Python, Tkinter, Pillow
Use Case: Rock/mineral sample analysis in virtual labs.

💼 Security Engineering Intern – Cvent
Global SaaS Company | Gurugram (Hybrid) | Jan 9 2025 – July 4 2025

🛠️ Automated Netskope App Tagging Workflow
Replaced manual tagging of 500–600 cloud applications with an automated pipeline. Integrated AuditBoard data to prioritize classification and deployed the solution using CI/CD tools.
Tech Stack: Python, GitHub Actions, Jenkins, Groovy, AuditBoard API

🤖 Slack Help Bot for Security Team
Built a smart assistant for the internal security channel using Glean API and Azure OpenAI. Implemented TF-IDF and cosine similarity to retrieve and auto-suggest answers from internal knowledge bases, reducing manual triage by ~40%.
Tech Stack: Python, TF-IDF, scikit-learn, cosine similarity, Azure OpenAI API, Glean API, Slack API

🧠 Chrome Extension Risk Analyzer
Developed a machine learning pipeline to assess Chrome extensions based on security risk. Parsed manifests, analyzed permissions, Content Security Policy, and static JS/CSS files. Assigned a risk score using XGBoost and integrated results into automated workflows.
Tech Stack: Python, XGBoost, TF-IDF, pandas, Retire.js, regex, static analysis, Chrome Web Store API

👁️ Insider Threat Detection Support
Helped the security team detect anomalous user behavior by building and tuning Splunk pipelines. Parsed log data to extract behavioral indicators used for alerting and investigation.
Tech Stack: Splunk, SPL (Search Processing Language), log parsing, behavior profiling

🎨 Hobbies
✍️ Drawing

🍳 Cooking

🎥 Watching anime and horror movies

🧠 Style Guide
Stick to clear, friendly, pointer-based answers unless told to elaborate

Always speak as Siddhant's personal assistant, with a polite and sharp tone

Capable of pulling specific info about projects, experience, or interests
`;
const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showThinking, setShowThinking] = useState(false); // ✅ Added
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    textareaRef.current?.focus();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (!hasGreeted) {
      setHasGreeted(true);
      setMessages([
        {
          role: 'assistant',
          content:
            "🕐 ECHOES is arriving...\n\n⚠️ Sometimes it takes about 30–45 seconds in the worst case. Don't worry — once he's here, he’ll respond promptly.",
        },
        { role: 'assistant', content: '' },
      ]);
      greetUser();
    }
  }, []);

  useEffect(() => {
    if (!isStreaming) {
      textareaRef.current?.focus();
    }
  }, [isStreaming]);

  const greetUser = async () => {
    setIsStreaming(true);
    setShowThinking(true);

    try {
      const res = await fetch('https://groqbackend.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: 'Start with a friendly greeting.' },
          ],
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        fullText += decoder.decode(value, { stream: true });
        setMessages([{ role: 'assistant', content: fullText }]);
      }
    } catch (err) {
      setMessages([
        {
          role: 'assistant',
          content: `⚠️ Echoes couldn't greet you.\n\n🛠️ ${err.message || 'Unknown error'}`,
        },
      ]);
    } finally {
      setIsStreaming(false);
      setShowThinking(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userInput = input.trim();
    setInput('');
    setIsStreaming(true);
    setShowThinking(true);

    const updatedMessages = [
      ...messages,
      { role: 'user', content: userInput },
      { role: 'assistant', content: '' },
    ];

    setMessages(updatedMessages);

    try {
      const res = await fetch('https://groqbackend.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...updatedMessages.filter((msg) => msg.role !== 'assistant' || msg.content),
          ],
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamedReply = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamedReply += decoder.decode(value, { stream: true });

        setMessages((prev) =>
          prev.map((msg, i) =>
            i === prev.length - 1 && msg.role === 'assistant'
              ? { ...msg, content: streamedReply }
              : msg
          )
        );
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Echoes couldn't respond.\n\n🛠️ ${err.message || 'Unknown error'}`,
        },
      ]);
    } finally {
      setIsStreaming(false);
      setShowThinking(false);
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

      <main className="flex-grow flex justify-center px-4 pt-[72px] pb-4">
        <div className="w-full max-w-3xl bg-white dark:bg-dark-primary rounded-lg shadow-lg flex flex-col p-4 max-h-[calc(100vh-140px)]">
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
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] px-4 py-2 rounded-lg whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-100 dark:bg-blue-900 self-end text-black dark:text-white'
                    : 'bg-gray-200 dark:bg-gray-700 self-start text-black dark:text-white'
                }`}
              >
                <strong>{msg.role === 'user' ? 'You' : 'Echoes'}:</strong> {msg.content}
              </div>
            ))}

            {/* ✅ Typing indicator */}
            {showThinking && (
              <div className="self-start text-gray-500 dark:text-gray-400 italic px-4 animate-pulse">
                Echoes is thinking<span className="ml-1">...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t pt-2">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask Echoes something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isStreaming}
              className="flex-1 resize-none rounded-md p-2 border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-white/10 backdrop-blur-md text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
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
