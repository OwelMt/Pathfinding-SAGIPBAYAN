// screens/LogIn.jsx
import React, { useState, useContext, useRef } from "react";
import {
  TextInput,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Alert
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../lib/api";
import styles, { COLORS } from "../Designs/LogIn";
import { UserContext } from "./UserContext";

export default function LogIn({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const { setUser } = useContext(UserContext);

  /* ================= SANITIZE ================= */
  const sanitizeUsername = (text) => text.replace(/[^a-zA-Z0-9]/g, "");

  /* ================= LOGIN LOGIC ================= */
  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      const res = await api.post("/user/login", { username, password });
      const data = res.data;

      if (data.twoFactor) {
        // Send OTP first, then navigate
        await api.post("/user/send-otp", { email: data.email });
        navigation.navigate("VerifyOtp", {
          userId: data.userId,
          email: data.email,
        });
      } else {
        setUser({
          ...data.user,
          id: data.user._id,
        });

        navigation.replace("AppShell");
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      // ✅ Captures specific error from backend (e.g., "User not found" or "Incorrect password")
      const backendMessage = err.response?.data?.error || "Invalid username or password";
      setError(backendMessage);
    }
  };

  /* ================= NAVIGATION ================= */
  const handleGoToSignup = async () => {
    try {
      const accepted = await AsyncStorage.getItem("privacyAccepted");
      accepted === "true"
        ? navigation.navigate("SignUp")
        : navigation.navigate("PrivacyGate");
    } catch {
      navigation.navigate("PrivacyGate");
    }
  };

  const handleForgotPassword = () => {
    // Navigate to your Forgot Password screen
    navigation.navigate("ForgotPassword"); 
  };

  /* ================= INPUT HANDLERS ================= */
  const handleUsernameChange = (t) => {
    const clean = sanitizeUsername(t.trimStart());
    setUsername(clean);
    if (error) setError(""); 
  };

  const handlePasswordChange = (t) => {
    setPassword(t);
    if (error) setError("");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <KeyboardAwareScrollView
           contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={0}   // 👈 IMPORTANT (remove jump difference)
          enableAutomaticScroll={false} // 👈 IMPORTANT (prevents uneven behavior)
        >
          <View style={styles.pageContainer}>

            <Image
              source={require("../stores/assets/sagipbayanlogowhite.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.panel}>
              <Text style={styles.panelTitle}>LOG IN ACCOUNT</Text>

              <TextInput
                ref={usernameRef}
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={COLORS.placeholder}
                value={username}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                onChangeText={handleUsernameChange}
              />
              
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.placeholder}
                secureTextEntry
                value={password}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                onChangeText={handlePasswordChange}
              />

              {/* ✅ Forgot Password Link - UI Friendly placement */}
              <TouchableOpacity 
                onPress={handleForgotPassword}
                style={{ alignSelf: 'flex-end', marginBottom: 15, marginTop: -5 }}
              >
                <Text style={{ color: COLORS.placeholder, fontSize: 14, textDecorationLine: 'underline' }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
          
              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>LOGIN</Text>
              </TouchableOpacity>

              <Text style={styles.helperText}>
                don’t have an account?
              </Text>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleGoToSignup}
              >
                <Text style={styles.secondaryButtonText}>
                  SIGN UP
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}