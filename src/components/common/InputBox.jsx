function InputBox({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
        }`}
      />
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  )
}

export default InputBox
