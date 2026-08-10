import { computeElapsed, formatElapsed } from "../utils/formatTime";

const computeDuration = (startAt) => computeElapsed(startAt);

/**
 * @description Success screen shown after the last question. "View Interview Report"
 * triggers report generation (POST complete) with a loading state.
 */
const InterviewCompletion = ({ session, generating = false, onViewReport }) => {
    const answeredCount = (session?.questions || []).filter(q => q.status === "answered").length;
    const totalQuestions = session?.totalQuestions ?? answeredCount;
    const duration = computeDuration(session?.createdAt);

    return (
        <div className="mock-completion">
            <div className="mock-completion__emoji">🎉</div>
            <h1 className="mock-completion__title">Interview Completed</h1>
            <p className="mock-completion__subtitle">You've completed your AI Mock Interview.</p>

            <div className="mock-completion__stats">
                <div className="mock-completion__stat">
                    <span className="mock-completion__stat-value">{answeredCount} / {totalQuestions}</span>
                    <span className="mock-completion__stat-label">Questions answered</span>
                </div>
                <div className="mock-completion__divider" />
                <div className="mock-completion__stat">
                    <span className="mock-completion__stat-value">{formatElapsed(duration)}</span>
                    <span className="mock-completion__stat-label">Interview duration</span>
                </div>
            </div>

            <button
                type="button"
                className="button primary-button mock-completion__cta"
                onClick={onViewReport}
                disabled={generating}
            >
                {generating && <span className="mock-completion__spinner" />}
                {generating ? "Generating your interview report..." : "View Interview Report"}
            </button>

            {generating && (
                <p className="mock-completion__note">The AI is reviewing every answer to build your full report.</p>
            )}
        </div>
    );
};

export default InterviewCompletion;
