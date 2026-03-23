import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import QueueDisplay from "../components/QueueDisplay";
import { BASE_URL } from "../config/config.js";

type transactionProp = {
  for: string;
  value: boolean;
};

function ToggleButton({
  active,
  value,
  changeValue,
}: {
  active: boolean;
  value: string;
  changeValue: () => void;
}) {
  return (
    <Pressable
      style={[styles.toggleButton, active ? styles.active : styles.inactive]}
      onPress={() => changeValue()}
    >
      <Text style={active && styles.activeText}>{value}</Text>
    </Pressable>
  );
}

export default function Home() {
  const [othervalue, setOtherValue] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [queueNumber, setQueueNumber] = useState<string>("");
  const [transaction, setTransaction] = useState<transactionProp[]>([
    { for: "Grades", value: false },
    { for: "ID", value: false },
    { for: "RF", value: false },
    { for: "Dismissal", value: false },
    { for: "Others", value: false },
  ]);

  const handleTransactionCheck = (index: number, val: boolean) => {
    setTransaction((prev) =>
      prev.map((item, i) => (i === index ? { ...item, value: val } : item)),
    );
    return val;
  };

  const formValidation = async () => {
    if (!studentId || !studentName || !queueNumber)
      return Alert.alert(
        "Invalid Form",
        "name, id and number must not be empty",
      );

    if (!transaction.some((item) => item.value))
      return Alert.alert("Invalid Form", "Choose atleast 1 Transaction");
    if (transaction[4].value && !othervalue)
      return Alert.alert(
        "Empty Clarification",
        "Please Clarify 'Other' transaction",
      );
    const data = {
      name: studentName,
      id: studentId,
      code: queueNumber,
      identification: transaction[1].value,
      rf: transaction[2].value,
      grades: transaction[0].value,
      dismissal: transaction[3].value,
      other: othervalue,
    };

    const res = await fetch(BASE_URL + "/checkTicket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ticket: queueNumber }),
    });
    const exists = await res.json();
    if (!exists) return Alert.alert("Invalid code", "Please use correct code");

    await fetch(BASE_URL + "/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    router.replace({
      pathname: "/user/WaitingList",
      params: { ticket: queueNumber },
    });
  };

  return (
    <SafeAreaView style={styles.main}>
      <QueueDisplay />
      <View style={styles.inputCont}>
        <View style={styles.inputArea}>
          <Text style={styles.headerText}>Full Name</Text>
          <TextInput
            style={styles.inputBox}
            value={studentName}
            onChangeText={setStudentName}
            placeholder="Enter your full name"
          />
        </View>
        <View style={styles.inputArea}>
          <Text style={styles.headerText}>ID Number</Text>
          <TextInput
            style={styles.inputBox}
            value={studentId}
            onChangeText={setStudentId}
            placeholder="Enter your ID number"
          />
        </View>
        <View style={styles.inputArea}>
          <Text style={styles.headerText}>Ticket Number</Text>
          <TextInput
            style={styles.inputBox}
            value={queueNumber}
            onChangeText={setQueueNumber}
            placeholder="Enter your ticket number"
          />
        </View>
        {transaction[4].value && (
          <View>
            <Text style={styles.headerText}>
              Please Clarify Other Transaction:
            </Text>
            <TextInput
              value={othervalue}
              onChangeText={setOtherValue}
              style={styles.inputBox}
              placeholder="Enter your transaction detail"
            />
          </View>
        )}
        <View>
          <Text style={styles.headerText}>Transaction Details</Text>
          <View style={styles.transactionOptions}>
            {transaction.map((item, i) => {
              return (
                <View key={item.for} style={{ flexDirection: "row", gap: 10 }}>
                  <ToggleButton
                    value={item.for}
                    active={item.value}
                    changeValue={() => handleTransactionCheck(i, !item.value)}
                  />
                </View>
              );
            })}
          </View>

          <Pressable style={styles.button} onPress={formValidation}>
            <Text style={styles.buttonText}>Submit Request</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    padding: 5,
    borderRadius: 25,
    width: 80,
    alignItems: "center",
  },
  activeText: {
    color: "white",
  },
  active: {
    backgroundColor: "rgb(52, 124, 96)",
  },
  inactive: {
    backgroundColor: "#e3e6ea",
  },
  main: {
    flex: 1,
  },
  inputCont: {
    padding: 15,
    backgroundColor: "#ffffff",
    gap: 15,
    borderRadius: 25,
    margin: 5,
  },
  inputBox: {
    backgroundColor: "#e3e6ea",
    height: 35,
    justifyContent: "center",
    borderRadius: 10,
    paddingLeft: 10,
    paddingTop: 0,
    paddingBottom: 0,
  },
  inputArea: {
    gap: 4,
  },
  inputBoxDropdown: {
    borderColor: "black",
    borderWidth: 1,
    height: 30,
    justifyContent: "center",
    paddingLeft: 5,
  },
  transactionOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "rgb(52, 124, 96)",
    width: "100%",
    alignItems: "center",
    padding: 10,
    borderRadius: 15,
    marginTop: 15,
  },
  headerText: {
    fontWeight: 500,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
