/**
 * @description Question progress indicator: "Question X of Y" plus a progress bar.
 * Uses the backend's current question index as the source of truth.
 */
const InterviewProgress = ({ current, total }) => {
    const safeTotal = total > 0 ? total : 1;
    const safeCurrent = Math.min(Math.max(current, 0), safeTotal - 1);
    const percent = Math.min(100, Math.round(((safeCurrent + 1) / safeTotal) * 100));

    return (
        <div className="mock-progress">
            <div className="mock-progress__meta">
                <span className="mock-progress__label">Question {safeCurrent + 1} of {safeTotal}</span>
                <span className="mock-progress__pct">{percent}%</span>
            </div>
            <div className="mock-progress__bar">
                <span className="mock-progress__fill" style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
};

export default InterviewProgress;
