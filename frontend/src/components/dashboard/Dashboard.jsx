import { Title, Badge, Group, Paper, ActionIcon, Switch } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { MessageTable } from './MessageTable';

export function Dashboard({ 
  logs, 
  isLoading, 
  selectedLog,
  onSelectLog,
  onRetry,
  onRefresh,
  colorScheme,
  onToggleTheme 
}) {
  return (
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
            onClick={onRefresh}
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
            onChange={onToggleTheme}
          />
        </Group>
      </Group>

      <Paper shadow="xs" radius="md" p="xs" style={{ overflow: 'auto' }}>
        <MessageTable 
          logs={logs}
          isLoading={isLoading}
          selectedLog={selectedLog}
          onSelectLog={onSelectLog}
          onRetry={onRetry}
        />
      </Paper>
    </Paper>
  );
}
