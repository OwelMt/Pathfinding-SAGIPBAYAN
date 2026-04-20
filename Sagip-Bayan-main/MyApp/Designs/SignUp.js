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
  const inputHeight = isSmallPhone ? 35 : 40;
  
  // Adjusted PULL_UP to be less aggressive so image fits
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
    // 🔥 FIXED LOGO STYLE
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
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.greenDark,
    },
    subtitle: {
      fontSize: 14,
      color: COLORS.textMuted,
      marginTop: 4,
    },
    formWrapper: {
      width: "100%",
      maxWidth: 400,
    },
    field: {
      width: "100%",
      marginBottom: 12, // Vertical gap
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
      paddingVertical: 12,
      alignItems: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    buttonText: {
      color: COLORS.gold,
      fontWeight: "700",
      fontSize: 16,
    },
    geoToggle: {
      paddingVertical: 10,
      alignItems: "center",
    },
    geoText: {
      fontSize: 12,
      fontWeight: "600",
    }
  });
};

export default createStyles;