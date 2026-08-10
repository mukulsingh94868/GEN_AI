import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"
import { ToastProvider } from "./components/ui/Toast.jsx"

function App() {

  return (
    <AuthProvider>
      <ToastProvider>
        <InterviewProvider>
          <RouterProvider router={router} />
        </InterviewProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
