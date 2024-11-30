<template>
  <div class="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-10 text-white">
    <div class="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 class="text-3xl font-semibold tracking-wide mb-6 text-center text-gray-100">Shake Lingo Conversational Assistant</h1>

      <!-- Language Selector -->
      <div class="mb-6">
        <label for="language" class="block text-sm font-medium text-gray-400 mb-2">Select Target Language</label>
        <select
          id="language"
          v-model="selectedLanguage"
          class="w-full bg-gray-900 text-gray-300 py-2 px-4 rounded-lg border border-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
      </div>

      <!-- Auto Speech Toggle -->
      <div class="mb-6 flex items-center">
        <label for="autoSpeech" class="text-sm font-medium text-gray-400">Auto Speak Responses</label>
        <input
          id="autoSpeech"
          type="checkbox"
          v-model="autoSpeech"
          class="ml-4 h-5 w-5 text-blue-500 bg-gray-900 border-gray-700 focus:ring focus:ring-blue-500 rounded-lg"
        />
      </div>

      <!-- Speak Button -->
      <div class="mb-6">
        <button
          @click="startRecognition"
          class="w-full bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transform transition"
        >
          Speak
        </button>
      </div>

      <!-- Conversation History -->
      <div v-if="conversationHistory.length > 0" class="mb-6">
        <h2 class="text-lg font-medium tracking-wide mb-4 text-gray-100">Conversation History</h2>
        <ul class="space-y-4 bg-gray-900 p-4 rounded-lg">
          <li
            v-for="(message, index) in conversationHistory"
            :key="index"
            class="border-b border-gray-700 pb-4 last:border-b-0"
          >
            <p class="text-sm text-gray-300"><strong>You:</strong> {{ message.user }}</p>
            <p class="text-sm text-blue-400"><strong>Assistant (Original):</strong> {{ message.assistant.original }}</p>
            <p class="text-sm text-green-400"><strong>Assistant (Translated):</strong> {{ message.assistant.translated }}</p>
          </li>
        </ul>
      </div>

      <!-- Real-Time Streaming Response -->
      <div v-if="isStreaming" class="mb-6">
        <h2 class="text-lg font-medium tracking-wide mb-4 text-gray-100">Streaming Response</h2>
        <div class="bg-gray-900 p-4 rounded-lg text-blue-300 text-sm">
          {{ streamingResponse }}
        </div>
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
        const capabilities = await self.ai.languageModel.capabilities();
        console.log(capabilities)
        session = await self.ai.languageModel.create({
          systemPrompt: "You are a multilingual assistant.",
        });
      } catch (error) {
        console.error("Failed to create language model session:", error);
        alert("The language model API is unavailable. Please try again later.");
      }
    };

    onMounted(async () => {
      try {
        languages.value = getAvailableLanguages();
        if (!languages.value.length) {
          speechSynthesis.onvoiceschanged = () => {
            languages.value = getAvailableLanguages();
          };
        }

        await initializeSession();

        const savedHistory = JSON.parse(
          localStorage.getItem("conversationHistory") || "[]"
        );
        conversationHistory.value = savedHistory;
      } catch (error) {
        console.error("Error during initialization:", error);
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
          sourceLanguage: navigator.language.split("-")[0],
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
    };
  },
};

function startSpeechRecognition(onResult) {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = navigator.language;
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
/* Tailwind CSS is used for all styling */
</style>
