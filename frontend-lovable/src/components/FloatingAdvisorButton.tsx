
import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send } from "lucide-react";
import { handleGeminiQuery } from "@/lib/gemini";

const FloatingAdvisorButton: React.FC = () => {
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Check if browser supports speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'es-ES';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setValue(transcript);
        setIsRecording(false);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        alert('Error en el reconocimiento de voz. Por favor, intenta escribir tu pregunta.');
      };

      recognition.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const startRecording = async () => {
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz. Por favor, escribe tu pregunta.');
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setIsRecording(true);
      setValue("");
      recognition.current?.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('No se pudo acceder al micrófono. Por favor, permite el acceso e intenta de nuevo.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognition.current?.stop();
  };

  async function handleGeminiQueryWrapper(question: string) {
    if (!question.trim()) return;
    
    console.log("Pregunta enviada a Gemini:", question);
    setIsProcessing(true);
    setShowInput(false);
    setValue("");

    try {
      const answer = await handleGeminiQuery(question);
      alert("Gemini dice:\n" + answer);
    } catch (error) {
      console.error('Error:', error);
      alert("Error al procesar la consulta. Por favor, intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <>
      <button
        className="
          fixed z-50 bottom-7 right-7 md:bottom-10 md:right-10
          bg-primary text-primary-foreground font-medium
          shadow-lg rounded-full px-6 py-3 flex items-center gap-2
          hover:bg-primary/90 hover:shadow-xl
          focus:outline-none outline-none border-2 border-primary
          active:scale-95 transition-all
        "
        onClick={() => setShowInput(true)}
        disabled={isProcessing}
        aria-label="Habla con tu asesor de compras"
      >
        <span className="text-2xl">🎙️</span>
        <span className="ml-1 hidden sm:inline">
          {isProcessing ? "Procesando..." : "Habla con tu asesor de compras"}
        </span>
      </button>

      {showInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-3 text-center">
              ¿Sobre qué producto tienes preguntas?
            </h3>
            
            {/* Voice Recording Button */}
            <div className="flex justify-center mb-4">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all
                  ${isRecording 
                    ? "bg-red-500 text-white hover:bg-red-600 animate-pulse" 
                    : "bg-blue-500 text-white hover:bg-blue-600"
                  }
                `}
              >
                {isRecording ? (
                  <>
                    <MicOff className="size-4" />
                    Detener grabación
                  </>
                ) : (
                  <>
                    <Mic className="size-4" />
                    Grabar pregunta
                  </>
                )}
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (value.trim()) handleGeminiQueryWrapper(value);
              }}
            >
              <input
                autoFocus
                type="text"
                className="w-full border border-border rounded-xl px-4 py-2 mb-4 focus:ring-2 focus:ring-primary outline-none text-foreground bg-background"
                placeholder={isRecording ? "Escuchando..." : "Escribe tu pregunta o usa el micrófono"}
                value={value}
                onChange={e => setValue(e.target.value)}
                disabled={isRecording}
              />
              <button
                disabled={!value.trim() || isRecording}
                className="w-full bg-primary text-primary-foreground font-medium rounded-lg py-2 flex justify-center items-center gap-2 hover:bg-primary/90 transition disabled:opacity-50"
                type="submit"
              >
                <Send className="size-4" />
                Consultar
              </button>
            </form>
            
            <button
              type="button"
              className="absolute top-3 right-5 text-xl text-muted-foreground hover:text-primary transition"
              onClick={() => {
                setShowInput(false);
                stopRecording();
                setValue("");
              }}
              aria-label="Cerrar"
            >×</button>

            {SpeechRecognition ? null : (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Tu navegador no soporta reconocimiento de voz. Puedes escribir tu pregunta.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAdvisorButton;
