import { useNavigate } from "react-router";
import { useToast } from "../../../components/ui/toast.context";
import {
  abandonMockInterview,
  answerMockInterviewQuestion,
  completeMockInterview,
  createMockInterview,
  getAllMockInterviews,
  getMockInterviewById,
} from "../services/mockInterview.api";

/**
 * @description Wraps the mock interview API with consistent, user-friendly error handling.
 * On API failure it shows a toast (and redirects on expired auth) then returns null,
 * so callers can simply `if (result) { ... }`.
 */
export const useMockInterview = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const handleError = (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401) {
      toast("Your session has expired. Please sign in again.", {
        type: "error",
      });
      navigate("/login");
      return;
    }

    toast(message || "Something went wrong. Please try again.", {
      type: "error",
    });
  };

  const startMockInterview = async ({
    interviewReportId,
    interviewType,
    difficulty,
    totalQuestions,
  }) => {
    try {
      const data = await createMockInterview({
        interviewReportId,
        interviewType,
        difficulty,
        totalQuestions,
      });
      return data.mockInterview || null;
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  const getSession = async (mockInterviewId) => {
    try {
      const data = await getMockInterviewById(mockInterviewId);
      return data.mockInterview || null;
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  const submitAnswer = async (mockInterviewId, answer) => {
    try {
      return await answerMockInterviewQuestion({ mockInterviewId, answer });
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  const completeSession = async (mockInterviewId) => {
    try {
      return await completeMockInterview(mockInterviewId);
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  const getSessions = async () => {
    try {
      const data = await getAllMockInterviews();
      return data.mockInterviews || [];
    } catch (error) {
      handleError(error);
      return [];
    }
  };

  const abandonSession = async (mockInterviewId) => {
    try {
      return await abandonMockInterview(mockInterviewId);
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  return {
    startMockInterview,
    getSession,
    submitAnswer,
    completeSession,
    getSessions,
    abandonSession,
  };
};
