import { Paper, Text, Avatar, Group, ScrollArea, Button, TextInput, useMantineTheme } from '@mantine/core';
import { useState } from 'react';

const MessageBubble = ({ message, isSent }) => {
  const theme = useMantineTheme();
  
  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
      <Paper 
        p="md" 
        radius="lg"
        style={{
          maxWidth: '70%',
          backgroundColor: isSent 
            ? theme.colorScheme === 'dark' ? theme.colors.whatsapp[4] : theme.colors.whatsapp[0]
            : theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
          color: theme.colorScheme === 'dark' 
            ? theme.white 
            : theme.black
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

export function Chat({ log }) {
  const theme = useMantineTheme();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      text: `Cart abandoned! Phone: ${log.phone}`,
      timestamp: log.timestamp,
      isSent: false
    },
    {
      text: "Your cart is waiting!",
      timestamp: log.timestamp,
      isSent: true
    }
  ]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    setMessages([...messages, {
      text: newMessage,
      timestamp: new Date().toISOString(),
      isSent: true
    }]);
    setNewMessage('');
  };

  return (
    <Paper 
      className="flex flex-col h-[600px]"
      style={{
        backgroundColor: theme.colorScheme === 'dark' 
          ? theme.colors.whatsapp[7] 
          : theme.colors.whatsapp[5]
      }}
    >
      <Group p="md" className="border-b" style={{
        backgroundColor: theme.colorScheme === 'dark' 
          ? theme.colors.whatsapp[7] 
          : theme.white
      }}>
        <Avatar 
          color="teal" 
          radius="xl"
          style={{ backgroundColor: theme.colors.whatsapp[1] }}
        >
          {log.phone.slice(-2)}
        </Avatar>
        <div>
          <Text weight={500}>{log.phone}</Text>
          <Text size="xs" color="dimmed">Template: {log.template}</Text>
        </div>
      </Group>

      <ScrollArea className="flex-grow p-4">
        {messages.map((msg, idx) => (
          <MessageBubble 
            key={idx}
            message={msg}
            isSent={msg.isSent}
          />
        ))}
      </ScrollArea>

      <Group p="md" style={{
        backgroundColor: theme.colorScheme === 'dark' 
          ? theme.colors.whatsapp[7] 
          : theme.white
      }}>
        <TextInput
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          styles={(theme) => ({
            input: {
              backgroundColor: theme.colorScheme === 'dark' 
                ? theme.colors.dark[6] 
                : theme.white
            }
          })}
        />
        <Button 
          onClick={handleSend}
          style={{
            backgroundColor: theme.colors.whatsapp[1]
          }}
        >
          Send
        </Button>
      </Group>
    </Paper>
  );
}
