import { Text, StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QueueDisplay from "../components/QueueDisplay";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { BASE_URL } from "../config/config";
export default function WaitingList() {
  const [msg, setMsg] = useState<string>("");

  const params = useLocalSearchParams();
  const ticket = Array.isArray(params.ticket)
    ? params.ticket[0]
    : params.ticket;

  useEffect(() => {
    const socket = io(BASE_URL);

    socket.on("connect", () => {
      socket.emit("joinQueue", { ticket });
    });
    socket.on("called", (data) => {
      setMsg(data.message);

      return () => {
        socket.disconnect();
      };
    });
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      {msg ? (
        <View>
          <Text style={styles.textHeader}>{msg}</Text>
          <Pressable
            style={{
              alignItems: "center",
              margin: 10,
              backgroundColor: "rgb(52, 124, 96)",
              padding: 10,
              borderRadius: 25,
            }}
            onPress={() => router.replace("/user/Home")}
          >
            <Text style={{ color: "white" }}>Do another transaction</Text>
          </Pressable>
        </View>
      ) : (
        <View>
          <Text style={styles.textHeader}>
            Please Wait Patiently, your ticket is #{ticket}
          </Text>
          <QueueDisplay place={ticket} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    gap: 10,
    justifyContent: "center",
  },
  textHeader: {
    fontSize: 24,
    fontWeight: 600,
    textAlign: "center",
  },
});
