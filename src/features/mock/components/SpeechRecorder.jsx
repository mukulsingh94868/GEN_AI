import { useEffect } from "react";
import { useToast } from "../../../components/ui/toast.context";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import AnswerTranscript from "./AnswerTranscript";

const SPEECH_ERROR_MESSAGES = {
    "not-allowed": "Microphone access was blocked. Allow the microphone in your browser, then try again — or type your answer instead.",
    "service-not-allowed": "Speech recognition isn't allowed in this browser.",
    "network": "Speech recognition failed due to a network issue.",
    "no-speech": "No speech was detected. Make sure your microphone is unmuted and you're speaking near it, then try again.",
    "audio-capture": "No microphone was found on this device.",
    "aborted": "Speech recognition was stopped.",
};

/**
 * @description Voice controls + live transcript + submit. Speech is never auto-submitted —
 * the user must explicitly press "Submit Answer". Falls back to a plain textarea
 * when the browser does not support the Web Speech API.
 *
 * props:
 *  - initialTranscript : prefill (used when resuming an answered question)
 *  - disabled          : disable all controls while the AI evaluates
 *  - onListeningChange : reports listening state up so the orb can react
 *  - onSubmit(answer)  : called with the final transcript
 */
const SpeechRecorder = ({ initialTranscript = "", disabled = false, onListeningChange, onSubmit }) => {
    const toast = useToast();

    const {
        supported,
        isListening,
        transcript,
        interim,
        start,
        stop,
        reset,
        setTranscript,
    } = useSpeechRecognition({ initialTranscript, onError: handleSpeechError });

    useEffect(() => {
        onListeningChange?.(isListening);
    }, [isListening, onListeningChange]);

    function handleSpeechError(event) {
        toast(SPEECH_ERROR_MESSAGES[event.error] || "Speech recognition failed. You can type your answer instead.", { type: "error" });
    }

    const handleStart = () => {
        if (disabled || !supported) return;
        start();
    };

    const handleStop = () => {
        stop();
    };

    const handleClear = () => {
        reset();
    };

    const handleSubmit = () => {
        if (disabled) return;

        const answer = transcript.trim();

        if (!answer) {
            toast("Please speak or type an answer before submitting.", { type: "error" });
            return;
        }

        onSubmit(answer);
    };

    if (!supported) {
        return (
            <div className="speech-recorder speech-recorder--fallback">
                <p className="speech-recorder__notice">
                    Speech-to-text isn't supported in this browser, so please type your answer below.
                </p>
                <AnswerTranscript value={transcript} onChange={setTranscript} />
                <button
                    type="button"
                    className="button primary-button speech-recorder__submit"
                    onClick={handleSubmit}
                    disabled={disabled}
                >
                    Submit Answer
                </button>
            </div>
        );
    }

    return (
        <div className={`speech-recorder ${isListening ? "speech-recorder--listening" : ""}`}>
            <div className="speech-recorder__controls">
                {isListening ? (
                    <button
                        type="button"
                        className="button speech-btn speech-btn--stop"
                        onClick={handleStop}
                        disabled={disabled}
                    >
                        <span className="speech-btn__dot" />
                        Stop
                    </button>
                ) : (
                    <button
                        type="button"
                        className="button speech-btn speech-btn--start"
                        onClick={handleStart}
                        disabled={disabled}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                        Start Speaking
                    </button>
                )}
                <button type="button" className="button ghost-button" onClick={handleClear} disabled={disabled}>
                    Clear
                </button>
            </div>

            {isListening && (
                <p className="speech-recorder__listening">
                    <span className="speech-recorder__pulse" />
                    Listening... speak your answer
                </p>
            )}

            <AnswerTranscript value={transcript} onChange={setTranscript} interim={isListening ? interim : ""} />

            <button
                type="button"
                className="button primary-button speech-recorder__submit"
                onClick={handleSubmit}
                disabled={disabled}
            >
                Submit Answer
            </button>
        </div>
    );
};

export default SpeechRecorder;
