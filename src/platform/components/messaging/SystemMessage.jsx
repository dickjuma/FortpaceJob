// src/components/messaging/SystemMessage.jsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { cn } from '../../../admin/utils/cn';

/**
 * SystemMessage – a UI component for displaying informational messages from the system.
 * Design guidelines:
 *   • Centered horizontally with a max width.
 *   • Muted background (theme.palette.background.default with slight opacity).
 *   • Rounded corners and subtle shadow for a premium look.
 *   • Italic text styling and secondary text colour.
 *   • Accessible ARIA role="status" for screen‑readers.
 */
export default function SystemMessage({ children }) {
  const theme = useTheme();
  return (
    <Box
      role="status"
      aria-live="polite"
      className={cn(
        "flex justify-center w-full my-2",
        "pointer-events-none"
      )}
    >
      <Box
        className={cn(
          "px-4 py-2",
          "rounded-lg",
          "bg-opacity-80",
          "shadow-sm"
        )}
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.secondary,
          maxWidth: 600,
        }}
      >
        <Typography variant="body2" component="div" sx={{ fontStyle: 'italic' }}>
          {children}
        </Typography>
      </Box>
    </Box>
  );
}
