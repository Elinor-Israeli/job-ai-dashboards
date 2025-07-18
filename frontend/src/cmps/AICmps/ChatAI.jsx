import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

export function ChatAI() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage = {
      id: Date.now(),
      role: 'user',
      type: 'text',
      content: input,
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')

    // Simulate bot reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          type: 'custom',
          content: (
            <Box>
              <Typography variant="subtitle2">Bot Chart Example:</Typography>
              <img
                src="https://via.placeholder.com/300x150?text=Chart"
                alt="Chart"
                style={{ marginTop: 8, borderRadius: 4 }}
              />
            </Box>
          ),
        },
      ])
    }, 1000)
  }

  const renderMessage = (msg) => {
    const isUser = msg.role === 'user'
    return (
      <Box
        key={msg.id}
        display="flex"
        justifyContent={isUser ? 'flex-end' : 'flex-start'}
        mb={1}
      >
        <Paper
          elevation={1}
          sx={{
            p: 1.5,
            maxWidth: '70%',
            bgcolor: isUser ? '#1976d2' : '#f1f1f1',
            color: isUser ? '#fff' : '#000',
            borderRadius: 2,
          }}
        >
          {typeof msg.content === 'string' ? (
            <Typography variant="body2">{msg.content}</Typography>
          ) : (
            msg.content
          )}
        </Paper>
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="80vh"
      maxWidth="600px"
      mx="auto"
      mt={4}
      border={1}
      borderColor="grey.300"
      borderRadius={2}
    >
      {/* Message History */}
      <Box
        ref={containerRef}
        flexGrow={1}
        overflow="auto"
        p={2}
        sx={{ backgroundColor: '#fafafa' }}
      >
        {messages.map(renderMessage)}
      </Box>

      {/* Input Area */}
      <Box
        display="flex"
        alignItems="center"
        borderTop={1}
        borderColor="grey.300"
        p={1}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend()
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          sx={{ ml: 1 }}
          disabled={!input.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  )
}


