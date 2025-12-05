import { useState } from "react";
import { IoSend } from "react-icons/io5";


export default function SendMsgBar({ onSend, primaryColor = "blue" }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() === "") return;
    if (onSend) onSend(message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`rounded-3xl p-3 sm:p-4 md:p-5 flex flex-col w-full`}
    >
      {/* Input row */}
      <div className="flex items-center justify-between w-full">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown} 
          placeholder="Send message"
          className="flex-1 bg-neutral-200 hover:bg-neutral-100 focus:bg-neutral-100 rounded-full px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base outline-none"
        />
        <button
          onClick={handleSend}
          className={`ml-3 text-${primaryColor}-400 hover:text-gray-400 text-lg sm:text-xl p-2 rounded-full`}
        >
          <IoSend />
        </button>
      </div>

    </div>
  );
}
