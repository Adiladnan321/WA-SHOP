import { Paper, ScrollArea, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { whatsappColors } from '../../constants/colors';

export function Chat({ log }) {
  const theme = useMantineTheme();
  // ...existing state code...

  return (
    <Paper 
      className="flex flex-col h-[600px]"
      style={{
        backgroundColor: theme.colorScheme === 'dark' 
          ? whatsappColors.darkMode 
          : whatsappColors.chatBgLight
      }}
    >
      <ChatHeader phone={log.phone} template={log.template} />
      
      <ScrollArea className="flex-grow p-4">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} isSent={msg.isSent} />
        ))}
      </ScrollArea>

      <ChatInput 
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSend={handleSend}
      />
    </Paper>
  );
}
