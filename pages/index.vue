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
            <li v-for="(message, index) in conversationHistory" :key="index" class="border-b pb-2">
              <p class="text-gray-700"><strong>You:</strong> {{ message.user }}</p>
              <p class="text-gray-700"><strong>Assistant:</strong> {{ message.assistant }}</p>
            </li>
          </ul>
        </div>
  
        <!-- Show Recognized Text -->
        <div v-if="spokenText" class="mb-4">
          <p class="text-gray-800">
            <strong>You said:</strong> "{{ spokenText }}"
          </p>
        </div>
  
        <!-- Display AI Response -->
        <div v-if="translatedResponse" class="mb-4">
          <p class="text-gray-800">
            <strong>Assistant:</strong> "{{ translatedResponse }}"
          </p>
          <button
            @click="speak(translatedResponse)"
            class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Speak Response
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    setup() {
      const languages = ref([]); // Dynamically populated languages
      const selectedLanguage = ref('en-US'); // Default language code
      const spokenText = ref(''); // User's spoken input
      const aiResponse = ref(''); // AI's raw response
      const translatedResponse = ref(''); // Translated response
      const conversationHistory = ref([]); // Conversation history
      let session;
  
      // Fetch available languages dynamically
      const getAvailableLanguages = () => {
        const voices = speechSynthesis.getVoices();
        return voices.map((voice) => ({
          code: voice.lang,
          name: `${voice.name} (${voice.lang})`,
        }));
      };
  
      // Initialize the Prompt API session and fetch languages
      onMounted(async () => {
        session = await ai.languageModel.create({
          systemPrompt: "You are a friendly multilingual assistant. Respond concisely in a conversational tone.",
        });
  
        // Populate available languages
        languages.value = getAvailableLanguages();
        if (!languages.value.length) {
          // Sometimes voices are not immediately available; retry after a delay
          speechSynthesis.onvoiceschanged = () => {
            languages.value = getAvailableLanguages();
          };
        }
  
        // Load saved conversation history
        const savedHistory = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
        conversationHistory.value = savedHistory;
      });
  
      // Start Speech Recognition
      const startRecognition = () => {
        startSpeechRecognition(async (result) => {
          spokenText.value = result;
          const response = await getAIResponse(result);
          aiResponse.value = response;
          await translateResponse(response);
          saveConversation(result, translatedResponse.value); // Save interaction
        });
      };
  
      // Fetch AI Response
      const getAIResponse = async (userInput) => {
        try {
          return await session.prompt(userInput);
        } catch (error) {
          console.error('Error fetching AI response:', error);
          return "I'm sorry, something went wrong.";
        }
      };
  
      // Translate AI Response
      const translateResponse = async (text) => {
        try {
          const translator = await self.translation.createTranslator({
            sourceLanguage: 'en',
            targetLanguage: selectedLanguage.value.split('-')[0], // Use language code only
          });
  
          translatedResponse.value = await translator.translate(text);
        } catch (error) {
          console.error('Error translating AI response:', error);
          translatedResponse.value = text;
        }
      };
  
      // Save conversation to history
      const saveConversation = (user, assistant) => {
        const newMessage = { user, assistant };
        conversationHistory.value.push(newMessage);
  
        // Save to LocalStorage
        localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory.value));
      };
  
      // Speak the translated response
      const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLanguage.value;
        speechSynthesis.speak(utterance);
      };
  
      return {
        languages,
        selectedLanguage,
        spokenText,
        aiResponse,
        translatedResponse,
        conversationHistory,
        startRecognition,
        speak,
      };
    },
  };
  
  // Speech Recognition Function
  function startSpeechRecognition(onResult) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US'; // Default language for recognition
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
  
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      alert('Speech recognition failed. Please try again.');
    };
  
    recognition.start();
  }
  </script>
  
  <style>
  /* Add styles here or use Tailwind for styling */
  </style>
  