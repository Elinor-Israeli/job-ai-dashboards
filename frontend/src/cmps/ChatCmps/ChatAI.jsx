import { useState, useRef, useEffect } from 'react'
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { ChatTable } from './ChatTable'
import { aiService } from '../../services/ai.service'
import { ChatBarChart } from './ChatBarChart'

export function ChatAI() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      type: 'text',
      content: input,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      const data = await aiService.askQuestion(input)
      const dataType = data.mode ? data.mode : "text";

      const botMessage = {
        id: Date.now() + 1,
        role: 'bot',
        type: dataType,
        content:
          dataType === 'text' ? (
            data.message
          ) : (
            <Box>
              <Typography variant="subtitle2">{data.message}</Typography>
              {dataType === 'table' ? <ChatTable
                rows={data.result}
              /> : <ChatBarChart mode={dataType} rows={data.result} xAxis={data.x_axis} fields={data.fields} />}
            </Box>
          ),
      }

      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      console.error('AI Error:', err)
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'bot',
          type: 'text',
          content: 'Error: Unable to connect to AI service.',
        },
      ])
    }
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
      {/* Messages */}
      <Box
        ref={containerRef}
        flexGrow={1}
        overflow="auto"
        p={2}
        sx={{ backgroundColor: '#fafafa' }}
      >
        {messages.map(renderMessage)}
      </Box>

      {/* Input */}
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


