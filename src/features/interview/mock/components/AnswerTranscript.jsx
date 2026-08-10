/**
 * @description Editable live transcript shown to the user. Bound to the speech
 * recognition transcript so recognized speech streams in, while remaining editable.
 */
const AnswerTranscript = ({ value, onChange, interim = "", placeholder }) => {
    return (
        <div className="answer-transcript">
            <div className="answer-transcript__label">You</div>
            <textarea
                className="answer-transcript__textarea"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Your answer will appear here as you speak or type..."}
                rows={5}
            />
            {interim && (
                <p className="answer-transcript__interim">
                    <span className="answer-transcript__interim-dot" />
                    {interim}
                </p>
            )}
        </div>
    );
};

export default AnswerTranscript;
