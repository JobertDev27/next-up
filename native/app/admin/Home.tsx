import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../config/config";

export default function AdminDashboard() {
  const [queue, setQueue] = useState<any[]>([]);
  const [current, setCurrent] = useState<any | null>(null);

  useEffect(() => {
    const socket = io(BASE_URL);

    const fetchQueue = async () => {
      try {
        const res = await fetch(BASE_URL + "/getTransaction");
        const data = await res.json();

        setQueue(data);

        if (data.length > 0) {
          setCurrent(data[0]);
        } else {
          setCurrent(null);
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
  }, []);

  const handleNext = async () => {
    if (!current) return;

    await fetch(BASE_URL + "/next", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticket: current.ticket_code,
      }),
    });
  };

  const handleCall = () => {
    if (!current) return;

    fetch(BASE_URL + "/callStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticket: current.ticket_code,
      }),
    });
  };

  const renderNeeds = (item: any) => {
    const needs = [
      item.grades && "Grades",
      item.identification && "ID",
      item.rf && "RF",
      item.dismissal && "Dismissal",
      item.other && `Other: ${item.other}`,
    ].filter(Boolean);

    return needs.map((need, i) => <Text key={i}>• {need}</Text>);
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.currentCard}>
        <Text style={styles.headerText}>Current Student</Text>

        {current ? (
          <>
            <Text>Name: {current.student_name}</Text>
            <Text>ID: {current.student_id}</Text>
            <Text>Ticket: {current.ticket_code}</Text>

            <Text style={{ marginTop: 10, fontWeight: "500" }}>
              Documents Requested:
            </Text>

            <View style={{ marginTop: 5 }}>{renderNeeds(current)}</View>

            <View style={styles.buttonRow}>
              <Pressable style={styles.callButton} onPress={handleCall}>
                <Text style={styles.buttonText}>Call</Text>
              </Pressable>

              <Pressable style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Text>No current student</Text>
        )}
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.headerText}>Queue</Text>

        <FlatList
          data={queue.slice(1)}
          keyExtractor={(item) => item.id?.toString() || item.ticket_code}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text>
                {item.ticket_code} - {item.student_name}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 15,
    gap: 15,
    backgroundColor: "#f5f6f8",
  },

  currentCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 15,
    gap: 8,
    elevation: 2,
  },

  headerText: {
    fontWeight: "500",
    fontSize: 16,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  callButton: {
    flex: 1,
    backgroundColor: "rgb(52, 124, 96)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  nextButton: {
    flex: 1,
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "500",
  },

  listContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 15,
    elevation: 2,
  },

  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
