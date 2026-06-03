import { Outlet } from 'react-router-dom'

function PublicLayout() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Outlet />
      </div>
    </main>
  )
}

export default PublicLayout
