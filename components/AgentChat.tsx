
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiStream, generateSpeech } from '../services/geminiService';

interface Message {
  role: 'user' | 'agent';
  text: string;
  isStreaming?: boolean;
}

const AgentChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', text: "Neurological sync established. I am the AI Lab Research Guardian. How shall we traverse the quantum constructs today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const playTTS = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    const base64Audio = await generateSpeech(text);
    if (!base64Audio) {
      setIsSpeaking(false);
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.onended = () => setIsSpeaking(false);
    source.start();
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const stream = await getGeminiStream(userMsg);
      let fullResponse = "";
      
      setMessages(prev => [...prev, { role: 'agent', text: "", isStreaming: true }]);

      for await (const chunk of stream) {
        const chunkText = chunk.text || "";
        fullResponse += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'agent') {
            lastMsg.text = fullResponse;
          }
          return newMessages;
        });
      }

      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg.role === 'agent') {
          lastMsg.isStreaming = false;
        }
        return newMessages;
      });

    } catch (error) {
      console.error("Neural sync error:", error);
      setMessages(prev => [...prev, { role: 'agent', text: "Neural link severed. Recalibrating quantum gate." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-2xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-[pulse_3s_infinite]"></div>
          <svg className="w-8 h-8 text-white group-hover:rotate-12 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      ) : (
        <div className="w-[380px] h-[550px] glass rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-300">
          <div className="p-6 bg-gradient-to-r from-[#1e40af] to-[#3730a3] flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-white shadow-inner border border-white/10 text-xs">LAB</div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-tighter italic">Guardian</h3>
                <p className="text-[8px] text-blue-200 font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  SYNCED
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[#020617]/40">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-[1.5rem] text-[13px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-xl' 
                    : 'bg-gray-900/80 text-gray-200 rounded-bl-none border border-white/5'
                }`}>
                  {msg.text || (msg.isStreaming ? "Synthesizing..." : "")}
                </div>
                {msg.role === 'agent' && msg.text && !msg.isStreaming && (
                  <button 
                    onClick={() => playTTS(msg.text)}
                    disabled={isSpeaking}
                    className="mt-2 text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-blue-400 flex items-center gap-1.5 transition-all"
                  >
                    <svg className={`w-3 h-3 ${isSpeaking ? 'animate-pulse text-blue-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    {isSpeaking ? 'LIVE FEED' : 'LISTEN'}
                  </button>
                )}
              </div>
            ))}
            {isTyping && !messages[messages.length-1].isStreaming && (
              <div className="flex justify-start">
                <div className="bg-gray-900/50 px-5 py-3 rounded-[1.5rem] rounded-bl-none border border-white/5 flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-900/90 backdrop-blur-xl border-t border-white/5">
            <div className="relative">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message Swarm..."
                disabled={isTyping}
                className="w-full bg-gray-800/50 text-sm text-white rounded-xl pl-5 pr-12 py-3.5 focus:ring-2 focus:ring-blue-600/30 outline-none border border-white/10 transition-all placeholder:text-gray-600 disabled:opacity-50"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="absolute right-1.5 top-1.5 w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7 7m0 0l7-7m-7 7V3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentChat;
