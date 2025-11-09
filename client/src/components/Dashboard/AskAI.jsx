import { useState } from "react";
import chatbotIcon from "../../assets/chat-bot.png";
import clipIcon from "../../assets/clip.png";

export default function AskAI() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hi! I'm your AI assistant. I can help you with complaints, institution information, and more. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim() && uploadedFiles.length === 0) return;

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: inputText,
      files: uploadedFiles,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputText("");
    setUploadedFiles([]);
    setIsLoading(true);

    // TODO: Call your AI backend API here
    // Example:
    // const response = await fetch('/api/ai/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     message: inputText,
    //     files: uploadedFiles
    //   })
    // });
    // const data = await response.json();
    // Add bot response to chat
    // setMessages(prev => [...prev, { id: ..., type: 'bot', text: data.response }]);

    // For now, show a placeholder response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        text: "I received your message! (AI logic not yet configured. Please add your AI backend integration.)",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: "bot",
        text: "Hi! I'm your AI assistant. I can help you with complaints, institution information, and more. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <img src={chatbotIcon} alt="Ask AI" className="w-10 h-10" />
          <h1 className="text-4xl font-bold text-gray-800">Ask AI</h1>
        </div>
        <p className="text-gray-600 mt-2">
          Chat with our AI assistant for help with complaints, institution insights, and more
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-lg shadow-md flex flex-col h-96 md:h-full" style={{ minHeight: "600px" }}>
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <img src={chatbotIcon} alt="Ask AI" className="w-16 h-16 mx-auto mb-2" />
                <p className="text-lg">Start a conversation with AI</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  {message.files && message.files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.files.map((file, idx) => (
                        <div key={idx} className="text-xs opacity-75 flex items-center gap-1">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      message.type === "user" ? "text-green-100" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* File Upload Preview */}
        {uploadedFiles.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
            <p className="text-sm font-semibold text-blue-800 mb-2">Attached Files:</p>
            <div className="space-y-2">
              {uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white p-2 rounded border border-blue-200"
                >
                  <span className="text-sm text-gray-700">
                     {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                  <button
                    onClick={() => removeFile(idx)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t p-4 bg-white">
          <form onSubmit={handleSendMessage} className="space-y-3">
            {/* File Upload */}
            <div className="flex gap-2">
              <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer transition">
                <img src={clipIcon} alt="Attachment" className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-700">Upload</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.csv"
                />
              </label>
              
              <button
                type="button"
                onClick={clearChat}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700 transition"
              >
                Clear
              </button>
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                disabled={(!inputText.trim() && uploadedFiles.length === 0) || isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-3">AI Capabilities</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Help with filing complaints</li>
          <li>✓ Answer questions about institutions</li>
          <li>✓ Provide complaint tips and advice</li>
          <li>✓ Upload and analyze documents</li>
          <li>✓ Suggest resolution strategies</li>
        </ul>
      </div>
    </div>
  );
}
