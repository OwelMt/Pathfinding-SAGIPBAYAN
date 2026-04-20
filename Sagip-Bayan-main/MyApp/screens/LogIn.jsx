// screens/LogIn.jsx
import React, { useState, useContext } from "react";
import {
  TextInput,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
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

  const usernameRef = React.useRef(null);
const passwordRef = React.useRef(null);

  // validation errors (ONLY ON SUBMIT)
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { setUser } = useContext(UserContext);

  /* ================= SANITIZE ================= */
  const sanitizeUsername = (text) => text.replace(/[^a-zA-Z0-9]/g, "");

  /* ================= VALIDATION ================= */
  const validateUsername = (text) => {
    if (!text) return "Username is required";
    if (text.length < 3) return "Minimum 3 characters";
    return "";
  };

  const validatePassword = (text) => {
    if (!text) return "Password is required";
    if (text.length < 6) return "Minimum 6 characters";
    return "";
  };

  /* ================= LOGIN ================= */
   const handleLogin = () => {
    setError("");

    // HCI validation
    if (!username || !password) {
      setError("Make sure you enter all the fields");
      return;
    }

    api
      .post("/user/login", { username, password })
      .then((res) => {
        const data = res.data;

        if (data.twoFactor) {
          navigation.navigate("VerifyOtp", {
            userId: data.userId,
            email: data.email,
          });
          api.post("/user/send-otp", { email: data.email });
        } else {
          setUser({
            ...data.user,
            id: data.user._id,
          });

          navigation.replace("AppShell");
          setUsername("");
          setPassword("");
        }
      })
      .catch(() => {
        setError("invalid username or password");
      });
  };


  /* ================= NAV ================= */
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

  /* ================= SANITIZE INPUT ================= */
  const handleUsernameChange = (t) => {
    const clean = sanitizeUsername(t.trimStart());
    setUsername(clean);
    setUsernameError(""); // remove live validation
  };

  const handlePasswordChange = (t) => {
    setPassword(t);
    setPasswordError(""); // remove live validation
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
                value={username}
                autoCapitalize="none"
                onFocus={() => {
                  usernameRef.current?.focus();
                }}
                onChangeText={handleUsernameChange}
              />
             
             <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onFocus={() => {
                  passwordRef.current?.focus();
                }}
                onChangeText={handlePasswordChange}
              />
          
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