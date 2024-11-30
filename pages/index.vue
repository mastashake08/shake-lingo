<template>
    <div class="min-h-screen bg-gray-50 py-10">
      <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-4">Multilingual Conversational Assistant</h1>
  
        <!-- Language Selector -->
        <div class="mb-4">
          <label for="language" class="block text-sm font-medium text-gray-700">Select Target Language</label>
          <select
            id="language"
            v-model="selectedLanguage"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option v-for="lang in languages" :key="lang.code" :value="lang.code">
              {{ lang.name }}
            </option>
          </select>
        </div>
  
        <!-- Auto Speech Toggle -->
        <div class="mb-4 flex items-center">
          <label for="autoSpeech" class="text-sm font-medium text-gray-700">Auto Speak Responses</label>
          <input
            id="autoSpeech"
            type="checkbox"
            v-model="autoSpeech"
            class="ml-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
        </div>
  
        <!-- Speak Button -->
        <div class="mb-4">
          <button
            @click="startRecognition"
            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Speak
          </button>
        </div>
  
        <!-- Conversation History -->
        <div v-if="conversationHistory.length > 0" class="mb-4">
          <h2 class="text-lg font-semibold mb-2">Conversation History</h2>
          <ul class="space-y-4">
            <li
              v-for="(message, index) in conversationHistory"
              :key="index"
              class="border-b pb-2"
            >
              <p class="text-gray-700"><strong>You:</strong> {{ message.user }}</p>
              <p class="text-gray-700">
                <strong>Assistant (Original):</strong> {{ message.assistant.original }}
              </p>
              <p class="text-gray-700">
                <strong>Assistant (Translated):</strong> {{ message.assistant.translated }}
              </p>
            </li>
          </ul>
        </div>
  
        <!-- Real-Time Streaming Response -->
        <div v-if="isStreaming" class="mb-4">
          <h2 class="text-lg font-semibold mb-2">Streaming Response</h2>
          <p class="text-gray-800">
            {{ streamingResponse }}
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from "vue";
  
  export default {
    setup() {
      const languages = ref([]);
      const selectedLanguage = ref("en-US");
      const spokenText = ref("");
      const streamingResponse = ref("");
      const translatedResponse = ref("");
      const conversationHistory = ref([]);
      const autoSpeech = ref(false);
  
      const isStreaming = ref(false);
  
      let session;
  
      const getAvailableLanguages = () => {
        const voices = speechSynthesis.getVoices();
        return voices.map((voice) => ({
          code: voice.lang,
          name: `${voice.name} (${voice.lang})`,
        }));
      };
  
      const initializeSession = async () => {
        try {
  session = await self.ai.languageModel.create({
    systemPrompt: "You are a multilingual assistant.",
    
        });
        } catch (error) {
        console.error("Error creating language model session:", error);

        if (error.name === "AbortError") {
            alert("Model download was aborted.");
        } else if (error.name === "NetworkError") {
            alert("Failed to download model due to a network issue.");
        } else {
            alert("Failed to download the model. Please try again later.");
        }
        } 
      };
  
      const downloadChatHistory = () => {
        const dataStr =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(conversationHistory.value, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "chat_history.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      };
  
      const uploadChatHistory = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          conversationHistory.value = JSON.parse(reader.result);
          localStorage.setItem(
            "conversationHistory",
            JSON.stringify(conversationHistory.value)
          );
        };
        reader.readAsText(file);
      };
  
      onMounted(async () => {
  try {
    // Check if the Prompt API capabilities are available
    const capabilities = await self.ai.languageModel.capabilities();

    if (capabilities.available === "no") {
      throw new Error("The Prompt API is unavailable on this device.");
    }

    if (capabilities.available === "after-download") {
      console.log("Model needs to be downloaded. Starting download...");
    }

    // Initialize the Prompt API session
    session = await self.ai.languageModel.create({
      systemPrompt: "You are a multilingual assistant.",
      monitor(monitor) {
        monitor.addEventListener("downloadprogress", (e) => {
          progressBytes.value = { loaded: e.loaded, total: e.total };
        });
      },
    });

    console.log("Language model session successfully created!");
  } catch (error) {
    console.error("Error during initialization:", error);

    if (error.name === "AbortError") {
      alert("Model download was aborted.");
    } else if (error.name === "NetworkError") {
      alert("Network error occurred while downloading the model.");
    } else {
      alert("An error occurred while initializing the model. Please try again.");
    }
  }
});

  
      const startRecognition = () => {
        startSpeechRecognition(async (result) => {
          spokenText.value = result;
          await getAIResponseStreaming(result);
        });
      };
  
      const getAIResponseStreaming = async (userInput) => {
        try {
          isStreaming.value = true;
          streamingResponse.value = "";
  
          const stream = await session.promptStreaming(userInput);
          for await (const chunk of stream) {
            streamingResponse.value += chunk;
          }
  
          isStreaming.value = false;
          await translateResponse(streamingResponse.value);
          saveConversation(userInput, {
            original: streamingResponse.value,
            translated: translatedResponse.value,
          });
  
          if (autoSpeech.value) speak(translatedResponse.value);
        } catch (error) {
          console.error("Error fetching streaming response:", error);
          isStreaming.value = false;
        }
      };
  
      const translateResponse = async (text) => {
        try {
          const translator = await self.translation.createTranslator({
            sourceLanguage: "en",
            targetLanguage: selectedLanguage.value.split("-")[0],
          });
          translatedResponse.value = await translator.translate(text);
        } catch (error) {
          console.error("Error translating AI response:", error);
          translatedResponse.value = text;
        }
      };
  
      const saveConversation = (user, assistant) => {
        const newMessage = { user, assistant };
        conversationHistory.value.push(newMessage);
        localStorage.setItem(
          "conversationHistory",
          JSON.stringify(conversationHistory.value)
        );
      };
  
      const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLanguage.value;
        speechSynthesis.speak(utterance);
      };
  
      return {
        languages,
        selectedLanguage,
        spokenText,
        streamingResponse,
        translatedResponse,
        conversationHistory,
        autoSpeech,
        isStreaming,
        startRecognition,
        speak,
        downloadChatHistory,
        uploadChatHistory,
      };
    },
  };
  
  function startSpeechRecognition(onResult) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
  
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Speech recognition failed. Please try again.");
    };
  
    recognition.start();
  }
  </script>
  
  <style>
  /* Add styles here or use Tailwind for styling */
  </style>
  