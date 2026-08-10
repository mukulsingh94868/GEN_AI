import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate('/')
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <div className='loader-spinner' />
                <h1>Signing you in...</h1>
            </main>
        )
    }

    return (
        <div className='auth-page'>
            <div className='auth-shell'>

                {/* Brand showcase panel */}
                <aside className='auth-brand'>
                    <div className='auth-brand__glow' />
                    <div className='auth-brand__logo'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.7L20 10l-6.1 1.3L12 17l-1.9-5.7L4 10l6.1-1.3z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></svg>
                    </div>
                    <div className='auth-brand__content'>
                        <h1>InterviewGenie</h1>
                        <p>Turn any job description into a personalized interview strategy in seconds.</p>
                    </div>
                    <ul className='auth-brand__features'>
                        <li>
                            <span className='auth-brand__tick'><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>
                            AI-generated technical &amp; behavioral questions
                        </li>
                        <li>
                            <span className='auth-brand__tick'><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>
                            Resume parsing with match scoring
                        </li>
                        <li>
                            <span className='auth-brand__tick'><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>
                            Day-by-day preparation roadmap
                        </li>
                    </ul>
                </aside>

                {/* Form panel */}
                <main className='auth-panel'>
                    <div className='auth-card'>
                        <header className='auth-card__header'>
                            <span className='auth-card__eyebrow'>Welcome back</span>
                            <h2>Sign in to your account</h2>
                            <p>Continue your interview preparation journey.</p>
                        </header>

                        <form onSubmit={handleSubmit} className='auth-form'>
                            <div className='field'>
                                <label htmlFor='email'>Email</label>
                                <div className='field__control'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    <input
                                        onChange={(e) => { setEmail(e.target.value) }}
                                        type='email'
                                        id='email'
                                        name='email'
                                        placeholder='Enter email address'
                                        autoComplete='email'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='field'>
                                <label htmlFor='password'>Password</label>
                                <div className='field__control'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                    <input
                                        onChange={(e) => { setPassword(e.target.value) }}
                                        type='password'
                                        id='password'
                                        name='password'
                                        placeholder='Enter password'
                                        autoComplete='current-password'
                                        required
                                    />
                                </div>
                            </div>

                            <button className='button primary-button auth-submit' type='submit'>
                                Sign In
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                            </button>
                        </form>

                        <p className='auth-switch'>
                            Don't have an account? <Link to={"/register"}>Create one</Link>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Login
