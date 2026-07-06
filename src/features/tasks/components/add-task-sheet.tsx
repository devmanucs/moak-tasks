import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { PlusIcon, XIcon } from "@/src/components/ui/icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

interface AddTaskSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, description?: string) => void;
}

export function AddTaskSheet({ visible, onClose, onSubmit }: AddTaskSheetProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit() {
    if (!title.trim()) return;
    onSubmit(title.trim(), description.trim() || undefined);
    setTitle("");
    setDescription("");
    onClose();
  }

  function handleClose() {
    setTitle("");
    setDescription("");
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable
            className="rounded-t-3xl bg-card px-6 pb-10 pt-4"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="font-fraunces text-xl text-foreground">
                Nova tarefa
              </Text>
              <Button variant="ghost" size="icon" onPress={handleClose}>
                <XIcon size={20} className="text-muted-foreground" />
              </Button>
            </View>

            <Text className="mb-2 text-sm font-medium text-muted-foreground">
              Título
            </Text>
            <Input
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Treinar pernas"
              autoFocus
              className="mb-4 h-12 rounded-xl"
            />

            <Text className="mb-2 text-sm font-medium text-muted-foreground">
              Descrição (opcional)
            </Text>
            <Input
              value={description}
              onChangeText={setDescription}
              placeholder="Detalhes da tarefa..."
              multiline
              className="mb-6 min-h-[80px] rounded-xl py-3"
            />

            <Button
              onPress={handleSubmit}
              disabled={!title.trim()}
              className="h-12 rounded-xl"
            >
              <PlusIcon size={18} className="text-primary-foreground" />
              <Text className="text-sm font-semibold text-primary-foreground">
                Adicionar tarefa
              </Text>
            </Button>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
