export const formatElapsed = (totalSeconds) => {
    const safe = Math.max(0, Math.floor(totalSeconds || 0));
    const hours = String(Math.floor(safe / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((safe % 3600) / 60)).padStart(2, "0");
    const seconds = String(safe % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
};

export const computeElapsed = (startAt) => {
    if (!startAt) return 0;

    const start = new Date(startAt).getTime();

    if (Number.isNaN(start)) return 0;

    return Math.max(0, Math.floor((Date.now() - start) / 1000));
};
