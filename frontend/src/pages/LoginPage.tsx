// src/pages/LoginPage.tsx
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useLogin } from '../hooks/useAuth'

type LoginForm = { email: string; password: string }

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/app'

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()
  const { mutate, isLoading, isError, error } = useLogin()

  const onSubmit = (data: LoginForm) => {
    mutate(data, { onSuccess: () => navigate(from, { replace: true }) })
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex flex-col">
      

      <main className="flex-grow flex items-center justify-center w-full px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md space-y-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-center">Welcome Back</h2>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full rounded-md bg-gray-700/50 p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full rounded-md bg-gray-700/50 p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* API Error */}
          {isError && (
            <p className="text-red-400 text-center text-sm">
              {(error as Error).message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-500 hover:bg-pink-600 transition py-3 rounded-full font-medium disabled:opacity-50"
          >
            {isLoading ? 'Signing In…' : 'Log In'}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-300">
            Don’t have an account?{' '}
            <Link to="/signup" className="underline hover:text-white">
              Sign up
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
