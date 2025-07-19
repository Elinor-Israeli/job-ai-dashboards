import { Routes, Route, useLocation } from 'react-router-dom'
import { JobLogsSection } from './cmps/JobLogsSection'

import { Header } from './cmps/Header'
import { ChatAI } from './cmps/ChatCmps/ChatAI'

export function RootCmp() {
  const { pathname } = useLocation()

  return (
    <div>
      <Header />
      <main>
        <Routes>
          <Route path="" element={<JobLogsSection />} />
          <Route path="/aichat" element={<ChatAI />}/>
        </Routes>
      </main>
    </div>
  )
}




