import { useState, useCallback, useEffect, useRef } from 'react';

interface UseVoiceInputOptions {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  language?: string;
}

// Extend Window interface for Speech Recognition
interface IWindow extends Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

export const useVoiceInput = (options: UseVoiceInputOptions = {}) => {
  const { continuous = false, language = 'en-US' } = options;

  // Store callbacks in refs to avoid dependency issues
  const onResultRef = useRef(options.onResult);
  const onErrorRef = useRef(options.onError);

  // Update refs when callbacks change
  useEffect(() => {
    onResultRef.current = options.onResult;
    onErrorRef.current = options.onError;
  }, [options.onResult, options.onError]);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldBeListeningRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const windowWithSpeech = window as unknown as IWindow;
      const SpeechRecognitionAPI = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognitionAPI);

      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = continuous;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = language;

        recognitionRef.current.onstart = () => {
          console.log('Voice recognition started');
          setIsListening(true);
        };

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const current = event.resultIndex;
          const transcriptResult = event.results[current][0].transcript;
          setTranscript(transcriptResult);

          if (event.results[current].isFinal && onResultRef.current) {
            onResultRef.current(transcriptResult);
            setTranscript(''); // Clear transcript after processing final result
          }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);

          const errorMessages: Record<string, string> = {
            'network': 'Network error. Please check your internet connection.',
            'no-speech': 'No speech detected. Please try speaking again.',
            'audio-capture': 'No microphone found. Please ensure your microphone is connected.',
            'not-allowed': 'Microphone permission denied. Please allow microphone access.',
            'aborted': 'Speech recognition aborted.',
            'service-not-allowed': 'Speech recognition service not available.'
          };

          const errorMessage = errorMessages[event.error] || `Speech recognition error: ${event.error}`;

          if (onErrorRef.current) {
            onErrorRef.current(errorMessage);
          }

          // Auto-restart on network error if we should be listening
          if (event.error === 'network' && shouldBeListeningRef.current) {
            console.log('Attempting to restart voice recognition after network error...');
            if (restartTimeoutRef.current) {
              clearTimeout(restartTimeoutRef.current);
            }
            restartTimeoutRef.current = setTimeout(() => {
              if (shouldBeListeningRef.current && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (error) {
                  console.error('Failed to restart voice recognition:', error);
                }
              }
            }, 1000);
          } else {
            setIsListening(false);
            shouldBeListeningRef.current = false;
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Voice recognition ended');
          setIsListening(false);

          // Auto-restart if continuous mode and we should still be listening
          if (continuous && shouldBeListeningRef.current) {
            if (restartTimeoutRef.current) {
              clearTimeout(restartTimeoutRef.current);
            }
            restartTimeoutRef.current = setTimeout(() => {
              if (shouldBeListeningRef.current && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (error) {
                  console.error('Failed to restart voice recognition:', error);
                  setIsListening(false);
                  shouldBeListeningRef.current = false;
                }
              }
            }, 100);
          }
        };
      }
    }

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [continuous, language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('');
        shouldBeListeningRef.current = true;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        if (onErrorRef.current) {
          onErrorRef.current('Failed to start voice recognition. Please try again.');
        }
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    shouldBeListeningRef.current = false;
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
};

