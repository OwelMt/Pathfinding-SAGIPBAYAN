// Designs/LogIn.js
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  base: "#053101",
  dark: "#032500",
  mid: "#0C4308",
  light: "#25B01A",
  white: "#FFFFFF",
  placeholder: "#5E7E5E",
  danger: "#DC2626",
  gold: "#FFC82C",
};

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.base,
  },

  /* ===== CAMO STRIPES (SAME AS GETSTARTED) ===== */

  stripeTop: {
    position: "absolute",
    top: -150,
    left: -width,
    width: width * 2,
    height: height * 0.35,
    backgroundColor: COLORS.dark,
    transform: [{ rotate: "-12deg" }],
  },

  stripeMid: {
    position: "absolute",
    top: height * 0.15,
    left: -width,
    width: width * 2,
    height: height * 0.35,
    backgroundColor: COLORS.mid,
    transform: [{ rotate: "-12deg" }],
  },

  stripeMid2: {
    position: "absolute",
    top: height * 0.35,
    left: -width,
    width: width * 2,
    height: height * 0.25,
    backgroundColor: COLORS.dark,
    transform: [{ rotate: "-12deg" }],
  },

  stripeBottom: {
    position: "absolute",
    bottom: -200,
    left: -width,
    width: width * 2,
    height: height * 0.4,
    backgroundColor: COLORS.light,
    transform: [{ rotate: "-12deg" }],
  },

  /* ===== CONTENT ===== */

pageContainer: {
  flexGrow: 1,
  justifyContent: "center",   // 👈 center vertically
  alignItems: "center",
  paddingHorizontal: 20,
},
  logo: {
    width: width * 2.75,
    height: 180,
    marginBottom: 56,
  },

  /* ===== FULL-WIDTH PANEL ===== */

panel: {
  width: "100%",
  maxWidth: 400,              // 👈 keeps it clean on tablets
  backgroundColor: "#fff",
  padding: 24,
  borderRadius: 20,
  gap: 12,

  // subtle shadow (modern UI)
  elevation: 5,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 10,
},
  panelTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.placeholder,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },

  button: {
    backgroundColor: "#136D2A",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: COLORS.gold,
    fontWeight: "800",
    fontSize: 16,
  },

  helperText: {
    textAlign: "center",
    marginTop: 14,
    color: "#333",
  },

  secondaryButton: {
    borderWidth: 1.5,
    borderColor: "#136D2A",
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },

  secondaryButtonText: {
    color: "#136D2A",
    fontWeight: "700",
  },

  error: {
    color: COLORS.danger,
    textAlign: "center",
    marginBottom: 6,
  },
});