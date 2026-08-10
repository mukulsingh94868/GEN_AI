import { useCallback, useEffect, useRef, useState } from "react";

const getSpeechRecognition = () => {
    if (typeof window === "undefined") return null;

    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

/**
 * @description Wraps the browser Web Speech API (SpeechRecognition) for real-time speech-to-text.
 * Never auto-submits — the caller controls when to read the final transcript.
 *
 * A fresh SpeechRecognition instance is created on every start(): Chrome silently stops
 * processing on an instance after an error/end, so reusing one makes the microphone
 * appear dead. Old instances are ignored via a ref-check so late events can't
 * corrupt the state of the current session.
 */
export const useSpeechRecognition = ({ onError, lang = "en-US", initialTranscript = "" } = {}) => {
    const [supported] = useState(() => Boolean(getSpeechRecognition()));
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState(initialTranscript);
    const [interim, setInterim] = useState("");

    const recognitionRef = useRef(null);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    const buildRecognition = useCallback(() => {
        const Recognition = getSpeechRecognition();

        if (!Recognition) return null;

        const recognition = new Recognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang;

        // Only the most recently created instance may update state.
        const isCurrent = () => recognitionRef.current === recognition;

        recognition.onstart = () => {
            if (!isCurrent()) return;
            setIsListening(true);
            setInterim("");
        };

        recognition.onresult = (event) => {
            if (!isCurrent()) return;

            let finalText = "";
            let interimText = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalText += result[0].transcript;
                } else {
                    interimText += result[0].transcript;
                }
            }

            if (finalText.trim()) {
                setTranscript(prev => {
                    const next = (prev ? prev.trim() + " " : "") + finalText.trim();
                    return next.replace(/\s+/g, " ");
                });
            }

            setInterim(interimText);
        };

        recognition.onerror = (event) => {
            if (!isCurrent()) return;
            setIsListening(false);
            setInterim("");
            onErrorRef.current?.(event);
        };

        recognition.onend = () => {
            if (!isCurrent()) return;
            setIsListening(false);
            setInterim("");
        };

        return recognition;
    }, [lang]);

    const start = useCallback(() => {
        if (!supported || isListening) return;

        const recognition = buildRecognition();

        if (!recognition) return;

        recognitionRef.current = recognition;

        try {
            recognition.start();
        } catch {
            // start() can throw if the instance isn't ready yet — a fresh one is
            // created on the next attempt.
            setIsListening(false);
        }
    }, [supported, isListening, buildRecognition]);

    const stop = useCallback(() => {
        const recognition = recognitionRef.current;

        if (!recognition) return;

        try {
            recognition.stop();
        } catch {
            // ignore
        }
        setIsListening(false);
    }, []);

    const reset = useCallback(() => {
        stop();
        setTranscript("");
        setInterim("");
    }, [stop]);

    // Abort the active recognizer on unmount (also covers StrictMode remounts).
    useEffect(() => {
        return () => {
            const recognition = recognitionRef.current;

            if (recognition) {
                try {
                    recognition.abort();
                } catch {
                    // ignore
                }
            }
        };
    }, []);

    return { supported, isListening, transcript, interim, start, stop, reset, setTranscript };
};
