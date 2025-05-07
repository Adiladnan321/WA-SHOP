export const whatsappTheme = (colorScheme) => ({
  colorScheme,
  primaryColor: 'teal',
  colors: {
    whatsapp: [
      '#dcf8c6',
      '#25D366',
      '#34B7F1',
      '#075E54',
      '#128C7E',
      '#ECE5DD',
      '#0D1418',
      '#1F2C34',
    ],
  },
  components: {
    Paper: {
      styles: (theme) => ({
        root: {A
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.whatsapp[7] : 'white',
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        }
      })
    },
    Container: {
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.whatsapp[6] : '#F0F2F5',
          minHeight: '100vh',
          width: '100%',
          maxWidth: '100%',
          padding: '1rem'
        }
      })
    }
  }
});
