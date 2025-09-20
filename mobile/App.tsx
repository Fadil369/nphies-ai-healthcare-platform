import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, I18nManager } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AGUIEvent {
  type: 'session_start' | 'agent_thinking' | 'agent_response' | 'tool_call_start' | 'tool_call_end' | 'state_delta' | 'error' | 'complete';
  data: any;
}

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  contentAr?: string;
  timestamp: Date;
  imageUri?: string;
}

const API_URL = 'http://brainsait-nphies-alb-1821626782.us-east-1.elb.amazonaws.com';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isRTL, setIsRTL] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    I18nManager.forceRTL(isRTL);
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('language');
      if (savedLang) {
        setLanguage(savedLang as 'ar' | 'en');
        setIsRTL(savedLang === 'ar');
      }
    } catch (error) {
      console.log('Error loading language preference:', error);
    }
  };

  const toggleLanguage = async () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    const newRTL = newLang === 'ar';
    setLanguage(newLang);
    setIsRTL(newRTL);
    await AsyncStorage.setItem('language', newLang);
  };

  const sendMessage = async (text: string, imageUri?: string) => {
    if (!text.trim() && !imageUri) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
      imageUri
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          session_id: sessionId,
          image_uri: imageUri
        })
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event: AGUIEvent = JSON.parse(line.slice(6));
              handleAGUIEvent(event);
            } catch (e) {
              console.log('Error parsing SSE event:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('خطأ', 'فشل في إرسال الرسالة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAGUIEvent = (event: AGUIEvent) => {
    switch (event.type) {
      case 'session_start':
        setSessionId(event.data.session_id);
        break;
      case 'agent_thinking':
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'system',
          content: event.data.message,
          contentAr: 'جاري المعالجة...',
          timestamp: new Date()
        }]);
        break;
      case 'agent_response':
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'agent',
          content: event.data.message,
          contentAr: event.data.message_ar,
          timestamp: new Date()
        }]);
        break;
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      sendMessage('تحليل الصورة الطبية', imageUri);
    }
  };

  const GlassContainer = ({ children, style = {} }: any) => (
    <View style={[{
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      padding: 16,
      backdropFilter: 'blur(10px)',
    }, style]}>
      {children}
    </View>
  );

  return (
    <LinearGradient
      colors={['#1a365d', '#2b6cb8', '#0ea5e9']}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 16 }}>
        {/* Header */}
        <GlassContainer style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
              {language === 'ar' ? 'برين سايت - نفيس الذكي' : 'BrainSAIT NPHIES-AI'}
            </Text>
            <TouchableOpacity onPress={toggleLanguage} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{language.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </GlassContainer>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1, marginBottom: 16 }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
        >
          {messages.map((message) => (
            <View key={message.id} style={{ marginBottom: 12 }}>
              <GlassContainer style={{
                alignSelf: message.type === 'user' ? (isRTL ? 'flex-start' : 'flex-end') : (isRTL ? 'flex-end' : 'flex-start'),
                maxWidth: '80%',
                backgroundColor: message.type === 'user' ? 'rgba(46, 108, 184, 0.3)' : 'rgba(255, 255, 255, 0.1)'
              }}>
                {message.imageUri && (
                  <Image source={{ uri: message.imageUri }} style={{ width: 200, height: 150, borderRadius: 8, marginBottom: 8 }} />
                )}
                <Text style={{ color: 'white', fontSize: 16, textAlign: isRTL ? 'right' : 'left' }}>
                  {language === 'ar' && message.contentAr ? message.contentAr : message.content}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4, textAlign: isRTL ? 'right' : 'left' }}>
                  {message.timestamp.toLocaleTimeString()}
                </Text>
              </GlassContainer>
            </View>
          ))}
          {isLoading && (
            <GlassContainer style={{ alignSelf: isRTL ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <Text style={{ color: 'white', fontStyle: 'italic' }}>
                {language === 'ar' ? 'جاري الكتابة...' : 'Typing...'}
              </Text>
            </GlassContainer>
          )}
        </ScrollView>

        {/* Input */}
        <GlassContainer>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
            <TextInput
              style={{
                flex: 1,
                color: 'white',
                fontSize: 16,
                textAlign: isRTL ? 'right' : 'left',
                paddingVertical: 12,
                paddingHorizontal: 16
              }}
              value={inputText}
              onChangeText={setInputText}
              placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message...'}
              placeholderTextColor="rgba(255,255,255,0.6)"
              multiline
            />
            <TouchableOpacity onPress={pickImage} style={{ padding: 12, marginHorizontal: 4 }}>
              <Text style={{ color: 'white', fontSize: 20 }}>📷</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => sendMessage(inputText)}
              style={{ padding: 12, backgroundColor: 'rgba(46, 108, 184, 0.5)', borderRadius: 8 }}
            >
              <Text style={{ color: 'white', fontSize: 20 }}>{isRTL ? '←' : '→'}</Text>
            </TouchableOpacity>
          </View>
        </GlassContainer>
      </View>
    </LinearGradient>
  );
}
