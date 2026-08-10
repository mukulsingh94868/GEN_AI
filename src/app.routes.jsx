import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import MockInterviewSetup from "./features/mock/pages/MockInterviewSetup";
import LiveMockInterview from "./features/mock/pages/LiveMockInterview";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        path: "/mock-interview",
        element: <Protected><MockInterviewSetup /></Protected>
    },
    {
        path: "/mock-interview/:mockInterviewId",
        element: <Protected><LiveMockInterview /></Protected>
    }
])