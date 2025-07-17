import { Routes, Route, useLocation } from 'react-router-dom'
import { JobLogsSection  } from './cmps/JobLogsSection'

export function RootCmp() {
      const { pathname } = useLocation()
      return (
      <main>
        <Routes>
          <Route path="" element={<JobLogsSection />} />
        </Routes>
      </main>
      )
}



