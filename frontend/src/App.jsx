import { useState, useEffect } from 'react'
import { Text, Paper, Notification } from '@mantine/core'
import axios from 'axios'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './components/dashboard/Dashboard'
import { Chat } from './components/chat/Chat'

function App() {
  const [logs, setLogs] = useState([])
  const [colorScheme, setColorScheme] = useState('light')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isBackendAvailable, setIsBackendAvailable] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get('http://localhost:8000')
        setIsBackendAvailable(true)
      } catch (error) {
        setError('Cannot connect to backend server. Please make sure it is running on port 8000.')
        console.error('Backend connection error:', error)
      }
    }
    checkBackend()
  }, [])

  useEffect(() => {
    if (isBackendAvailable) {
      fetchLogs()
      const interval = setInterval(fetchLogs, 30000)
      return () => clearInterval(interval)
    }
  }, [isBackendAvailable])

  const fetchLogs = async () => {
    try {
      if (!isBackendAvailable) return

      setIsLoading(true)
      const response = await axios.get('http://localhost:8000/logs')
      
      if (response.data === null || response.data === undefined) {
        setError('Invalid response from server')
        setLogs([])
        return
      }

      setLogs(Array.isArray(response.data) ? response.data : [])
      setError(null)
    } catch (error) {
      setError(error.message)
      setLogs([])
    } finally {
      setIsLoading(false)
    }
  }

  const retryMessage = async (logId) => {
    try {
      await axios.post(`http://localhost:8000/retry/${logId}`)
      fetchLogs()
    } catch (error) {
      console.error('Error retrying message:', error)
    }
  }

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <AppShell colorScheme={colorScheme}>
      {error && (
        <Notification color="red" mb="md" onClose={() => setError(null)}>
          Error: {error}
        </Notification>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Dashboard 
          logs={logs}
          isLoading={isLoading}
          selectedLog={selectedLog}
          onSelectLog={setSelectedLog}
          onRetry={retryMessage}
          onRefresh={fetchLogs}
          colorScheme={colorScheme}
          onToggleTheme={toggleColorScheme}
        />

        {selectedLog && (
          <div className="lg:sticky lg:top-4">
            <Chat log={selectedLog} />
          </div>
        )}
      </div>

      {process.env.NODE_ENV === 'development' && (
        <Paper p="xs" mt="xl">
          <Text size="sm" color="dimmed">Debug Info:</Text>
          <pre style={{ fontSize: '12px' }}>
            {JSON.stringify({ isLoading, logsCount: logs?.length, error }, null, 2)}
          </pre>
        </Paper>
      )}
    </AppShell>
  )
}

export default App
