import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Navbar from "../../auth/components/Navbar.jsx";
import { useMockInterview } from "../hooks/useMockInterview.js";
import InterviewReport from "../components/InterviewReport";
import "../style/mockInterviewList.scss";

const STATUS_META = {
    pending: { label: "Pending", className: "status--pending" },
    in_progress: { label: "In Progress", className: "status--in-progress" },
    completed: { label: "Completed", className: "status--completed" },
    abandoned: { label: "Abandoned", className: "status--abandoned" },
};

const TYPE_LABELS = {
    technical: "Technical",
    behavioral: "Behavioral",
    mixed: "Mixed",
};

const DIFFICULTY_LABELS = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
};

const scoreClass = (score) => {
    if (score >= 80) return "score--high";
    if (score >= 60) return "score--mid";
    return "score--low";
};

const MockInterviewDetail = () => {
    const { mockInterviewId } = useParams();
    const navigate = useNavigate();
    const { getSession } = useMockInterview();

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setLoadError(false);

            const fetched = await getSession(mockInterviewId);

            if (cancelled) return;

            if (!fetched) {
                setLoadError(true);
                setLoading(false);
                return;
            }

            setSession(fetched);
            setLoading(false);
        };

        load();

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mockInterviewId]);

    if (loading) {
        return (
            <main className="mock-loading">
                <div className="loader-spinner" />
                <h1>Loading mock interview report...</h1>
            </main>
        );
    }

    if (loadError || !session) {
        return (
            <main className="mock-loading">
                <span className="mock-loading__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                </span>
                <h1>Interview not found</h1>
                <p>This interview session is unavailable.</p>
                <button type="button" className="button primary-button" onClick={() => navigate("/mock-interviews")}>
                    Back to Mock Interviews
                </button>
            </main>
        );
    }

    const report = session.report;
    const status = STATUS_META[session.status] || STATUS_META.pending;
    const title = session.interviewReport?.title || "Untitled Position";
    const type = TYPE_LABELS[session.interviewType] || session.interviewType || "—";
    const difficulty = DIFFICULTY_LABELS[session.difficulty] || session.difficulty || "—";
    const answeredQuestions = (session.questions || []).filter(q => q.status === "answered");

    return (
        <div className="mock-detail-page">
            <Navbar />

            <main className="mock-detail">
                <div className='interview-back-row'>
                    <button
                        type='button'
                        onClick={() => navigate('/mock-interviews')}
                        className='interview-back-btn'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                        All Mock Interviews
                    </button>
                </div>

                <header className="mock-detail__header">
                    <div>
                        <span className="mock-detail__badge">Mock Interview Session</span>
                        <h1>{title}</h1>
                    </div>
                    <span className={`mock-detail__status ${status.className}`}>{status.label}</span>
                </header>

                <div className="mock-detail__facts">
                    <div className="mock-detail__fact">
                        <span className="mock-detail__fact-label">Interview Type</span>
                        <b>{type}</b>
                    </div>
                    <div className="mock-detail__fact">
                        <span className="mock-detail__fact-label">Difficulty</span>
                        <b>{difficulty}</b>
                    </div>
                    <div className="mock-detail__fact">
                        <span className="mock-detail__fact-label">Total Questions</span>
                        <b>{session.totalQuestions || 0}</b>
                    </div>
                    <div className="mock-detail__fact">
                        <span className="mock-detail__fact-label">Questions Answered</span>
                        <b>{answeredQuestions.length}</b>
                    </div>
                    <div className="mock-detail__fact">
                        <span className="mock-detail__fact-label">Created</span>
                        <b>{new Date(session.createdAt).toLocaleDateString()}</b>
                    </div>
                </div>

                {report ? (
                    <>
                        <InterviewReport
                            report={report}
                            onBack={() => navigate("/mock-interviews")}
                            onNew={() => navigate("/mock-interview")}
                        />

                        {answeredQuestions.length > 0 && (
                            <section className="mock-detail__answers">
                                <header className="mock-detail__answers-header">
                                    <h2>Question &amp; Answer Review</h2>
                                    <span className="mock-detail__answers-count">{answeredQuestions.length} answer{answeredQuestions.length > 1 ? "s" : ""}</span>
                                </header>
                                <div className="mock-detail__answers-list">
                                    {answeredQuestions.map((question, i) => {
                                        const score = Math.round(Number(question.evaluation?.score) || 0);
                                        return (
                                            <article className="mock-answer-card" key={i}>
                                                <div className="mock-answer-card__head">
                                                    <span className="mock-answer-card__index">Q{i + 1}</span>
                                                    <span className={`mock-answer-card__score ${scoreClass(score)}`}>{score}%</span>
                                                </div>
                                                <h3 className="mock-answer-card__question">{question.question}</h3>
                                                {question.answer && (
                                                    <div className="mock-answer-card__block">
                                                        <span className="mock-answer-card__label">Your Answer</span>
                                                        <p>{question.answer}</p>
                                                    </div>
                                                )}
                                                {question.evaluation?.feedback && (
                                                    <div className="mock-answer-card__block">
                                                        <span className="mock-answer-card__label">AI Feedback</span>
                                                        <p>{question.evaluation.feedback}</p>
                                                    </div>
                                                )}
                                                {question.evaluation?.strengths?.length > 0 && (
                                                    <div className="mock-answer-card__block">
                                                        <span className="mock-answer-card__label mock-answer-card__label--strengths">Strengths</span>
                                                        <ul className="mock-answer-card__list">
                                                            {question.evaluation.strengths.map((item, j) => <li key={j}>{item}</li>)}
                                                        </ul>
                                                    </div>
                                                )}
                                                {question.evaluation?.weaknesses?.length > 0 && (
                                                    <div className="mock-answer-card__block">
                                                        <span className="mock-answer-card__label mock-answer-card__label--weaknesses">To Improve</span>
                                                        <ul className="mock-answer-card__list">
                                                            {question.evaluation.weaknesses.map((item, j) => <li key={j}>{item}</li>)}
                                                        </ul>
                                                    </div>
                                                )}
                                            </article>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <div className="mock-detail__no-report">
                        <span className="mock-detail__no-report-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        </span>
                        <h2>{session.status === "abandoned" ? "This interview was ended" : "Report not ready yet"}</h2>
                        <p>
                            {session.status === "abandoned"
                                ? "This interview was abandoned, so no report was generated."
                                : "The final AI report is generated after you answer all the questions. Resume the interview to continue."}
                        </p>
                        <div className="mock-detail__no-report-actions">
                            {session.status === "in_progress" || session.status === "pending" ? (
                                <button
                                    type="button"
                                    className="button primary-button"
                                    onClick={() => navigate(`/mock-interview/${session._id}`)}
                                >
                                    Resume Interview
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="button primary-button"
                                    onClick={() => navigate("/mock-interview")}
                                >
                                    Start a New Interview
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MockInterviewDetail;
