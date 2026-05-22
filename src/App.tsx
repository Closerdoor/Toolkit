import { useEffect } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { BookOpen, Info, Moon, Sun, Wrench } from 'lucide-react'
import { AboutPage } from './pages/AboutPage'
import { HomePage } from './pages/HomePage'
import { ReferencesPage } from './pages/ReferencesPage'
import { ToolPage } from './pages/ToolPage'
import { useLocalStorage } from './hooks/useLocalStorage'

function App() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('toolkit-theme', 'light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/">
          <span className="brand-mark">
            <Wrench size={19} />
          </span>
          <span>ToolKit</span>
        </NavLink>

        <nav className="topnav" aria-label="主导航">
          <NavLink className="nav-link" to="/">
            <Wrench size={16} />
            工具
          </NavLink>
          <NavLink className="nav-link" to="/references">
            <BookOpen size={16} />
            参考网页
          </NavLink>
          <NavLink className="nav-link" to="/about">
            <Info size={16} />
            关于
          </NavLink>
        </nav>

        <button
          className="icon-button"
          type="button"
          title={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools/:toolId" element={<ToolPage />} />
        <Route path="/references" element={<ReferencesPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  )
}

export default App
