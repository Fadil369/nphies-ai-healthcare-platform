/*
 * BrainSAIT branded chat front‑end using React Native.
 *
 * This component demonstrates how to build a mobile chat interface
 * that communicates with the backend FastAPI server via the AG‑UI
 * protocol.  Messages are displayed in conversation bubbles with
 * BrainSAIT colours, and an input bar allows users to send
 * messages.  When a message is sent, a `RunAgentInput` payload
 * is created and posted to the backend.  The response is read
 * as a streaming Server‑Sent Events (SSE) response and new
 * assistant messages are appended to the chat in real time.
 *
 * To run this app:
 *   1. Install Expo CLI globally (`npm install -g expo-cli`).
 *   2. Create a new project with this file as `App.js`.
 *   3. Run `expo start` and open it on a simulator or device.
 *   4. Ensure the backend server is running on a reachable URL.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';

// Define the URL of your backend API here.  When running on a
// physical device, replace localhost with your machine's IP.
const API_URL = 'http://localhost:9000';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [threadId] = useState(uuidv4());

  /**
   * Send the current input text to the backend and handle the
   * streaming response.  This function constructs a RunAgentInput
   * object with a unique message ID and posts it to the AG‑UI
   * endpoint.  The Accept header requests a server‑sent events
   * stream.  As SSE events arrive, assistant messages are
   * appended to the conversation.
   */
  const sendMessage = async () => {
    if (!inputText.trim()) {
      return;
    }
    const userMsgId = uuidv4();
    const userMessage = { id: userMsgId, role: 'user', content: inputText };
    setMessages((prev) => [...prev, userMessage]);

    const runInput = {
      thread_id: threadId,
      messages: [userMessage],
      state: {},
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify(runInput),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      // Read the response as a stream and parse SSE messages
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Split the buffer on double newline which signals end of event
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const rawEvent of events) {
          // Each SSE line may begin with "data: "
          const line = rawEvent.trim();
          if (line.startsWith('data: ')) {
            const payload = line.slice(6);
            try {
              const eventObj = JSON.parse(payload);
              // Look for text content events; other event types can be
              // handled as needed (state updates, tool calls, etc.)
              if (eventObj.type === 'TEXT_MESSAGE_CONTENT') {
                const assistantMessage = {
                  id: eventObj.id || uuidv4(),
                  role: 'assistant',
                  content: eventObj.text,
                };
                setMessages((prev) => [...prev, assistantMessage]);
              }
            } catch (err) {
              console.warn('Failed to parse SSE payload', err);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
    setInputText('');
  };

  // Render each message in a styled bubble
  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble,
          { alignSelf: isUser ? 'flex-end' : 'flex-start' },
        ]}
      >
        <Text style={isUser ? styles.userText : styles.botText}>{item.content}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Placeholder for BrainSAIT logo; replace with an Image component */}
        <Text style={styles.headerTitle}>BrainSAIT Assistant</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message…"
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Send" onPress={sendMessage} color={styles.sendButton.color} />
      </View>
    </SafeAreaView>
  );
}

// Define BrainSAIT colours and styling
const BRAND_PRIMARY = '#663399'; // purple tone for brand
const BRAND_SECONDARY = '#00A287'; // teal accent

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: BRAND_PRIMARY,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bubble: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: BRAND_PRIMARY,
  },
  botBubble: {
    backgroundColor: '#e0e0e0',
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  sendButton: {
    color: BRAND_SECONDARY,
  },
});