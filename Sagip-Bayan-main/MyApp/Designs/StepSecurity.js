import { StyleSheet, Dimensions, Platform } from "react-native";

export const COLORS = {
  white: "#FFFFFF",
  text: "#000000",
  textMuted: "#6B7280",
  placeholder: "#5E7E5E",
  greenOutline: "#1F7A32",
  green: "#136D2A",
  greenDark: "#0E561F",
  gold: "#FFC82C",
  link: "#0284C7",
  danger: "#DC2626",
  shadow: "rgba(0,0,0,0.15)",
};

const { width: initialWidth } = Dimensions.get("window");

const createStyles = (w = initialWidth) => {
  const isWeb = Platform.OS === "web";
  const WEB_MOBILE_WIDTH = 360;
  const effectiveWidth = isWeb ? Math.min(w, WEB_MOBILE_WIDTH) : w;
  const isSmallPhone = effectiveWidth < 360;

  const font = isSmallPhone ? 12 : 14;
  const inputHeight = isSmallPhone ? 38 : 45; // Adjusted for better touch targets
  const PULL_UP = Platform.OS === "ios" ? 10 : 20;

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    contentWrapper: {
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: PULL_UP,
    },
    logoContainer: {
      width: "100%",
      height: 100,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    logo: {
      width: "60%",
      height: "100%",
    },
    headerContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: "800",
      color: COLORS.greenDark,
    },
    subtitle: {
      fontSize: 14,
      color: COLORS.textMuted,
      textAlign: 'center',
      marginTop: 4,
      paddingHorizontal: 20,
    },
    formWrapper: {
      width: "100%",
      maxWidth: 400,
    },
    field: {
      width: "100%",
      marginBottom: 12,
    },
    input: {
      width: "100%",
      height: inputHeight,
      borderWidth: 1.5,
      borderColor: COLORS.greenOutline,
      borderRadius: 25,
      backgroundColor: COLORS.white,
      paddingHorizontal: 18,
      fontSize: font,
      color: COLORS.text,
    },
    inputError: {
      borderColor: COLORS.danger,
    },
    error: {
      color: COLORS.danger,
      fontSize: 11,
      marginLeft: 15,
      marginTop: 2,
    },
    actions: {
      width: "100%",
      maxWidth: 400,
      marginTop: 10,
    },
    button: {
      backgroundColor: COLORS.green,
      borderRadius: 25,
      paddingVertical: 14,
      alignItems: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    buttonDisabled: {
      opacity: 0.4,
    },
    buttonText: {
      color: COLORS.gold,
      fontWeight: "700",
      fontSize: 16,
    },
  });
};

export default createStyles;