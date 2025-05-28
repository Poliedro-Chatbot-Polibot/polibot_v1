import { StyleSheet } from "react-native";

export default StyleSheet.create({
  containerGradient: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 4,
  },

  formContainer: {
    backgroundColor: "transparent",
    paddingVertical: 20,
    paddingHorizontal: 0,
    borderRadius: 12,
  },
  input: {
    height: 48,
    fontSize: 16,
    color: "#f3f4f6",
    paddingHorizontal: 0,
  },
  separator: {
    height: 1,
    backgroundColor: "#374151",
    marginVertical: 8,
  },

  button: {
    marginTop: 24,
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#3b82f6",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  signUpTextContainer: {
    alignItems: "center",
    marginTop: 32,
  },
  signUpText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  signUpTextBold: {
    fontWeight: "700",
    color: "#3b82f6",
  },
});
