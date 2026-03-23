import { router } from "expo-router";
import {
  Text,
  Pressable,
  StyleSheet,
  Modal,
  View,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  const handleAdminSubmit = () => {
    if (adminCode !== "1234") {
      return Alert.alert("Invalid Code", "Incorrect admin access code");
    }

    setModalVisible(false);
    setAdminCode("");
    router.push("/admin/Home");
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.title}>NextUP</Text>
        <Text style={styles.subtitle}>Queue Management System</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Admin Panel</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/user/Home")}
        >
          <Text style={styles.buttonText}>Student Portal</Text>
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.buttonClose}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ fontSize: 16 }}>✕</Text>
            </Pressable>

            <Text style={styles.modalTitle}>Admin Access</Text>

            <TextInput
              style={styles.inputBox}
              value={adminCode}
              onChangeText={setAdminCode}
              placeholder="Enter admin code"
              secureTextEntry
            />

            <Pressable style={styles.modalButton} onPress={handleAdminSubmit}>
              <Text style={styles.modalButtonText}>Enter</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6f8",
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "rgb(52, 124, 96)",
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },

  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },

  button: {
    backgroundColor: "rgb(52, 124, 96)",
    paddingVertical: 18,
    width: "80%",
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalView: {
    width: 280,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 15,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  inputBox: {
    width: "100%",
    height: 40,
    backgroundColor: "#e3e6ea",
    borderRadius: 10,
    paddingHorizontal: 10,
  },

  modalButton: {
    backgroundColor: "rgb(52, 124, 96)",
    paddingVertical: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },

  modalButtonText: {
    color: "white",
    fontWeight: "600",
  },

  buttonClose: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
