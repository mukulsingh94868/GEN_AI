import { useCallback, useRef, useState } from "react";
import { ToastContext } from "./toast.context";
import "./toast.scss";

let toastId = 0;

const TOAST_ICONS = {
    success: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    ),
    error: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
    ),
    info: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
    ),
}

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef(new Map());

    const dismiss = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
        const timer = timersRef.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(id);
        }
    }, []);

    const push = useCallback((message, type = "info", duration = 4000) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            const timer = setTimeout(() => dismiss(id), duration);
            timersRef.current.set(id, timer);
        }

        return id;
    }, [dismiss]);

    const toast = useCallback((message, options = {}) => {
        return push(message, options.type || "info", options.duration ?? 4000);
    }, [push]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="toast-viewport" aria-live="polite">
                {toasts.map(t => (
                    <div key={t.id} className={`toast toast--${t.type}`}>
                        <span className="toast__icon">{TOAST_ICONS[t.type] || TOAST_ICONS.info}</span>
                        <span className="toast__message">{t.message}</span>
                        <button
                            type="button"
                            className="toast__close"
                            onClick={() => dismiss(t.id)}
                            aria-label="Dismiss notification"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
