import React, { useRef, useState, useMemo } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  View,
  useWindowDimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import createStyles, { COLORS } from "../../Designs/SignUp";

export default function StepMobile({
  phone,
  email,
  onPhoneChange,
  onEmailChange,
  onBack,
  onSubmit,
  serverError, // New prop to pass errors from the API back to the UI
}) {
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(width), [width]);
  const [localErrors, setLocalErrors] = useState({});

  const phoneRef = useRef(null);
  const emailRef = useRef(null);

  // --- Handlers & Validation ---

  const handlePhone = (t) => {
    // Sanitization: Only allow numbers
    const clean = t.replace(/[^0-9]/g, "");
    onPhoneChange(clean);

    // Validation Logic (Matches PH format)
    if (!clean) {
      setLocalErrors((p) => ({ ...p, phone: "Required" }));
    } else if (!clean.startsWith("09")) {
      setLocalErrors((p) => ({ ...p, phone: "Must start with 09" }));
    } else if (clean.length !== 11) {
      setLocalErrors((p) => ({ ...p, phone: "Must be 11 digits" }));
    } else {
      setLocalErrors((p) => ({ ...p, phone: "" }));
    }
  };

  const handleEmail = (t) => {
    const clean = t.replace(/\s/g, "").toLowerCase();
    onEmailChange(clean);

    // Advanced Regex: Requires a domain with a dot (e.g., .com, .net, .org)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    if (!clean) {
      setLocalErrors((p) => ({ ...p, email: "Required" }));
    } else if (!clean.includes("@")) {
      setLocalErrors((p) => ({ ...p, email: "Missing '@' symbol" }));
    } else if (!emailRegex.test(clean)) {
      setLocalErrors((p) => ({ ...p, email: "Enter a complete email (e.g. .com)" }));
    } else {
      setLocalErrors((p) => ({ ...p, email: "" }));
    }
  };
  // Submission Guard: Prevents hitting the API if local rules aren't met
  const isFormValid = 
    phone.length === 11 && 
    phone.startsWith("09") && 
    !localErrors.phone && 
    !localErrors.email && 
    email.trim() !== "";

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.contentWrapper, { flex: 1, justifyContent: "flex-start" }]}>
            
            {/* ILLUSTRATION */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../../stores/assets/application3.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* HEADER */}
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Mobile Registration</Text>
              <Text style={styles.subtitle}>
                Provide contact details so we can verify your account.
              </Text>
            </View>

            {/* FORM */}
            <View style={styles.formWrapper}>
              
              {/* Phone Input */}
              <View style={styles.field}>
                <TextInput
                  ref={phoneRef}
                  style={[styles.input, (localErrors.phone || (serverError && serverError.includes("Phone"))) && styles.inputError]}
                  placeholder="Phone Number (09XXXXXXXXX)"
                  placeholderTextColor={COLORS.placeholder}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={handlePhone}
                  maxLength={11}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  blurOnSubmit={false}
                />
                {/* Prioritize local errors, fallback to server errors */}
                {(localErrors.phone || (serverError && serverError.includes("Phone"))) ? (
                  <Text style={styles.error}>{localErrors.phone || serverError}</Text>
                ) : null}
              </View>

              {/* Email Input */}
              <View style={styles.field}>
                <TextInput
                  ref={emailRef}
                  style={[styles.input, (localErrors.email || (serverError && serverError.includes("Email"))) && styles.inputError]}
                  placeholder="Email Address"
                  placeholderTextColor={COLORS.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={handleEmail}
                  returnKeyType="done"
                  onSubmitEditing={isFormValid ? onSubmit : Keyboard.dismiss}
                />
                {(localErrors.email || (serverError && serverError.includes("Email"))) ? (
                  <Text style={styles.error}>{localErrors.email || serverError}</Text>
                ) : null}
              </View>
            </View>

            {/* ACTIONS */}
            <View style={[styles.actions, { marginTop: 30 }]}>
              <TouchableOpacity
                style={[styles.button, !isFormValid && { opacity: 0.5 }]}
                onPress={onSubmit}
                disabled={!isFormValid}
              >
                <Text style={styles.buttonText}>SUBMIT</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onBack} style={{ marginTop: 15 }}>
                <Text style={{ color: COLORS.placeholder, textAlign: 'center' }}>Go Back</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}