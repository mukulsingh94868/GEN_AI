const scoreClass = (score) => {
    if (score >= 80) return "score--high";
    if (score >= 60) return "score--mid";
    return "score--low";
};

const ringColor = (score) => {
    if (score >= 80) return "#34d399";
    if (score >= 60) return "#fbbf24";
    return "#fb7185";
};

const READINESS_LABELS = {
    low: "Low",
    medium: "Medium",
    high: "High",
};

const SCORE_CARDS = [
    { key: "technicalScore", label: "Technical Score" },
    { key: "communicationScore", label: "Communication Score" },
    { key: "problemSolvingScore", label: "Problem Solving Score" },
    { key: "confidenceScore", label: "Confidence Score" },
];

const ReportSectionList = ({ title, items, variant }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className={`report-list report-list--${variant}`}>
            <h3 className="report-list__title">{title}</h3>
            <ul className="report-list__items">
                {items.map((item, i) => (
                    <li key={i}>
                        <span className="report-list__bullet" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

/**
 * @description Polished final AI interview report with score cards, progress bars
 * and structured feedback sections.
 */
const InterviewReport = ({ report, onBack, onNew }) => {
    if (!report) return null;

    const overall = Math.round(Number(report.overallScore) || 0);
    const readiness = READINESS_LABELS[report.hiringReadiness] || report.hiringReadiness || "—";

    return (
        <div className="mock-report">
            <header className="mock-report__header">
                <div>
                    <span className="mock-report__badge">Final Report</span>
                    <h1 className="mock-report__title">AI Mock Interview Report</h1>
                    <p className="mock-report__subtitle">A detailed breakdown of your interview performance.</p>
                </div>
                <span className={`mock-report__readiness readiness--${report.hiringReadiness || "low"}`}>
                    Hiring Readiness: <b>{readiness}</b>
                </span>
            </header>

            <div className="mock-report__summary-card">
                <div className="mock-report__overall">
                    <div
                        className={`report-overall__ring ${scoreClass(overall)}`}
                        style={{ background: `conic-gradient(${ringColor(overall)} ${overall * 3.6}deg, rgba(148,163,184,0.12) 0deg)` }}
                    >
                        <div className="report-overall__inner">
                            <span className="report-overall__value">{overall}</span>
                            <span className="report-overall__pct">%</span>
                        </div>
                    </div>
                    <div className="mock-report__overall-text">
                        <h2>Overall Score</h2>
                        <p>{report.summary || "You did a great job in this interview. Keep practicing to sharpen your answers."}</p>
                    </div>
                </div>
            </div>

            <div className="report-score-grid">
                {SCORE_CARDS.map(card => {
                    const score = Math.round(Number(report[card.key]) || 0);
                    return (
                        <div key={card.key} className="report-score-card">
                            <div className="report-score-card__head">
                                <span className="report-score-card__label">{card.label}</span>
                                <span className={`report-score-card__value ${scoreClass(score)}`}>{score}%</span>
                            </div>
                            <div className="report-score-card__bar">
                                <span
                                    className={`report-score-card__fill ${scoreClass(score)}`}
                                    style={{ width: `${score}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="report-lists">
                <ReportSectionList title="Strengths" items={report.strengths} variant="strengths" />
                <ReportSectionList title="Weaknesses" items={report.weaknesses} variant="weaknesses" />
                <ReportSectionList title="Recommendations" items={report.recommendations} variant="recommendations" />
            </div>

            <div className="mock-report__actions">
                <button type="button" className="button primary-button" onClick={onBack}>
                    Back to Dashboard
                </button>
                {onNew && (
                    <button type="button" className="button ghost-button" onClick={onNew}>
                        Start a New Mock Interview
                    </button>
                )}
            </div>
        </div>
    );
};

export default InterviewReport;
