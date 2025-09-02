// src/pages/SignupPage.tsx
import { useForm } from 'react-hook-form'
import { useSignup } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

type FormData = {
  email: string
  password: string
}

export default function SignupPage() {
  const { register, handleSubmit } = useForm<FormData>()
  const { mutate: signup, isPending, error } = useSignup()
  const navigate = useNavigate()

  const onSubmit = (data: FormData) => {
    signup(data, {
      onSuccess: () => {
        navigate('/app')
      },
      onError: (err) => {
        console.error("Signup error:", err)
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-white px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-black space-y-6">
        <h1 className="text-2xl font-bold text-center text-indigo-700">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="email"
            {...register('email', { required: true })}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="password"
            {...register('password', { required: true })}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {isPending ? 'Signing up...' : 'Sign Up'}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error.message}</p>}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-600 hover:underline">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
