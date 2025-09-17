'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await login(email, password)
      
      if (result.success) {
        router.push('/dashboard')
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (error: any) {
      setError(error.message || 'Login failed')
    }
    
    setLoading(false)
  };

  return (
    <div id="ihealth-layout" className="theme-tradewind">
      <div className="main p-2 py-3 p-xl-5">
        <div className="body d-flex p-0 p-xl-5">
          <div className="container-xxl">
            <div className="row g-0">
              {/* Left Side - Branding */}
              <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center rounded-lg auth-h100">
                <div style={{ maxWidth: '25rem' }}>
                  <div className="text-center mb-5">
                    <i className="icofont-heart-beat secondary-color" style={{ fontSize: '90px' }}></i>
                  </div>
                  <div className="mb-5">
                    <h2 className="color-900 text-center">I-Health, We aim to make your life better</h2>
                  </div>
                  <div className="">
                    <Image src="/assets/images/login-img.svg" alt="login-img" width={400} height={300} />
                  </div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
                <div className="w-100 p-3 p-md-5 card border-0 bg-dark text-light" style={{ maxWidth: '32rem' }}>
                  <form className="row g-1 p-3 p-md-4" onSubmit={handleSubmit}>
                    <div className="col-12 text-center mb-5">
                      <h1>Sign in</h1>
                      <span>Free access to our dashboard.</span>
                    </div>

                    {/* Demo Credentials Alert */}
                    <div className="col-12 mb-3">
                      <div className="alert alert-info">
                        <h6 className="mb-2">Demo Credentials:</h6>
                        <div className="small">
                          <div><strong>Admin:</strong> admin@ihealth.com / admin123</div>
                          <div><strong>Doctor:</strong> dr.wilson@ihealth.com / doctor123</div>
                        </div>
                        <div className="mt-2">
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => {setEmail('admin@ihealth.com'); setPassword('admin123')}}
                          >
                            Use Admin
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline-success"
                            onClick={() => {setEmail('dr.wilson@ihealth.com'); setPassword('doctor123')}}
                          >
                            Use Doctor
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Google Sign In */}
                    <div className="col-12 text-center mb-4">
                      <a className="btn btn-lg btn-outline-secondary btn-block" href="#">
                        <span className="d-flex justify-content-center align-items-center">
                          <Image className="avatar xs me-2" src="/assets/images/google.svg" alt="Google" width={20} height={20} />
                          Sign in with Google
                        </span>
                      </a>
                      <span className="dividers text-muted mt-4">OR</span>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="col-12 mb-3">
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      </div>
                    )}

                    {/* Email Field */}
                    <div className="col-12">
                      <div className="mb-2">
                        <label className="form-label">Email address</label>
                        <input 
                          type="email" 
                          className="form-control form-control-lg" 
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="col-12">
                      <div className="mb-2">
                        <div className="form-label">
                          <span className="d-flex justify-content-between align-items-center">
                            Password
                            <Link href="/auth/forgot-password">Forgot Password?</Link>
                          </span>
                        </div>
                        <input 
                          type="password" 
                          className="form-control form-control-lg" 
                          placeholder="***************"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Remember Me */}
                    <div className="col-12">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          value="" 
                          id="flexCheckDefault"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                          Remember me
                        </label>
                      </div>
                    </div>

                    {/* Sign In Button */}
                    <div className="col-12 text-center mt-4">
                      <button 
                        type="submit"
                        className="btn btn-lg btn-block btn-light lift text-uppercase" 
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            SIGNING IN...
                          </>
                        ) : (
                          'SIGN IN'
                        )}
                      </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="col-12 text-center mt-4">
                      <span>Don&apos;t have an account yet? <Link href="/auth/register">Sign up here</Link></span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
