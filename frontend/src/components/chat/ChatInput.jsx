import { Group, TextInput, Button, useMantineTheme } from '@mantine/core';
import { whatsappColors } from '../../constants/colors';

export const ChatInput = ({ value, onChange, onSend }) => {
  const theme = useMantineTheme();

  return (
    <Group p="md" style={{
      backgroundColor: theme.colorScheme === 'dark' 
        ? whatsappColors.darkMode 
        : theme.white
    }}>
      <TextInput
        placeholder="Type a message..."
        value={value}
        onChange={onChange}
        className="flex-grow"
        onKeyPress={(e) => e.key === 'Enter' && onSend()}
        styles={(theme) => ({
          input: {
            backgroundColor: theme.colorScheme === 'dark' 
              ? theme.colors.dark[6] 
              : theme.white
          }
        })}
      />
      <Button 
        onClick={onSend}
        style={{
          backgroundColor: whatsappColors.brand
        }}
      >
        Send
      </Button>
    </Group>
  );
};
