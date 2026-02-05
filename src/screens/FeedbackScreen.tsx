import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import emailjs from '@emailjs/browser';
import { useTranslation } from '../i18n/LanguageContext';

interface FeedbackScreenProps {
  onClose: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    from_name: '',
    from_email: '',
    message: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors = {
      from_name: '',
      from_email: '',
      message: '',
    };
    let isValid = true;

    if (!formData.from_name.trim()) {
      newErrors.from_name = t('nameRequired');
      isValid = false;
    }

    if (!formData.from_email.trim()) {
      newErrors.from_email = t('emailRequired');
      isValid = false;
    } else if (!validateEmail(formData.from_email)) {
      newErrors.from_email = t('invalidEmail');
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = t('messageRequired');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(t('error'), 'Please fill in all required fields correctly.');
      return;
    }

    setLoading(true);
    try {
      await emailjs.send(
        'service_m4hr3ab',
        'template_3ifxno8',
        formData,
        'PzUBXA4WHWVu-EzHB'
      );
      setSubmitted(true);
      setFormData({ from_name: '', from_email: '', message: '' });
    } catch (error) {
      console.error('EmailJS Error:', error);
      Alert.alert(t('error'), t('feedbackError'));
    } finally {
      setLoading(false);
    }
  };

  const handleReturnHome = () => {
    setSubmitted(false);
    onClose();
  };

  if (submitted) {
    return (
      <Modal
        visible={true}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleReturnHome}
      >
        <View style={styles.container}>
          <View style={styles.successContainer}>
            <View style={styles.checkmarkCircle}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <Text style={styles.successTitle}>{t('feedbackSuccess')}</Text>
            <Text style={styles.successMessage}>
              {t('feedbackSuccessMessage')}
            </Text>
            <TouchableOpacity style={styles.returnButton} onPress={handleReturnHome}>
              <Text style={styles.returnButtonText}>{t('returnToTimeline')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('feedbackTitle')}</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Intro Section */}
          <View style={styles.introSection}>
            <Text style={styles.introTitle}>{t('feedbackTitle')}</Text>
            <Text style={styles.introText}>
              {t('feedbackMessage')}
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Name Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('nameLabel')} *</Text>
              <TextInput
                style={[styles.input, errors.from_name && styles.inputError]}
                placeholder={t('namePlaceholder')}
                placeholderTextColor="#666"
                value={formData.from_name}
                onChangeText={(text) => {
                  setFormData({ ...formData, from_name: text });
                  setErrors({ ...errors, from_name: '' });
                }}
                editable={!loading}
              />
              {errors.from_name ? (
                <Text style={styles.errorText}>{errors.from_name}</Text>
              ) : null}
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('emailLabel')} *</Text>
              <TextInput
                style={[styles.input, errors.from_email && styles.inputError]}
                placeholder={t('emailPlaceholder')}
                placeholderTextColor="#666"
                value={formData.from_email}
                onChangeText={(text) => {
                  setFormData({ ...formData, from_email: text });
                  setErrors({ ...errors, from_email: '' });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {errors.from_email ? (
                <Text style={styles.errorText}>{errors.from_email}</Text>
              ) : null}
            </View>

            {/* Message Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('messageLabel')} *</Text>
              <TextInput
                style={[styles.textArea, errors.message && styles.inputError]}
                placeholder={t('messagePlaceholder')}
                placeholderTextColor="#666"
                value={formData.message}
                onChangeText={(text) => {
                  setFormData({ ...formData, message: text });
                  setErrors({ ...errors, message: '' });
                }}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                editable={!loading}
              />
              {errors.message ? (
                <Text style={styles.errorText}>{errors.message}</Text>
              ) : null}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.submitButtonText}>{t('loading')}</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>{t('submitFeedback')}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  introSection: {
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    color: '#aaa',
    lineHeight: 24,
  },
  formCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
  },
  textArea: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    minHeight: 120,
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#4a9eff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#2a5c8a',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 60,
    color: '#fff',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  returnButton: {
    backgroundColor: '#4a9eff',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  returnButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomPadding: {
    height: 40,
  },
});

export default FeedbackScreen;
