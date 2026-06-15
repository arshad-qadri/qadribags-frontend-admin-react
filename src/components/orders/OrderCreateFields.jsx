import { useEffect, useRef, useState } from 'react'

export function Input({
  label,
  type = 'text',
  placeholder,
  value = '',
  onChange = () => {},
  error = '',
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
        }`}
      />
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  )
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder,
  error = '',
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  )
}

export function SearchableSelectInput({
  label,
  value,
  onChange,
  options,
  placeholder,
  error = '',
}) {
  const containerRef = useRef(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const selectedOption = options.find((option) => option.value === value) || null
  const displayValue = open ? query : selectedOption?.label || ''
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase().trim()),
  )

  useEffect(() => {
    if (!open) {
      setQuery('')
    }
  }, [open])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="space-y-2" ref={containerRef}>
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            if (value) {
              onChange('')
            }
          }}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
          }`}
        />
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400"
          aria-label="Toggle customer list"
        >
          <span className={`text-xs transition ${open ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {open ? (
          <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setQuery('')
                    setOpen(false)
                  }}
                  className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-emerald-50 ${
                    option.value === value
                      ? 'bg-emerald-50 font-semibold text-emerald-700'
                      : 'text-slate-700'
                  }`}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500">No customer found.</div>
            )}
          </div>
        ) : null}
      </div>
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </div>
  )
}

export function RadioGroup({ label, value, onChange, options, error = '' }) {
  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const checked = value === option.value

          return (
            <label
              key={option.value}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                checked
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value={option.value}
                checked={checked}
                onChange={(event) => onChange(event.target.value)}
                className="h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              {option.label}
            </label>
          )
        })}
      </div>
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </div>
  )
}

export function ReadOnlyField({ label, value }) {
  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
        {value}
      </div>
    </div>
  )
}
