import { MantineProvider, Container } from '@mantine/core';
import { whatsappTheme } from '../../styles/theme';

export function AppShell({ colorScheme, children }) {
  return (
    <MantineProvider 
      withGlobalStyles 
      withNormalizeCSS
      theme={whatsappTheme(colorScheme)}
    >
      <Container size="xl" py="xl">
        {children}
      </Container>
    </MantineProvider>
  );
}
