import React, { useMemo, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  useWindowDimensions
} from "react-native";
import createStyles, { COLORS } from "../../Designs/StepSecurity";
import { findNodeHandle } from "react-native"; // Add this import

export default function StepSecurity({
  password = "",
  confirmPassword = "",
  passwordError = "",
  confirmPasswordError = "",
  onPasswordChange,
  onConfirmChange,
  onNext,
  onBack,
  setErrors, 
  onFocus, // Added this to support your parent's scroll handler
}) {
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(width), [width]);
  
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  // 🔥 LIVE VALIDATION FOR PASSWORD
  const handlePasswordChange = (text) => {
    const clean = text.trim();
    onPasswordChange(clean);

    let pError = "";
    if (clean.length > 0 && clean.length < 8) {
      pError = "Password must be at least 8 characters";
    }

    setErrors?.((prev) => ({
      ...prev,
      password: pError,
      // If user is changing the main password, check if it now matches the confirm field
      confirmPassword: 
        confirmPassword.length > 0 && clean !== confirmPassword 
          ? "Passwords do not match" 
          : ""
    }));
  };

  // 🔥 LIVE VALIDATION FOR CONFIRM
  const handleConfirmChange = (text) => {
    const clean = text.trim();
    onConfirmChange(clean);

    setErrors?.((prev) => ({
      ...prev,
      confirmPassword: 
        clean.length > 0 && clean !== password 
          ? "Passwords do not match" 
          : ""
    }));
  };

  const isFormValid =
    password.length >= 8 &&
    confirmPassword === password &&
    !passwordError &&
    !confirmPasswordError;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.contentWrapper, { flex: 1, justifyContent: 'flex-start' }]}>
        
        <View style={styles.logoContainer}>
          <Image
            source={require("../../stores/assets/application2.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Security Setup</Text>
          <Text style={styles.subtitle}>
            Create a strong password to keep your account secure.
          </Text>
        </View>

        <View style={styles.formWrapper}>
          {/* Password Field */}
          <View style={styles.field}>
            <TextInput
  ref={passwordRef}
  style={[styles.input, passwordError ? styles.inputError : null]}
  placeholder="Password"
  secureTextEntry
  value={password}
  onChangeText={handlePasswordChange}
  /* FIX: Pass the native node handle */
  onFocus={(event) => onFocus?.(findNodeHandle(passwordRef.current))} 
  autoCapitalize="none"
  returnKeyType="next"
  onSubmitEditing={() => confirmRef.current?.focus()}
/>
            {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
          </View>

          {/* Confirm Password Field */}
          <View style={styles.field}>
            <TextInput
  ref={confirmRef}
  style={[styles.input, confirmPasswordError ? styles.inputError : null]}
  placeholder="Confirm Password"
  secureTextEntry
  value={confirmPassword}
  onChangeText={handleConfirmChange}
  /* FIX: Pass the native node handle */
  onFocus={(event) => onFocus?.(findNodeHandle(confirmRef.current))}
  autoCapitalize="none"
  returnKeyType="done"
/>
            {confirmPasswordError ? <Text style={styles.error}>{confirmPasswordError}</Text> : null}
          </View>
        </View>

        <View style={[styles.actions, { marginTop: 20 }]}>
          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            onPress={onNext}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>NEXT</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onBack} style={{ marginTop: 15, padding: 10 }}>
            <Text style={{ color: COLORS.textMuted, textAlign: 'center', fontSize: 13, fontWeight: '600' }}>
              Back to Personal Info
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
}