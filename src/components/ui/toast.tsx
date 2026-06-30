"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error";
}

let nextId = 0;
let addToast: ((text: string, type: "success" | "error") => void) | null = null;

export function toast(text: string, type: "success" | "error" = "success") {
  addToast?.(text, type);
}

export function ToastContainer() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    addToast = (text: string, type: "success" | "error") => {
      const id = nextId++;
      setMessages((prev) => [...prev, { id, text, type }]);
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }, 3000);
    };

    return () => {
      addToast = null;
    };
  }, []);

  if (messages.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-2 sm:left-auto sm:right-4 sm:w-80">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-lg ${
            msg.type === "success"
              ? "bg-balance text-white"
              : "bg-debt text-white"
          }`}
        >
          <span className="flex-1">{msg.text}</span>
          <button
            type="button"
            onClick={() =>
              setMessages((prev) => prev.filter((m) => m.id !== msg.id))
            }
            className="opacity-70 hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
