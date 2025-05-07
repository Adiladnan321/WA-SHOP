import { Table, Badge, Button, Text, Loader } from '@mantine/core';
import { format } from 'date-fns';

export function MessageTable({ logs, isLoading, selectedLog, onSelectLog, onRetry }) {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Loader size="lg" />
      </div>
    );
  }

  if (!logs?.length) {
    return (
      <Text align="center" color="dimmed" py="xl">
        No messages found. Make sure your backend server is running at http://localhost:8000
      </Text>
    );
  }

  return (
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
          <tr 
            key={log.id}
            onClick={() => onSelectLog(log)}
            style={{ cursor: 'pointer' }}
            className={selectedLog?.id === log.id ? 'bg-blue-50' : ''}
          >
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetry(log.id);
                  }}
                >
                  Retry
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
