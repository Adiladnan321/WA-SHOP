import { Paper, Text, useMantineTheme } from '@mantine/core';
import { messageColors } from '../../constants/colors';

export const MessageBubble = ({ message, isSent }) => {
  const theme = useMantineTheme();
  
  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
      <Paper 
        p="md" 
        radius="lg"
        style={{
          maxWidth: '70%',
          backgroundColor: isSent 
            ? messageColors.sent[theme.colorScheme]
            : messageColors.received[theme.colorScheme],
          color: theme.colorScheme === 'dark' ? theme.white : theme.black
        }}
      >
        <Text size="sm">{message.text}</Text>
        <Text 
          size="xs" 
          color={theme.colorScheme === 'dark' ? 'gray.4' : 'dimmed'} 
          align="right"
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </Text>
      </Paper>
    </div>
  );
};
