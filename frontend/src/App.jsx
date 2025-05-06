import { useState, useEffect } from 'react'
import { MantineProvider, Container, Title, Table, Badge, Button, Group, Text, Paper, ActionIcon, Switch, Loader } from '@mantine/core'
import { IconSun, IconMoonStars, IconRefresh } from '@tabler/icons-react'
import axios from 'axios'
import { format } from 'date-fns'
import './App.css'

function App() {
  const [logs, setLogs] = useState([])
  const [colorScheme, setColorScheme] = useState('light')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('http://localhost:8000/logs')
      setLogs(response.data)
    } catch (error) {
      console.error('Error fetching logs:', error)
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
                <Loader />
              </div>
            ) : (
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
            )}
          </Paper>
        </Paper>
      </Container>
    </MantineProvider>
  )
}

export default App
