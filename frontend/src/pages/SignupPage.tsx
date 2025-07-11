// src/pages/SignupPage.tsx
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useSignup } from '../hooks/useAuth'

type SignupForm = { email: string; password: string; confirm: string }

export default function SignupPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupForm>()
  const { mutate, isLoading, isError, error } = useSignup()
  const pw = watch('password')

  const onSubmit = (data: SignupForm) => {
    mutate(
      { email: data.email, password: data.password },
      { onSuccess: () => navigate('/app') }
    )
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex flex-col">
      

      <main className="flex-grow flex items-center justify-center w-full px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md space-y-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-center">Create Account</h2>

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
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Min length is 6' },
              })}
              className="w-full rounded-md bg-gray-700/50 p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register('confirm', {
                validate: (v) => v === pw || 'Passwords do not match',
              })}
              className="w-full rounded-md bg-gray-700/50 p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {errors.confirm && (
              <p className="text-red-400 text-sm mt-1">{errors.confirm.message}</p>
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
            {isLoading ? 'Creating…' : 'Sign Up'}
          </button>

          {/* Log In Link */}
          <p className="text-center text-sm text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="underline hover:text-white">
              Log in
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
