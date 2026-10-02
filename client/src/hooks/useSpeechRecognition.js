import { useState, useEffect, useRef, useCallback } from 'react';

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(Boolean(SpeechRecognitionAPI));

  const recognitionRef = useRef(null);
  const onResultCallbackRef = useRef(null);

  useEffect(() => {
    setIsSupported(Boolean(SpeechRecognitionAPI));
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping recognition:', err);
      }
      setIsListening(false);
    }
  }, []);

  const startListening = useCallback(
    (options = {}) => {
      setError(null);

      if (!SpeechRecognitionAPI) {
        const errorMsg =
          'Speech recognition is not supported in this browser. Please try Chrome, Edge, or a compatible browser.';
        setError(errorMsg);
        if (options.onError) options.onError(errorMsg);
        return false;
      }

      // If already running, stop first
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      try {
        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;

        recognition.lang = options.language || 'en-IN';
        recognition.continuous = options.continuous ?? false;
        recognition.interimResults = options.interimResults ?? true;
        recognition.maxAlternatives = 1;

        if (options.onResult) {
          onResultCallbackRef.current = options.onResult;
        }

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
          setInterimTranscript('');
          if (options.onStart) options.onStart();
        };

        recognition.onresult = (event) => {
          let currentInterim = '';
          let finalTranscriptChunk = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPiece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscriptChunk += transcriptPiece;
            } else {
              currentInterim += transcriptPiece;
            }
          }

          setInterimTranscript(currentInterim);

          if (finalTranscriptChunk) {
            setTranscript((prev) => {
              const updated = prev ? `${prev} ${finalTranscriptChunk.trim()}` : finalTranscriptChunk.trim();
              if (onResultCallbackRef.current) {
                onResultCallbackRef.current(updated, finalTranscriptChunk.trim());
              }
              return updated;
            });
          }
        };

        recognition.onerror = (event) => {
          let userMessage = 'An error occurred during speech recognition.';

          switch (event.error) {
            case 'not-allowed':
            case 'service-not-allowed':
              userMessage =
                'Microphone access is required for voice input. Please allow microphone access in your browser settings.';
              break;
            case 'no-speech':
              userMessage = 'No speech detected. Please check your microphone and try speaking again.';
              break;
            case 'network':
              userMessage = 'Network speech recognition error. Please check your internet connection.';
              break;
            case 'audio-capture':
              userMessage = 'No microphone was detected. Please ensure a microphone is connected.';
              break;
            case 'aborted':
              userMessage = null; // intentional abort
              break;
            default:
              userMessage = `Speech recognition error: ${event.error}`;
          }

          if (userMessage) {
            setError(userMessage);
            if (options.onError) options.onError(userMessage);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
          if (options.onEnd) options.onEnd();
        };

        recognition.start();
        return true;
      } catch (err) {
        console.error('Failed to initiate speech recognition:', err);
        setError('Could not start microphone. Please check browser permissions.');
        setIsListening(false);
        return false;
      }
    },
    []
  );

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  };
};

export default useSpeechRecognition;
