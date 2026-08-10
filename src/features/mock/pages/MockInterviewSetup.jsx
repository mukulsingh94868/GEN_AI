import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Navbar from "../../auth/components/Navbar.jsx";
import { useInterview } from "../../interview/hooks/useInterview.js";
import { useMockInterview } from "../hooks/useMockInterview.js";
import { useToast } from "../../../components/ui/toast.context.js";
import "../style/mockInterview.scss";

const INTERVIEW_TYPES = [
    {
        value: "technical",
        label: "Technical",
        description: "Coding & system design",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>),
    },
    {
        value: "behavioral",
        label: "Behavioral",
        description: "STAR stories & soft skills",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>),
    },
    {
        value: "mixed",
        label: "Mixed",
        description: "A balance of both",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>),
    },
];

const DIFFICULTIES = [
    { value: "easy", label: "Easy", hint: "Foundational questions" },
    { value: "medium", label: "Medium", hint: "Balanced difficulty" },
    { value: "hard", label: "Hard", hint: "Challenging, deep questions" },
];

const MockInterviewSetup = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const toast = useToast();

    const { reports, loading: reportsLoading, getReports } = useInterview();
    const { startMockInterview, getSessions } = useMockInterview();

    const [selectedReportId, setSelectedReportId] = useState(searchParams.get("reportId") || "");
    const [interviewType, setInterviewType] = useState("mixed");
    const [difficulty, setDifficulty] = useState("medium");
    const [totalQuestions, setTotalQuestions] = useState(5);
    const [starting, setStarting] = useState(false);
    const [unfinished, setUnfinished] = useState(null);

    useEffect(() => {
        const findUnfinished = async () => {
            const sessions = await getSessions();
            const running = sessions.find(s => s.status === "pending" || s.status === "in_progress");
            setUnfinished(running || null);
        };

        findUnfinished();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStart = async () => {
        if (!selectedReportId) {
            toast("Please select an interview report first.", { type: "error" });
            return;
        }

        if (!reports.some(r => r._id === selectedReportId)) {
            toast("Please select a valid interview report.", { type: "error" });
            return;
        }

        setStarting(true);
        const session = await startMockInterview({
            interviewReportId: selectedReportId,
            interviewType,
            difficulty,
            totalQuestions,
        });
        console.log('session123', session);
        setStarting(false);

        if (session) {
            navigate(`/mock-interview/${session._id}`);
        }
    };

    const decrementCount = () => setTotalQuestions(prev => Math.max(1, prev - 1));
    const incrementCount = () => setTotalQuestions(prev => Math.min(20, prev + 1));

    return (
        <div className="mock-setup-page">
            <Navbar />

            <main className="mock-setup">
                <header className="mock-setup__header">
                    <span className="mock-setup__badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                        AI Mock Interview
                    </span>
                    <h1>Practice with a <span className="highlight">Live AI Interviewer</span></h1>
                    <p>Configure your interview and face a realistic, voice-driven mock interview with instant AI feedback.</p>
                </header>

                {unfinished && (
                    <div className="mock-resume-banner">
                        <div className="mock-resume-banner__text">
                            <b>You have an unfinished interview.</b>
                            <span>Pick up where you left off instead of starting a new one.</span>
                        </div>
                        <button
                            type="button"
                            className="button primary-button"
                            onClick={() => navigate(`/mock-interview/${unfinished._id}`)}
                        >
                            Resume Interview
                        </button>
                    </div>
                )}

                <div className="mock-setup__card">

                    {/* Report / Job */}
                    <div className="mock-field">
                        <label className="mock-field__label" htmlFor="mockReport">
                            Interview Report / Job
                            <span className="mock-field__required">Required</span>
                        </label>
                        <div className="mock-select-wrap">
                            <select
                                id="mockReport"
                                className="mock-select"
                                value={selectedReportId}
                                onChange={(e) => setSelectedReportId(e.target.value)}
                                disabled={reportsLoading}
                            >
                                <option value="">Select an interview report...</option>
                                {reports.map(report => (
                                    <option key={report._id} value={report._id}>
                                        {report.title || "Untitled Position"} · {report.matchScore}% match
                                    </option>
                                ))}
                            </select>
                            <svg className="mock-select__chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                        {reports.length === 0 && !reportsLoading && (
                            <p className="mock-field__hint">
                                No interview reports found.{" "}
                                <button type="button" className="mock-link" onClick={() => getReports()}>Refresh</button>{" "}
                                or create one on the home page.
                            </p>
                        )}
                    </div>

                    {/* Interview Type */}
                    <div className="mock-field">
                        <label className="mock-field__label">Interview Type</label>
                        <div className="mock-segmented mock-segmented--types">
                            {INTERVIEW_TYPES.map(type => (
                                <button
                                    type="button"
                                    key={type.value}
                                    className={`mock-segmented__option ${interviewType === type.value ? "mock-segmented__option--active" : ""}`}
                                    onClick={() => setInterviewType(type.value)}
                                >
                                    <span className="mock-segmented__icon">{type.icon}</span>
                                    <span className="mock-segmented__text">
                                        <b>{type.label}</b>
                                        <span>{type.description}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div className="mock-field">
                        <label className="mock-field__label">Difficulty</label>
                        <div className="mock-segmented">
                            {DIFFICULTIES.map(level => (
                                <button
                                    type="button"
                                    key={level.value}
                                    className={`mock-segmented__option ${difficulty === level.value ? "mock-segmented__option--active" : ""}`}
                                    onClick={() => setDifficulty(level.value)}
                                >
                                    <span className="mock-segmented__text">
                                        <b>{level.label}</b>
                                        <span>{level.hint}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Number of questions */}
                    <div className="mock-field">
                        <label className="mock-field__label">Number of Questions</label>
                        <div className="mock-count-row">
                            <button
                                type="button"
                                className="mock-count-btn"
                                onClick={decrementCount}
                                disabled={totalQuestions <= 1}
                                aria-label="Decrease questions"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            </button>
                            <div className="mock-count-display">
                                <b>{totalQuestions}</b>
                                <span>{totalQuestions === 1 ? "question" : "questions"}</span>
                            </div>
                            <button
                                type="button"
                                className="mock-count-btn"
                                onClick={incrementCount}
                                disabled={totalQuestions >= 20}
                                aria-label="Increase questions"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            </button>
                            <input
                                type="range"
                                className="mock-range"
                                min="1"
                                max="20"
                                value={totalQuestions}
                                onChange={(e) => setTotalQuestions(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="button primary-button mock-setup__start"
                        onClick={handleStart}
                        disabled={starting}
                    >
                        {starting ? (
                            <>
                                <span className="mock-setup__spinner" />
                                Starting your interview...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                                Start Mock Interview
                            </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default MockInterviewSetup;
