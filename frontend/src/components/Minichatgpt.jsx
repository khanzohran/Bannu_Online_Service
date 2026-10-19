
import React, { useState, useRef, useEffect } from "react";

function MiniChatGPT() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! 👋 Main aapka Mini AI Assistant hoon. Aaj main aapki kya help kar sakta hoon?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Demo response: actual AI API abhi connected nahi hai
    setTimeout(() => {
      const response = {
        role: "assistant",
        content:
          "Thanks for your question! 😊 Main aapka Mini AI Assistant hoon. Actual AI responses ke liye mujhe AI API se connect karna hoga.",
      };

      setMessages((prev) => [...prev, response]);
      setLoading(false);
    }, 1000);
  };

  const newChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! 👋 Main aapka Mini AI Assistant hoon. Aaj main aapki kya help kar sakta hoon?",
      },
    ]);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-slate-800">

      

      {/* ================= MAIN CHAT ================= */}

      <main className="flex min-w-0 flex-1 flex-col bg-white">

        {/* HEADER */}

        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4 sm:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600 md:hidden">
              AI
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Mini ChatGPT
              </h2>

              <p className="text-xs text-green-600">
                ● Assistant UI
              </p>
            </div>
          </div>

          <button
            onClick={newChat}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            + New Chat
          </button>
        </header>

        {/* MESSAGES */}

        <section className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">

          <div className="mx-auto max-w-3xl space-y-6">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === "user"
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >

                {/* AVATAR */}

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    message.role === "user"
                      ? "bg-slate-200 text-slate-700"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {message.role === "user" ? "U" : "AI"}
                </div>

                {/* MESSAGE */}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 sm:max-w-[75%] ${
                    message.role === "user"
                      ? "rounded-tr-sm bg-blue-600 text-white"
                      : "rounded-tl-sm border border-slate-100 bg-slate-50 text-slate-700"
                  }`}
                >
                  {message.content}
                </div>

              </div>
            ))}

            {/* LOADING */}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  AI
                </div>

                <div className="flex items-center gap-1 rounded-xl bg-slate-100 px-5 py-4">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:150ms]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:300ms]"></span>
                </div>
              </div>
            )}

            <div ref={bottomRef}></div>

          </div>
        </section>

        {/* INPUT AREA */}

        <footer className="shrink-0 border-t border-slate-100 bg-white px-4 py-4 sm:px-8">

          <form
            onSubmit={sendMessage}
            className="mx-auto max-w-3xl"
          >

            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50">

              <textarea
                rows="1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    e.currentTarget.form.requestSubmit();
                  }
                }}
                placeholder="Ask anything..."
                className="max-h-32 min-h-11 flex-1 resize-y bg-transparent px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                aria-label="Send message"
              >
                ↑
              </button>

            </div>

            <p className="mt-3 text-center text-xs text-slate-400">
              Mini ChatGPT · Demo frontend
            </p>

          </form>
        </footer>

      </main>
    </div>
  );
}

export default MiniChatGPT;