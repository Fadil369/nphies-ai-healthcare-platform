// BRAINSAIT: NPHIES-AI Mobile App with AG-UI Protocol Integration
// NEURAL: Glass morphism UI with BrainSAIT design system
// BILINGUAL: RTL/LTR adaptive layout for Arabic/English

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  I18nManager
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolateColor
} from 'react-native-reanimated';

// BRAINSAIT: BrainSAIT Color Palette
const BrainSAITColors = {
  midnightBlue: '#1a365d',
  medicalBlue: '#2b6cb8',
  signalTeal: '#0ea5e9',
  deepOrange: '#ea580c',
  professionalGray: '#64748b',
  white: '#ffffff',
  black: '#000000',
  violet: '#8b5cf6',
  glassMorphBg: 'rgba(255, 255, 255, 0.1)',
  glassMorphBorder: 'rgba(255, 255, 255, 0.2)'
};

// AG-UI Protocol Event Types
type AGUIEventType = 
  | 'text_message_content'
  | 'tool_call_start'
  | 'tool_call_end'
  | 'state_delta'
  | 'thinking'
  | 'error'
  | 'complete';

interface AGUIEvent {
  type: AGUIEventType;
  data: any;
  timestamp: string;
  session_id: string;
}

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  bilingual?: {
    ar: string;
    en: string;
  };
  imageAnalysis?: any;
  isStreaming?: boolean;
}

interface UserContext {
  userId: string;
  userRole: 'provider' | 'payer' | 'patient' | 'auditor';
  language: 'ar' | 'en';
  sessionId: string;
}

// NEURAL: Glass Morphism Components
const GlassContainer: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <BlurView intensity={20} style={[styles.glassContainer, style]}>
    {children}
  </BlurView>
);

const MeshGradientBackground: React.FC = () => {
  const animationValue = useSharedValue(0);
  
  useEffect(() => {
    const animate = () => {
      animationValue.value = withSpring(animationValue.value === 0 ? 1 : 0, {
        duration: 3000
      });
    };
    
    const interval = setInterval(animate, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationValue.value,
      [0, 1],
      [BrainSAITColors.black, BrainSAITColors.midnightBlue]
    );
    
    return { backgroundColor };
  });
  
  return (
    <Animated.View style={[styles.meshGradient, animatedStyle]}>
      <LinearGradient
        colors={[
          BrainSAITColors.violet,
          BrainSAITColors.medicalBlue,
          BrainSAITColors.signalTeal
        ]}
        style={styles.gradientOverlay}
        locations={[0, 0.5, 1]}
      />
    </Animated.View>
  );
};

