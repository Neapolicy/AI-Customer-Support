'use client'
import { useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi, I'm the Headstarter Support Agent, how can I assist you today?"
    }
  ]);

  const [message, setMessage] = useState('');

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center"
    >
      <Stack
        direction={"column"}
        width={"600px"}
        height={"700px"}
        border="1px solid black"
        padding={2}
        spacing={2}
      >
        <Stack
          direction={"column"}
          spacing={2}
          flexGrow={1}
          overflow={'auto'}
          maxHeight={"100%"}
        >
          {
            messages.map((message, index) => (
              <Box 
                key={index} 
                display={'flex'} 
                justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
              >
                <Box
                  bgcolor={message.role === 'assistant' ? "primary.main" : "secondary.main"}
                  color="white"
                  borderRadius={16}
                  padding={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))
          }
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <TextField
          label = "message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained">Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
