import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, I18nManager, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AGUIEvent {
  type:
    | 'session_start'
    | 'agent_thinking'
    | 'agent_response'
    | 'thinking'
    | 'partial_response'
    | 'final_response'
    | 'session_end'
    | 'tool_call_start'
    | 'tool_call_end'
    | 'state_delta'
    | 'error'
    | 'complete';
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

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
const TOKEN_STORAGE_KEY = 'nphies_ai_access_token';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isRTL, setIsRTL] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const lastAgentMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    I18nManager.forceRTL(isRTL);
    loadLanguagePreference();
    loadStoredToken();
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

  const loadStoredToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedToken) {
        setAuthToken(storedToken);
      }
    } catch (error) {
      console.log('Error loading auth token:', error);
    }
  };

  const toggleLanguage = async () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    const newRTL = newLang === 'ar';
    setLanguage(newLang);
    setIsRTL(newRTL);
    await AsyncStorage.setItem('language', newLang);
  };

  const appendMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const updateMessageById = (id: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg => (msg.id === id ? { ...msg, ...updates } : msg)));
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setAuthError(language === 'ar' ? 'يرجى إدخال اسم المستخدم وكلمة المرور.' : 'Please enter username and password.');
      return;
    }

    try {
      setAuthError(null);
      setIsAuthenticating(true);

      const body = new URLSearchParams();
      body.append('username', username);
      body.append('password', password);

      const response = await fetch(`${API_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      });

      if (!response.ok) {
        throw new Error(language === 'ar' ? 'بيانات اعتماد غير صحيحة.' : 'Invalid credentials.');
      }

      const data = await response.json();
      if (!data.access_token) {
        throw new Error(language === 'ar' ? 'استجابة غير متوقعة من الخادم.' : 'Unexpected server response.');
      }

      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      setAuthToken(data.access_token);
      setAuthError(null);
    } catch (error: any) {
      setAuthError(error.message || (language === 'ar' ? 'فشل تسجيل الدخول.' : 'Login failed.'));
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthToken(null);
    setSessionId('');
    setMessages([]);
  };

  const sendMessage = async (text: string, imageUri?: string) => {
    if (!text.trim() && !imageUri) return;

    try {
      const tokenToUse = authToken || (await AsyncStorage.getItem(TOKEN_STORAGE_KEY));

      if (!tokenToUse) {
        Alert.alert(language === 'ar' ? 'يتطلب تسجيل الدخول' : 'Authentication required', language === 'ar' ? 'يرجى تسجيل الدخول قبل استخدام المساعد.' : 'Please sign in before using the assistant.');
        setIsLoading(false);
        return;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: text,
        timestamp: new Date(),
        imageUri
      };

      appendMessage(userMessage);
      setInputText('');
      setIsLoading(true);

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          Authorization: `Bearer ${tokenToUse}`
        },
        body: JSON.stringify({
          message: text,
          language,
          session_id: sessionId,
          image_uri: imageUri
        })
      });

      handleAGUIEvent({ type: 'thinking', data: { message: language === 'ar' ? 'جارٍ التحليل…' : 'Analyzing your query…' } });

      let rawStream = '';
      if (response.body && (response.body as any).getReader) {
        const decoder = new TextDecoder();
        const reader = (response.body as any).getReader();
        let chunk = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunk += decoder.decode(value, { stream: true });
        }
        rawStream = chunk;
      } else {
        rawStream = await response.text();
      }

      const events = rawStream.split('\n\n').filter(Boolean);
      for (const raw of events) {
        if (!raw.startsWith('data:')) continue;
        const payloadRaw = raw.replace(/^data:\s*/, '');
        if (!payloadRaw) continue;
        try {
          const event: AGUIEvent = JSON.parse(payloadRaw);
          handleAGUIEvent(event);
        } catch (error) {
          console.log('Error parsing SSE event:', error);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'فشل في إرسال الرسالة.' : 'Failed to send the message.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAGUIEvent = (event: AGUIEvent) => {
    switch (event.type) {
      case 'session_start': {
        setSessionId(event.data.session_id);
        break;
      }
      case 'agent_thinking':
      case 'thinking': {
        const messageId = Date.now().toString();
        lastAgentMessageIdRef.current = messageId;
        appendMessage({
          id: messageId,
          type: 'system',
          content: event.data?.message || (language === 'ar' ? 'جارٍ المعالجة…' : 'Analyzing...'),
          contentAr: event.data?.message_ar,
          timestamp: new Date()
        });
        break;
      }
      case 'partial_response': {
        const targetId = lastAgentMessageIdRef.current;
        if (!targetId) {
          const newId = Date.now().toString();
          lastAgentMessageIdRef.current = newId;
          appendMessage({
            id: newId,
            type: 'agent',
            content: event.data?.text || '',
            timestamp: new Date()
          });
        } else {
          updateMessageById(targetId, {
            type: 'agent',
            content: event.data?.text || ''
          });
        }
        break;
      }
      case 'agent_response':
      case 'final_response': {
        const targetId = lastAgentMessageIdRef.current;
        if (!targetId) {
          const newId = Date.now().toString();
          appendMessage({
            id: newId,
            type: 'agent',
            content: event.data?.message || event.data?.text || '',
            contentAr: event.data?.message_ar,
            timestamp: new Date()
          });
        } else {
          updateMessageById(targetId, {
            type: 'agent',
            content: event.data?.message || event.data?.text || '',
            contentAr: event.data?.message_ar
          });
        }
        lastAgentMessageIdRef.current = null;
        break;
      }
      case 'session_end': {
        lastAgentMessageIdRef.current = null;
        break;
      }
      case 'error': {
        appendMessage({
          id: Date.now().toString(),
          type: 'system',
          content: event.data?.message || (language === 'ar' ? 'حدث خطأ في الطلب.' : 'An error occurred.'),
          timestamp: new Date()
        });
        break;
      }
      default:
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

  if (!authToken) {
    return (
      <LinearGradient
        colors={['#1a365d', '#2b6cb8', '#0ea5e9']}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingTop: 80, paddingHorizontal: 24 }}>
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: isRTL ? 'right' : 'left' }}>
              {language === 'ar' ? 'تسجيل الدخول إلى منصة نفيس' : 'Sign in to NPHIES Platform'}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8, textAlign: isRTL ? 'right' : 'left' }}>
              {language === 'ar' ? 'استخدم بيانات الاعتماد المصرح بها للوصول إلى المساعد الذكي.' : 'Use your authorized credentials to access the intelligent assistant.'}
            </Text>
          </View>

          <GlassContainer>
            <View style={{ gap: 12 }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', textAlign: isRTL ? 'right' : 'left' }}>
                {language === 'ar' ? 'بيانات الاعتماد' : 'Credentials'}
              </Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder={language === 'ar' ? 'اسم المستخدم أو معرف المزود' : 'Username or Provider ID'}
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  color: 'white',
                  textAlign: isRTL ? 'right' : 'left'
                }}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
                placeholderTextColor="rgba(255,255,255,0.5)"
                secureTextEntry
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  color: 'white',
                  textAlign: isRTL ? 'right' : 'left'
                }}
              />

              {authError ? (
                <Text style={{ color: '#f87171', fontSize: 14, textAlign: isRTL ? 'right' : 'left' }}>{authError}</Text>
              ) : null}

              <TouchableOpacity
                onPress={handleLogin}
                style={{
                  backgroundColor: '#2b6cb8',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center'
                }}
                disabled={isAuthenticating}
              >
                {isAuthenticating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleLanguage} style={{ marginTop: 12, alignSelf: isRTL ? 'flex-start' : 'flex-end' }}>
                <Text style={{ color: 'rgba(255,255,255,0.7)' }}>{language === 'ar' ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}</Text>
              </TouchableOpacity>
            </View>
          </GlassContainer>
        </View>
      </LinearGradient>
    );
  }

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
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity onPress={toggleLanguage} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{language.toUpperCase()}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: 'rgba(248,113,113,0.3)', borderRadius: 8 }}>
                <Text style={{ color: '#fee2e2', fontWeight: '600' }}>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</Text>
              </TouchableOpacity>
            </View>
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
