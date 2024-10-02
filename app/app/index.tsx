import { useRouter } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";
import { TouchableOpacity, ScrollView } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => router.push("/home")}>
            <View>
              <Text>What is up</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
