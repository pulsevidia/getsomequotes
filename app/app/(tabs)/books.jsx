import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { TouchableOpacity } from "react-native";
import { useState } from "react";

function Books() {
  const [isLoading, setIsLoading] = useState(false);
  const [bookPDF, setBookPDF] = useState(null);
  const handleDocumentPickup = async () => {
    setIsLoading(true);
    const document = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (!document.canceled) {
      setBookPDF(document.assets[0]);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView>
      <Text>Uploads</Text>

      <Text>Upload Button</Text>
      <TouchableOpacity disabled={isLoading} onPress={handleDocumentPickup}>
        <Text>
          {isLoading && "Loading"}
          {!isLoading && "Upload your book"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default Books;
