/**
 * @description Displays the current AI interviewer question prominently.
 */
const InterviewQuestion = ({ question, index, total, type }) => {
    return (
        <section className="mock-question">
            {(index != null && total) && (
                <span className="mock-question__tag">
                    {type ? `${type} · ` : ""}Question {index} of {total}
                </span>
            )}
            <h2 className="mock-question__text">{question || "..."}</h2>
            <p className="mock-question__hint">Take your time to think about your answer.</p>
        </section>
    );
};

export default InterviewQuestion;
