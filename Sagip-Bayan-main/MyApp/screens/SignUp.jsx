import { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import api from "../lib/api";
import StepPersonal from "./signup/StepPersonal";
import StepSecurity from "./signup/StepSecurity";
import StepMobile from "./signup/StepMobile";
import SignUpHeader from "./signup/SignUpHeader";

const JAEN_CENTER = { lat: 15.3383, lng: 120.9141 };
const MAX_DISTANCE_KM = 5;

export default function SignUp({ navigation }) {
  const [step, setStep] = useState(0);

  const scrollRef = useRef(null);

  /* FORM */
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });

  const [geoDebug, setGeoDebug] = useState(false);

  const [location, setLocation] = useState(null);
  const [permission, setPermission] = useState(null);

  /* LOCATION */
  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      setPermission(status);

      if (status === "granted") {
        const pos = await Location.getCurrentPositionAsync({});
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      }
    })();
  }, []);

  const toRad = (v) => (v * Math.PI) / 180;

  const getDistanceKm = (a, b) => {
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);

    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(a.lat)) *
        Math.cos(toRad(b.lat)) *
        Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };

  const next = () => setStep((s) => s + 1);
  const back = () =>
    step === 0 ? navigation.goBack() : setStep((s) => s - 1);

  /* GLOBAL FOCUS HANDLER (KEY FIX) */
  const handleFocus = (ref) => {
    scrollRef.current?.scrollToFocusedInput(ref);
  };

  const submit = async () => {
    if (!geoDebug) {
      if (permission !== "granted" || !location) {
        Alert.alert("Location Required");
        return;
      }

      const dist = getDistanceKm(location, JAEN_CENTER);
      if (dist > MAX_DISTANCE_KM) {
        Alert.alert("Outside Service Area");
        return;
      }
    }

    try {
      await api.post("/user/register", {
        fname: fName,
        lname: lName,
        username,
        password,
        birthdate,
        phone,
        email,
        address,
        location,
      });

      Alert.alert("Success", "Check your email to verify.");
      navigation.replace("LogIn");
    } catch {
      Alert.alert("Signup failed");
    }
  };

  const pages = [
    <StepPersonal
      key="p1"
      fName={fName}
      lName={lName}
      username={username}
      onFNameChange={setFName}
      onLNameChange={setLName}
      onUsernameChange={setUsername}
      geoDebug={geoDebug}
      onToggleGeoDebug={() => setGeoDebug((v) => !v)}
      onNext={next}
      onFocus={handleFocus}
    />,

   <StepSecurity
  key="p2"
  password={password}
  confirmPassword={confirmPassword}
  
  // Pass the error states
  passwordError={errors.password}
  confirmPasswordError={errors.confirmPassword}
  setErrors={setErrors} // Make sure setErrors is defined in parent!
  
  onPasswordChange={setPassword}
  onConfirmChange={setConfirmPassword}
  onNext={next}
  onBack={back}
  onFocus={handleFocus} // Connect the scroll handler
/>,

    <StepMobile
      key="p3"
      phone={phone}
      email={email}
      address={address}
      birthdate={birthdate}
      onPhoneChange={setPhone}
      onEmailChange={setEmail}
      onAddressChange={setAddress}
      onBirthdateChange={setBirthdate}
      onSubmit={submit}
      onBack={back}
      onFocus={handleFocus}
    />,
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SignUpHeader step={step} onBack={back} />

      <KeyboardAwareScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={100}
        bounces={false}
        overScrollMode="never"
      >
        {pages[step]}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}