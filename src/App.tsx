import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { EcosystemNavbar, EcosystemFooter, OneIdProvider } from '@explorills/one-ecosystem-ui'
import { Layout } from '@/components/layout/Layout'
import { getOneIdApiUrl } from '@/lib/api'
import HomePage from '@/pages/HomePage'
import ArticlePage from '@/pages/ArticlePage'
import NotFoundPage from '@/pages/NotFoundPage'

const THEME_COLOR = 'oklch(0.68 0.14 65)'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <OneIdProvider apiUrl={getOneIdApiUrl()} projectId="1fe344d4623291d85ad7369cbc6d9ec8">
      <BrowserRouter>
        <EcosystemNavbar
          logo="/logo.png"
          projectName="blog"
          themeColor={THEME_COLOR}
          currentDomain="blog.expl.one"
        />
        <Layout>
          <AnimatedRoutes />
        </Layout>
        <EcosystemFooter themeColor={THEME_COLOR} />
      </BrowserRouter>
    </OneIdProvider>
  )
}
