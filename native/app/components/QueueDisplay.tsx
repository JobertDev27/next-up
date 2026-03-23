import { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { io } from "socket.io-client";
import { BASE_URL } from "../config/config";

export default function QueueDisplay({ place }: { place?: string }) {
  const [currCounter, setCurrCounter] = useState<number>(0);

  useEffect(() => {
    const socket = io(BASE_URL);

    const fetchQueue = async () => {
      try {
        const res = await fetch(`${BASE_URL}/getTransaction`);
        const data = await res.json();

        if (place) {
          const index = data.findIndex((c: any) => {
            console.log(`${c.ticket_code}: ${place}`);
            return c.ticket_code === Number(place.trim());
          });
          setCurrCounter(index >= 0 ? index : 0);
        } else {
          setCurrCounter(data.length);
        }
      } catch (err) {
        console.log("Fetch error:", err);
      }
    };

    fetchQueue();

    socket.on("transactionAdded", fetchQueue);
    socket.on("transactionUpdated", fetchQueue);

    return () => {
      socket.disconnect();
    };
  }, [place]);

  return (
    <View style={styles.queueCont}>
      <Text style={styles.headerText}>
        {place ? "Position in Queue" : "Currently in Queue"}
      </Text>
      <Text style={styles.queueNum}>
        {currCounter > 0 ? currCounter : "None"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: 500,
  },
  queueCont: {
    backgroundColor: "rgb(52, 124, 96)",
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 25,
  },
  queueNum: {
    fontSize: 64,
    fontWeight: 600,
    color: "white",
  },
});
