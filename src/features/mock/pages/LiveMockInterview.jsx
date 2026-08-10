import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMockInterview } from "../hooks/useMockInterview";
import { useToast } from "../../../components/ui/toast.context";
import AiInterviewOrb from "../components/AiInterviewOrb";
import InterviewTimer from "../components/InterviewTimer";
import InterviewProgress from "../components/InterviewProgress";
import InterviewQuestion from "../components/InterviewQuestion";
import SpeechRecorder from "../components/SpeechRecorder";
import EvaluationFeedback from "../components/EvaluationFeedback";
import EndInterviewDialog from "../components/EndInterviewDialog";
import InterviewCompletion from "../components/InterviewCompletion";
import InterviewReport from "../components/InterviewReport";
import "../style/mockInterview.scss";

const LiveMockInterview = () => {
    const { mockInterviewId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const { getSession, submitAnswer, completeSession, abandonSession } = useMockInterview();

    const [session, setSession] = useState(null);
    const [phase, setPhase] = useState("live");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [generatingReport, setGeneratingReport] = useState(false);
    const [evaluation, setEvaluation] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const [listening, setListening] = useState(false);
    const [showEndDialog, setShowEndDialog] = useState(false);
    const [ending, setEnding] = useState(false);
    const [report, setReport] = useState(null);

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
            setReport(fetched.report || null);

            if (fetched.status === "completed") {
                setPhase("completed");
            }

            setLoading(false);
        };

        load();

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mockInterviewId]);

    const questions = session?.questions || [];
    const currentIndex = session?.currentQuestionIndex ?? 0;
    const totalQuestions = session?.totalQuestions ?? questions.length;
    const currentQuestion = questions[currentIndex] || null;

    const handleSubmit = async (answer) => {
        if (submitting) return;

        setSubmitting(true);
        setShowFeedback(false);

        try {
            const res = await submitAnswer(mockInterviewId, answer);

            if (!res) return;

            if (res.mockInterview) setSession(res.mockInterview);

            if (res.interviewComplete === true) {
                setEvaluation(res.evaluation || null);
                setPhase("completed");
            } else if (res.nextQuestion) {
                setEvaluation(res.evaluation || null);
                setShowFeedback(true);
            } else {
                if (res.evaluation) setEvaluation(res.evaluation);
                toast(res.message || "Your answer was saved. Please submit again to continue.", { type: "info" });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewReport = async () => {
        if (generatingReport) return;

        setGeneratingReport(true);

        try {
            const res = await completeSession(mockInterviewId);

            if (!res) return;

            setReport(res.report);
            if (res.mockInterview) setSession(res.mockInterview);
        } finally {
            setGeneratingReport(false);
        }
    };

    const handleEndConfirmed = async () => {
        setEnding(true);

        const res = await abandonSession(mockInterviewId);

        setEnding(false);
        setShowEndDialog(false);

        if (res) {
            toast("Interview ended.", { type: "info" });
            navigate("/mock-interview");
        }
    };

    if (loading) {
        return (
            <main className="mock-loading">
                <div className="loader-spinner" />
                <h1>Loading your interview...</h1>
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
                <p>This interview session is unavailable. Please go back and start a new one.</p>
                <button type="button" className="button primary-button" onClick={() => navigate("/mock-interview")}>
                    Back to Mock Interviews
                </button>
            </main>
        );
    }

    if (phase === "completed" && report) {
        return (
            <div className="mock-live">
                <InterviewReport
                    report={report}
                    onBack={() => navigate("/mock-interview")}
                    onNew={() => navigate("/mock-interview")}
                />
            </div>
        );
    }

    if (phase === "completed") {
        return (
            <div className="mock-live">
                <InterviewCompletion
                    session={session}
                    generating={generatingReport}
                    onViewReport={handleViewReport}
                />
            </div>
        );
    }

    if (session.status === "abandoned") {
        return (
            <main className="mock-loading">
                <span className="mock-loading__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                </span>
                <h1>Interview ended</h1>
                <p>This interview was abandoned, so it can no longer be continued.</p>
                <button type="button" className="button primary-button" onClick={() => navigate("/mock-interview")}>
                    Start a New Interview
                </button>
            </main>
        );
    }

    const orbState = submitting ? "evaluating" : listening ? "listening" : "idle";

    return (
        <div className="mock-live">
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
            <header className="mock-topbar">
                <button type="button" className="mock-brand" onClick={() => navigate("/")}>
                    <span className="mock-brand__logo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.7L20 10l-6.1 1.3L12 17l-1.9-5.7L4 10l6.1-1.3z" /></svg>
                    </span>
                    <span className="mock-brand__title">
                        Interview<span className="mock-brand__accent">Genie</span>
                    </span>
                </button>

                <div className="mock-topbar__center">
                    <InterviewTimer startAt={session?.createdAt} />
                    <div className="mock-topbar__divider" />
                    <InterviewProgress current={currentIndex} total={totalQuestions} />
                </div>

                <button type="button" className="mock-end-btn" onClick={() => setShowEndDialog(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>
                    End Interview
                </button>
            </header>

            <main className="mock-stage">
                {showFeedback && evaluation && (
                    <EvaluationFeedback evaluation={evaluation} onClose={() => setShowFeedback(false)} />
                )}

                <AiInterviewOrb state={orbState} />

                <InterviewQuestion
                    question={currentQuestion?.question}
                    index={currentIndex + 1}
                    total={totalQuestions}
                    type={currentQuestion?.category || session?.interviewType}
                />

                {submitting ? (
                    <div className="mock-evaluating">
                        <div className="mock-evaluating__spinner" />
                        <p>AI is evaluating your answer...</p>
                        <span>Please wait a moment</span>
                    </div>
                ) : (
                    <SpeechRecorder
                        key={`q-${currentIndex}`}
                        initialTranscript={currentQuestion?.answer || ""}
                        disabled={submitting}
                        onListeningChange={setListening}
                        onSubmit={handleSubmit}
                    />
                )}
            </main>

            <EndInterviewDialog
                open={showEndDialog}
                busy={ending}
                onCancel={() => setShowEndDialog(false)}
                onConfirm={handleEndConfirmed}
            />
        </div>
    );
};

export default LiveMockInterview;
