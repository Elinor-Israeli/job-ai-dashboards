import { Routes, Route, useLocation } from 'react-router-dom'
import { JobLogsSection } from './cmps/JobLogsSection'
import { Header } from './cmps/Header'

export function RootCmp() {
  // const { pathname } = useLocation(); // Remove if unused

  return (
    <div>
      <Header />
      <main>
        <Routes>
          <Route path="" element={<JobLogsSection />} />
        </Routes>
      </main>
    </div>
  )
}




