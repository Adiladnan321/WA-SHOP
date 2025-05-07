import { Group, Avatar, Text, useMantineTheme } from '@mantine/core';
import { whatsappColors } from '../../constants/colors';

export const ChatHeader = ({ phone, template }) => {
  const theme = useMantineTheme();
  
  return (
    <Group p="md" className="border-b" style={{
      backgroundColor: theme.colorScheme === 'dark' 
        ? whatsappColors.darkMode 
        : theme.white
    }}>
      <Avatar 
        color="teal" 
        radius="xl"
        style={{ backgroundColor: whatsappColors.brand }}
      >
        {phone.slice(-2)}
      </Avatar>
      <div>
        <Text weight={500}>{phone}</Text>
        <Text size="xs" color="dimmed">Template: {template}</Text>
      </div>
    </Group>
  );
};
