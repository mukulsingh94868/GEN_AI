const scoreClass = (score) => {
    if (score >= 80) return "score--high";
    if (score >= 60) return "score--mid";
    return "score--low";
};

/**
 * @description Compact per-answer AI feedback shown between questions.
 */
const EvaluationFeedback = ({ evaluation, onClose }) => {
    if (!evaluation) return null;

    const score = Math.round(Number(evaluation.score) || 0);
    const strengths = evaluation.strengths || [];
    const weaknesses = evaluation.weaknesses || [];

    return (
        <section className="eval-feedback">
            <div className="eval-feedback__head">
                <div className={`eval-feedback__score ${scoreClass(score)}`}>
                    <span className="eval-feedback__score-value">{score}</span>
                    <span className="eval-feedback__score-label">Answer score</span>
                </div>
                <div className="eval-feedback__head-actions">
                    <span className="eval-feedback__badge">AI Feedback</span>
                    {onClose && (
                        <button type="button" className="eval-feedback__close" onClick={onClose} aria-label="Dismiss feedback">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    )}
                </div>
            </div>

            {evaluation.feedback && <p className="eval-feedback__text">{evaluation.feedback}</p>}

            {(strengths.length > 0 || weaknesses.length > 0) && (
                <div className="eval-feedback__lists">
                    {strengths.length > 0 && (
                        <div className="eval-feedback__list eval-feedback__list--strengths">
                            <span className="eval-feedback__list-label">Strengths</span>
                            <ul>
                                {strengths.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}
                    {weaknesses.length > 0 && (
                        <div className="eval-feedback__list eval-feedback__list--weaknesses">
                            <span className="eval-feedback__list-label">To Improve</span>
                            <ul>
                                {weaknesses.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default EvaluationFeedback;
