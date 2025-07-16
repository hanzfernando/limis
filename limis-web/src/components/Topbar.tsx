import { Link } from 'react-router-dom'

const Topbar = () => {
  return (
    <nav className="flex justify-between p-6 shadow-md bg-white dark:bg-zinc-800 transition-colors">
        <Link 
          to="/"
          className='text-lg uppercase font-bold'
        >
            Limis
        </Link>
        <div className="space-x-4">
          <Link
            to="/auth/login"
            className="px-4 py-2 border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition"
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
          >
            Signup
          </Link>
        </div>
      </nav>
  )
}

export default Topbar