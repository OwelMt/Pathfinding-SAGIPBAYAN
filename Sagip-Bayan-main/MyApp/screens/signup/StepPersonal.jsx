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

export default function StepPersonal({
  fName,
  lName,
  username,
  onFNameChange,
  onLNameChange,
  onUsernameChange,
  onNext,
  geoDebug,
  onToggleGeoDebug,
}) {
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(width), [width]);
  const [errors, setErrors] = useState({});

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const usernameRef = useRef(null);

  const handleFName = (t) => { 
    const clean = t.replace(/[^a-zA-Z\s]/g, "");
    onFNameChange(clean); 
    if (!clean.trim()) setErrors(p => ({...p, fName: "Required"}));
    else setErrors(p => ({...p, fName: ""}));
  };

  const handleLName = (t) => { 
    const clean = t.replace(/[^a-zA-Z\s]/g, "");
    onLNameChange(clean); 
    if (!clean.trim()) setErrors(p => ({...p, lName: "Required"}));
    else setErrors(p => ({...p, lName: ""}));
  };

  const handleUsername = (t) => { 
    const clean = t.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
    onUsernameChange(clean); 
    if (clean.length < 4) setErrors(p => ({...p, username: "Min 4 chars"}));
    else setErrors(p => ({...p, username: ""}));
  };

  const isFormValid = fName && lName && username && !errors.fName && !errors.lName && !errors.username;

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.contentWrapper, { flex: 1, justifyContent: 'flex-start' }]}>
            
            {/* LOGO */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../../stores/assets/application1.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* HEADER */}
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Personal Information</Text>
              <Text style={styles.subtitle}>Fill in your details to continue</Text>
            </View>

            {/* FORM */}
            <View style={styles.formWrapper}>
              <View style={styles.field}>
                <TextInput
                  ref={firstNameRef}
                  style={[styles.input, errors.fName && styles.inputError]}
                  placeholder="First Name"
                  placeholderTextColor={COLORS.placeholder}
                  value={fName}
                  onChangeText={handleFName}
                  returnKeyType="next"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                  blurOnSubmit={false}
                />
                {errors.fName ? <Text style={styles.error}>{errors.fName}</Text> : null}
              </View>

              <View style={styles.field}>
                <TextInput
                  ref={lastNameRef}
                  style={[styles.input, errors.lName && styles.inputError]}
                  placeholder="Last Name"
                  placeholderTextColor={COLORS.placeholder}
                  value={lName}
                  onChangeText={handleLName}
                  returnKeyType="next"
                  onSubmitEditing={() => usernameRef.current?.focus()}
                  blurOnSubmit={false}
                />
                {errors.lName ? <Text style={styles.error}>{errors.lName}</Text> : null}
              </View>

              <View style={styles.field}>
                <TextInput
                  ref={usernameRef}
                  style={[styles.input, errors.username && styles.inputError]}
                  placeholder="Username"
                  placeholderTextColor={COLORS.placeholder}
                  value={username}
                  onChangeText={handleUsername}
                  autoCapitalize="none"
                  returnKeyType="done"
                />
                {errors.username ? <Text style={styles.error}>{errors.username}</Text> : null}
              </View>
            </View>

            {/* ACTIONS - Positioned directly under the form */}
            <View style={[styles.actions, { marginTop: 20 }]}>
              <TouchableOpacity onPress={onToggleGeoDebug} style={styles.geoToggle}>
                <Text style={[styles.geoText, { color: geoDebug ? COLORS.green : COLORS.danger }]}>
                  Geo Check: {geoDebug ? "OFF (Debug)" : "ON"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, !isFormValid && { opacity: 0.5 }]}
                onPress={onNext}
                disabled={!isFormValid}
              >
                <Text style={styles.buttonText}>NEXT</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}