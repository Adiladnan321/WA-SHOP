import { useState, useEffect } from 'react'
import { MantineProvider, Container, Title, Table, Badge, Button, Group, Text, Paper, ActionIcon, Switch, Loader, Notification } from '@mantine/core'
import { IconSun, IconMoonStars, IconRefresh } from '@tabler/icons-react'
import axios from 'axios'
import { format } from 'date-fns'
import './App.css'

function App() {
  const [logs, setLogs] = useState([])
  const [colorScheme, setColorScheme] = useState('light')
  const [isLoading, setIsLoading] = useState(false)  // Changed initial state to false
  const [error, setError] = useState(null)
  const [isBackendAvailable, setIsBackendAvailable] = useState(false)

  // Check if backend is available
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

  // Only fetch logs if backend is available
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
    <MantineProvider 
      withGlobalStyles 
      withNormalizeCSS
      theme={{
        colorScheme,
        primaryColor: 'blue',
        fontFamily: 'Inter, sans-serif',
        components: {
          Table: {
            styles: (theme) => ({
              root: {
                '& thead tr th': {
                  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
                  padding: '16px',
                  fontWeight: 600,
                },
                '& tbody tr td': {
                  padding: '16px',
                  borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                }
              }
            })
          }
        }
      }}
    >
      <Container size="xl" py="xl">
        {error && (
          <Notification color="red" mb="md" onClose={() => setError(null)}>
            Error: {error}
          </Notification>
        )}
        
        <Paper shadow="sm" p="md" mb="xl" radius="md">
          <Group position="apart" mb="xl">
            <Group>
              <Title order={1} size="h2">WhatsApp Message Dashboard</Title>
              <Badge size="lg" variant="filled" color="blue">
                {logs.length} Messages
              </Badge>
            </Group>
            <Group>
              <ActionIcon 
                variant="light"
                color="blue"
                onClick={fetchLogs}
                loading={isLoading}
                title="Refresh"
              >
                <IconRefresh size={18} />
              </ActionIcon>
              <Switch
                size="md"
                onLabel="🌙"
                offLabel="☀️"
                checked={colorScheme === 'dark'}
                onChange={toggleColorScheme}
              />
            </Group>
          </Group>

          <Paper 
            shadow="xs" 
            radius="md" 
            p="xs"
            style={{ overflow: 'auto' }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <Loader size="lg" />
              </div>
            ) : logs && logs.length > 0 ? (
              <Table striped highlightOnHover>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Phone</th>
                    <th>Template</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{format(new Date(log.timestamp), 'PPpp')}</td>
                      <td>{log.phone}</td>
                      <td>{log.template}</td>
                      <td>
                        <Badge 
                          variant="filled"
                          color={log.status === 'success' ? 'teal' : 'red'}
                          radius="sm"
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td>
                        {log.status === 'failed' && (
                          <Button 
                            size="xs" 
                            variant="light"
                            color="blue" 
                            onClick={() => retryMessage(log.id)}
                          >
                            Retry
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        <Text align="center" color="dimmed">
                          No messages found
                        </Text>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            ) : (
              <Text align="center" color="dimmed" py="xl">
                No messages found. Make sure your backend server is running at http://localhost:8000
              </Text>
            )}
          </Paper>
        </Paper>

        {/* Debug information */}
        {process.env.NODE_ENV === 'development' && (
          <Paper p="xs" mt="xl">
            <Text size="sm" color="dimmed">Debug Info:</Text>
            <pre style={{ fontSize: '12px' }}>
              {JSON.stringify({ isLoading, logsCount: logs?.length, error }, null, 2)}
            </pre>
          </Paper>
        )}
      </Container>
    </MantineProvider>
  )
}

export default App
