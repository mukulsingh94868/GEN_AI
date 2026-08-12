import axios from "axios";

const api = axios.create({
    // baseURL: import.meta.env.VITE_APP_BASE_URL,
    baseURL: "http://localhost:5000",
    withCredentials: true,
})


/**
 * @description Create a new mock interview session on the basis of an interview report and generate the first question.
 */
export const createMockInterview = async ({ interviewReportId, interviewType, difficulty, totalQuestions }) => {
    const response = await api.post("/api/mock-interview", {
        interviewReportId,
        interviewType,
        difficulty,
        totalQuestions,
    })
    console.log('responserespons12', response);
    return response.data
}


/**
 * @description Answer the current question, evaluate it and generate the next question.
 */
export const answerMockInterviewQuestion = async ({ mockInterviewId, answer }) => {
    console.log('mockInterviewId', mockInterviewId);
    console.log('answer', answer);
    const response = await api.post(`/api/mock-interview/${mockInterviewId}/answer`, { answer })
    console.log('response123', response);
    return response.data
}


/**
 * @description Generate the final AI interview report of a completed mock interview.
 */
export const completeMockInterview = async (mockInterviewId) => {
    const response = await api.post(`/api/mock-interview/${mockInterviewId}/complete`)

    return response.data
}


/**
 * @description Get a mock interview session by mockInterviewId.
 */
export const getMockInterviewById = async (mockInterviewId) => {
    const response = await api.get(`/api/mock-interview/${mockInterviewId}`)

    return response.data
}


/**
 * @description Get all mock interview sessions of logged in user.
 */
export const getAllMockInterviews = async () => {
    const response = await api.get("/api/mock-interview/")

    return response.data
}


/**
 * @description Abandon a mock interview session.
 */
export const abandonMockInterview = async (mockInterviewId) => {
    const response = await api.patch(`/api/mock-interview/${mockInterviewId}/abandon`)

    return response.data
}
