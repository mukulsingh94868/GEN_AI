import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../auth/components/Navbar.jsx";
import { useMockInterview } from "../hooks/useMockInterview.js";
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

const TYPE_ICONS = {
    technical: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
    ),
    behavioral: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
    ),
    mixed: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    ),
};

const MockInterviewList = () => {
    const navigate = useNavigate();
    const { getSessions } = useMockInterview();

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            const data = await getSessions();

            if (cancelled) return;

            setSessions(data);
            setLoading(false);
        };

        load();

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <main className="mock-loading">
                <div className="loader-spinner" />
                <h1>Loading your mock interviews...</h1>
            </main>
        );
    }

    return (
        <div className="mock-list-page">
            <Navbar />

            <main className="mock-list">
                <div className='interview-back-row'>
                    <button
                        type='button'
                        onClick={() => navigate('/')}
                        className='interview-back-btn'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                        Back
                    </button>
                </div>

                <header className="mock-list__header">
                    <span className="mock-list__badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                        AI Mock Interview History
                    </span>
                    <h1>My <span className="highlight">Mock Interviews</span></h1>
                    <p>Review all your practice interviews and revisit the full AI report of each session.</p>
                </header>

                {sessions.length === 0 ? (
                    <div className="mock-list__empty">
                        <span className="mock-list__empty-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                        </span>
                        <h2>No mock interviews yet</h2>
                        <p>Start your first AI mock interview to see your reports here.</p>
                        <button
                            type="button"
                            className="button primary-button"
                            onClick={() => navigate("/mock-interview")}
                        >
                            Start a Mock Interview
                        </button>
                    </div>
                ) : (
                    <div className="mock-list__grid">
                        {sessions.map(session => {
                            const status = STATUS_META[session.status] || STATUS_META.pending;
                            const type = TYPE_LABELS[session.interviewType] || session.interviewType || "—";
                            const difficulty = DIFFICULTY_LABELS[session.difficulty] || session.difficulty || "—";

                            return (
                                <button
                                    type="button"
                                    key={session._id}
                                    className="mock-list-card"
                                    onClick={() => navigate(`/mock-interviews/${session._id}`)}
                                >
                                    <div className="mock-list-card__top">
                                        <span className="mock-list-card__type">{TYPE_ICONS[session.interviewType] || null}{type}</span>
                                        <span className={`mock-list-card__status ${status.className}`}>{status.label}</span>
                                    </div>

                                    <h3 className="mock-list-card__title">
                                        {session.interviewReport?.title || "Untitled Position"}
                                    </h3>

                                    <div className="mock-list-card__meta">
                                        <span className="mock-list-card__meta-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" /><path d="M12 7v5l3 3" /></svg>
                                            {session.totalQuestions || 0} questions
                                        </span>
                                        <span className="mock-list-card__meta-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v4" /><path d="M18 2v4" /><path d="M3 10h18" /><path d="M21 6v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                            {new Date(session.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="mock-list-card__difficulty">
                                        <span className={`mock-list-card__difficulty-tag difficulty--${session.difficulty || "medium"}`}>
                                            {difficulty}
                                        </span>
                                    </div>

                                    <div className="mock-list-card__footer">
                                        <span className="mock-list-card__hint">View report</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MockInterviewList;
