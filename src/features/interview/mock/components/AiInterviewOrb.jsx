/**
 * @description Animated AI interviewer orb. Pure visual — state is driven by the parent.
 * state: "idle" | "listening" | "evaluating"
 */
const AiInterviewOrb = ({ state = "idle" }) => {
    const className = [
        "ai-orb",
        state === "listening" ? "ai-orb--listening" : "",
        state === "evaluating" ? "ai-orb--evaluating" : "",
    ].filter(Boolean).join(" ");

    return (
        <div className={className} aria-hidden="true">
            <span className="ai-orb__ring ai-orb__ring--outer" />
            <span className="ai-orb__ring ai-orb__ring--mid" />
            <span className="ai-orb__ring ai-orb__ring--inner" />
            <span className="ai-orb__core" />
        </div>
    );
};

export default AiInterviewOrb;
