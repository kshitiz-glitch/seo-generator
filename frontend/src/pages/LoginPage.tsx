// src/pages/LoginPage.tsx
import { useForm } from 'react-hook-form'
import { useLogin } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

type FormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const { mutate: login, isPending, error } = useLogin()
  const navigate = useNavigate()

  const onSubmit = (data: FormData) => {
    login(data, {
      onSuccess: () => {
        navigate('/app')
      },
      onError: (err) => {
        console.error('Login error:', err)
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-white px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-black space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-indigo-700">Log In</h1>

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email', { required: 'Email is required' })}
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: 'Password is required' })}
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          {isPending ? 'Logging in...' : 'Log In'}
        </button>

        {error && <p className="text-red-600 text-sm text-center">{error.message}</p>}
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  )
}
