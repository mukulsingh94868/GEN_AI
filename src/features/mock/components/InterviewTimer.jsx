import { useEffect, useState } from "react";
import { computeElapsed, formatElapsed } from "../utils/formatTime";

/**
 * @description Interview elapsed timer. Self-contained so a per-second tick only re-renders
 * this component, never the whole page. Elapsed time is derived from the backend
 * `createdAt`, so it stays correct when a session is resumed later.
 */
const InterviewTimer = ({ startAt }) => {
    const [elapsed, setElapsed] = useState(() => computeElapsed(startAt));

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(computeElapsed(startAt));
        }, 1000);

        return () => clearInterval(interval);
    }, [startAt]);

    return (
        <span className="mock-timer">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            <span className="mock-timer__value">{formatElapsed(elapsed)}</span>
        </span>
    );
};

export default InterviewTimer;