// BRAINSAIT: Main NPHIES-AI Chat Component
const NPHIESChatApp: React.FC = () => {
  // BILINGUAL: Language and RTL support
  const [isRTL, setIsRTL] = useState(I18nManager.isRTL);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  
  // Chat state management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  // User context
  const [userContext] = useState<UserContext>({
    userId: 'user-123',
    userRole: 'provider',
    language: language,
    sessionId: generateSessionId()
  });
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  function generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // BILINGUAL: Text content
  const texts = {
    ar: {
      title: 'مساعد نفيس الذكي',
      subtitle: 'BrainSAIT للرعاية الصحية',
      placeholder: 'اكتب رسالتك هنا...',
      uploadImage: 'رفع صورة طبية',
      send: 'إرسال',
      thinking: 'جاري التفكير...',
      analyzing: 'جاري تحليل الصورة...',
      processing: 'معالجة طلب نفيس...'
    },
    en: {
      title: 'NPHIES AI Assistant',
      subtitle: 'BrainSAIT Healthcare',
      placeholder: 'Type your message here...',
      uploadImage: 'Upload Medical Image',
      send: 'Send',
      thinking: 'Thinking...',
      analyzing: 'Analyzing image...',
      processing: 'Processing NPHIES request...'
    }
  };
  
  const t = texts[language];
  
  // AGENT: AG-UI Protocol Integration
  const sendMessageToAgent = useCallback(async (message: string, images?: string[]) => {
    if (!message.trim() && !images?.length) return;
    
    setIsStreaming(true);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Create streaming response placeholder
    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-assistant`,
      content: '',
      isUser: false,
      timestamp: new Date(),
      isStreaming: true
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    try {
      // AGENT: Prepare AG-UI request
      const agUIRequest = {
        message: message,
        user_id: userContext.userId,
        user_role: userContext.userRole,
        session_id: userContext.sessionId,
        nphies_data: message.includes('claim') || message.includes('مطالبة') ? {
          patient_id: 'patient-123',
          provider_id: 'provider-456',
          claim_data: {
            resourceType: 'Claim',
            id: 'claim-example',
            status: 'active'
          },
          language: language
        } : null,
        multimodal_data: images?.length ? {
          images: images,
          analysis_type: 'medical_imaging'
        } : null
      };
      
      // AGENT: Connect to AG-UI Protocol endpoint
      const response = await fetch('http://localhost:8000/ag-ui/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(agUIRequest)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const eventData = JSON.parse(line.slice(6));
                handleAGUIEvent(eventData, assistantMessage.id);
              } catch (e) {
                console.error('Failed to parse AG-UI event:', e);
              }
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'فشل في رفع الصورة' : 'Failed to upload image'
      );
    }
  };
  
  // BILINGUAL: Language toggle
  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    I18nManager.forceRTL(newLanguage === 'ar');
    setIsRTL(newLanguage === 'ar');
  };
  
  // NEURAL: Message component with glass morphism
  const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const bubbleStyle = message.isUser 
      ? [styles.userBubble, { alignSelf: isRTL ? 'flex-start' : 'flex-end' }]
      : [styles.assistantBubble, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }];
    
    return (
      <View style={bubbleStyle}>
        <GlassContainer style={styles.messageBubbleContainer}>
          <Text style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.assistantMessageText,
            { textAlign: isRTL ? 'right' : 'left' }
          ]}>
            {message.content}
          </Text>
          
          {message.bilingual && (
            <View style={styles.bilingualContainer}>
              <Text style={styles.bilingualLabel}>
                {language === 'ar' ? 'الترجمة:' : 'Translation:'}
              </Text>
              <Text style={[styles.bilingualText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {language === 'ar' ? message.bilingual.en : message.bilingual.ar}
              </Text>
            </View>
          )}
          
          {message.imageAnalysis && (
            <View style={styles.imageAnalysisContainer}>
              <Text style={styles.analysisTitle}>
                🏥 {language === 'ar' ? 'تحليل الصورة الطبية' : 'Medical Image Analysis'}
              </Text>
              <Text style={styles.analysisContent}>
                {message.imageAnalysis.findings}
              </Text>
              {message.imageAnalysis.icd_codes && (
                <Text style={styles.icdCodes}>
                  ICD-10: {message.imageAnalysis.icd_codes.join(', ')}
                </Text>
              )}
            </View>
          )}
          
          {message.isStreaming && (
            <View style={styles.streamingIndicator}>
              <Text style={styles.streamingText}>●●●</Text>
            </View>
          )}
          
          <Text style={styles.timestamp}>
            {message.timestamp.toLocaleTimeString()}
          </Text>
        </GlassContainer>
      </View>
    );
  };
  
  // NEURAL: Animated send button
  const AnimatedSendButton: React.FC<{ onPress: () => void; disabled: boolean }> = ({ onPress, disabled }) => {
    const scale = useSharedValue(1);
    
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }]
    }));
    
    const handlePress = () => {
      scale.value = withSpring(0.9, {}, () => {
        scale.value = withSpring(1);
      });
      onPress();
    };
    
    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
          onPress={handlePress}
          disabled={disabled}
        >
          <LinearGradient
            colors={[BrainSAITColors.medicalBlue, BrainSAITColors.signalTeal]}
            style={styles.sendButtonGradient}
          >
            <Text style={styles.sendButtonText}>
              {isRTL ? '←' : '→'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <MeshGradientBackground />
      
      {/* BRAINSAIT: Header with glass morphism */}
      <GlassContainer style={styles.header}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t.title}
            </Text>
            <Text style={[styles.subtitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t.subtitle}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
            <Text style={styles.languageToggleText}>
              {language === 'ar' ? 'EN' : 'ع'}
            </Text>
          </TouchableOpacity>
        </View>
      </GlassContainer>
      
      {/* AGENT: Chat messages area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && (
          <GlassContainer style={styles.welcomeContainer}>
            <Text style={[styles.welcomeText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {language === 'ar' 
                ? 'مرحباً بك في مساعد نفيس الذكي\nيمكنني مساعدتك في معالجة المطالبات الطبية وتحليل الصور'
                : 'Welcome to NPHIES AI Assistant\nI can help you process medical claims and analyze images'
              }
            </Text>
          </GlassContainer>
        )}
        
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </ScrollView>
      
      {/* MEDICAL: Uploaded images preview */}
      {uploadedImages.length > 0 && (
        <GlassContainer style={styles.imagePreviewContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {uploadedImages.map((imageUri, index) => (
              <View key={index} style={styles.imagePreview}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </GlassContainer>
      )}
      
      {/* BRAINSAIT: Input area with glass morphism */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputKeyboardAvoid}
      >
        <GlassContainer style={styles.inputContainer}>
          <View style={[styles.inputRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity style={styles.imageButton} onPress={handleImageUpload}>
              <LinearGradient
                colors={[BrainSAITColors.deepOrange, BrainSAITColors.signalTeal]}
                style={styles.imageButtonGradient}
              >
                <Text style={styles.imageButtonText}>📷</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TextInput
              style={[
                styles.textInput,
                { 
                  textAlign: isRTL ? 'right' : 'left',
                  writingDirection: isRTL ? 'rtl' : 'ltr'
                }
              ]}
              value={inputText}
              onChangeText={setInputText}
              placeholder={t.placeholder}
              placeholderTextColor={BrainSAITColors.professionalGray}
              multiline
              maxLength={1000}
              editable={!isStreaming}
            />
            
            <AnimatedSendButton
              onPress={() => sendMessageToAgent(inputText, uploadedImages)}
              disabled={(!inputText.trim() && uploadedImages.length === 0) || isStreaming}
            />
          </View>
        </GlassContainer>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// NEURAL: Styles with BrainSAIT design system
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrainSAITColors.black,
  },
  
  meshGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  gradientOverlay: {
    flex: 1,
    opacity: 0.6,
  },
  
  glassContainer: {
    backgroundColor: BrainSAITColors.glassMorphBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BrainSAITColors.glassMorphBorder,
    overflow: 'hidden',
  },
  
  header: {
    margin: 16,
    marginBottom: 8,
  },
  
  headerContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  titleContainer: {
    flex: 1,
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BrainSAITColors.white,
    fontFamily: 'IBM Plex Sans Arabic',
  },
  
  subtitle: {
    fontSize: 14,
    color: BrainSAITColors.signalTeal,
    marginTop: 4,
    fontFamily: 'IBM Plex Sans Arabic',
  },
  
  languageToggle: {
    backgroundColor: BrainSAITColors.medicalBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  
  languageToggleText: {
    color: BrainSAITColors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  messagesContent: {
    paddingVertical: 8,
  },
  
  welcomeContainer: {
    margin: 16,
    padding: 24,
    alignItems: 'center',
  },
  
  welcomeText: {
    color: BrainSAITColors.white,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'IBM Plex Sans Arabic',
  },
  
  userBubble: {
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: '80%',
  },
  
  assistantBubble: {
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: '85%',
  },
  
  messageBubbleContainer: {
    padding: 12,
  },
  
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'IBM Plex Sans Arabic',
  },
  
  userMessageText: {
    color: BrainSAITColors.white,
  },
  
  assistantMessageText: {
    color: BrainSAITColors.white,
  },
  
  bilingualContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: BrainSAITColors.glassMorphBorder,
  },
  
  bilingualLabel: {
    fontSize: 12,
    color: BrainSAITColors.professionalGray,
    marginBottom: 4,
  },
  
  bilingualText: {
    fontSize: 14,
    color: BrainSAITColors.signalTeal,
    fontStyle: 'italic',
  },
  
  imageAnalysisContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(43, 108, 184, 0.2)',
    borderRadius: 8,
  },
  
  analysisTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: BrainSAITColors.medicalBlue,
    marginBottom: 4,
  },
  
  analysisContent: {
    fontSize: 14,
    color: BrainSAITColors.white,
    marginBottom: 4,
  },
  
  icdCodes: {
    fontSize: 12,
    color: BrainSAITColors.signalTeal,
    fontFamily: 'monospace',
  },
  
  streamingIndicator: {
    alignItems: 'center',
    marginTop: 8,
  },
  
  streamingText: {
    color: BrainSAITColors.signalTeal,
    fontSize: 18,
    opacity: 0.7,
  },
  
  timestamp: {
    fontSize: 10,
    color: BrainSAITColors.professionalGray,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  
  imagePreviewContainer: {
    margin: 16,
    marginBottom: 8,
    padding: 8,
  },
  
  imagePreview: {
    position: 'relative',
    marginRight: 8,
  },
  
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  
  removeImageButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: BrainSAITColors.deepOrange,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  removeImageText: {
    color: BrainSAITColors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  inputKeyboardAvoid: {
    paddingBottom: Platform.OS === 'ios' ? 0 : 16,
  },
  
  inputContainer: {
    margin: 16,
    marginTop: 8,
  },
  
  inputRow: {
    padding: 12,
    alignItems: 'flex-end',
  },
  
  imageButton: {
    marginRight: 8,
  },
  
  imageButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  imageButtonText: {
    fontSize: 18,
  },
  
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    color: BrainSAITColors.white,
    fontSize: 16,
    maxHeight: 100,
    fontFamily: 'IBM Plex Sans Arabic',
  },
  
  sendButton: {
    marginLeft: 8,
  },
  
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  sendButtonDisabled: {
    opacity: 0.5,
  },
  
  sendButtonText: {
    color: BrainSAITColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NPHIESChatApp;
      console.error('AG-UI Protocol error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content: `خطأ في الاتصال / Connection error: ${error}`, isStreaming: false }
          : msg
      ));
    } finally {
      setIsStreaming(false);
    }
  }, [userContext, language]);
  
  // AGENT: Handle AG-UI Protocol events
  const handleAGUIEvent = (event: AGUIEvent, messageId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      
      switch (event.type) {
        case 'text_message_content':
          return {
            ...msg,
            content: event.data.content,
            bilingual: event.data.bilingual,
            imageAnalysis: event.data.image_analysis,
            isStreaming: false
          };
          
        case 'thinking':
          return {
            ...msg,
            content: event.data.content,
            isStreaming: true
          };
          
        case 'tool_call_start':
          return {
            ...msg,
            content: `🔧 ${event.data.description}`,
            isStreaming: true
          };
          
        case 'state_delta':
          return {
            ...msg,
            content: msg.content + `\n📊 ${JSON.stringify(event.data, null, 2)}`,
            isStreaming: true
          };
          
        case 'error':
          return {
            ...msg,
            content: `❌ ${event.data.error}`,
            isStreaming: false
          };
          
        case 'complete':
          return {
            ...msg,
            isStreaming: false
          };
          
        default:
          return msg;
      }
    }));
  };
  
  // MEDICAL: Image upload functionality
  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setUploadedImages(prev => [...prev, imageUri]);
        
        // MEDICAL: Upload to secure backend
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'medical-image.jpg',
        } as any);
        formData.append('user_id', userContext.userId);
        formData.append('session_id', userContext.sessionId);
        
        const uploadResponse = await fetch('http://localhost:8000/upload/medical-image', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (uploadResponse.ok) {
          Alert.alert(
            language === 'ar' ? 'تم الرفع' : 'Upload Complete',
            language === 'ar' ? 'تم رفع الصورة الطبية بنجاح' : 'Medical image uploaded successfully'
          );
        }
      }
    } catch (error) {