/**
 * @description Confirmation dialog before ending an interview. Never terminates on click —
 * requires explicit confirmation.
 */
const EndInterviewDialog = ({ open, onCancel, onConfirm, busy = false }) => {
    if (!open) return null;

    return (
        <div className="mock-dialog-overlay" onClick={onCancel}>
            <div className="mock-dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                <span className="mock-dialog__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                </span>
                <h3>Are you sure you want to end this interview?</h3>
                <p>Your current progress will be abandoned and you won't be able to continue this session.</p>
                <div className="mock-dialog__actions">
                    <button type="button" className="button ghost-button" onClick={onCancel} disabled={busy}>
                        Cancel
                    </button>
                    <button type="button" className="button danger-button" onClick={onConfirm} disabled={busy}>
                        {busy ? "Ending..." : "End Interview"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EndInterviewDialog;
