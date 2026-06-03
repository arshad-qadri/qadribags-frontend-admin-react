import { useState } from 'react'
import Button from '../components/common/Button'
import InputBox from '../components/common/InputBox'

const initialForm = {
  email: '',
  password: '',
  remember: false,
}

function Login() {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
    }, 700)
  }

  return (
    <section className="w-full max-w-md">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white shadow-lg shadow-emerald-900/20">
            QB
          </div>
          <h1 className="text-2xl font-bold tracking-normal text-slate-950">
            QadriBags Admin
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your store
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <InputBox
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@qadribags.com"
            error={errors.email}
          />

          <InputBox
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={errors.password}
          />

          <div className="flex items-center justify-between gap-4 text-sm">
            <label className="flex items-center gap-2 font-medium text-slate-600">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
              />
              Remember me
            </label>

            <a
              href="#forgot-password"
              className="font-semibold text-emerald-700 transition hover:text-emerald-800"
            >
              Forgot password?
            </a>
          </div>

          <Button type="submit" loading={loading}>
            Login
          </Button>
        </form>
      </div>
    </section>
  )
}

export default Login
