<template>
    <div class="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-10 text-white">
      <div class="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 class="text-3xl font-semibold mb-6 text-center text-blue-400">How To Use Shake Lingo</h1>
  
        <!-- Introduction -->
        <p class="text-gray-300 mb-4">
          Welcome to Shake Lingo! This guide will walk you through the app's main features and help you get started.
        </p>
  
        <!-- Table of Contents -->
        <ul class="list-disc list-inside text-gray-300 mb-6">
          <li><a href="#conversational-assistant" class="text-blue-400 hover:underline">Using the Conversational Assistant</a></li>
          <li><a href="#text-translation" class="text-blue-400 hover:underline">Text Translation</a></li>
          <li><a href="#document-translation" class="text-blue-400 hover:underline">Document Translation</a></li>
          <li><a href="#saving-and-uploading-history" class="text-blue-400 hover:underline">Saving and Uploading History</a></li>
        </ul>
  
        <!-- Sections -->
        <section id="conversational-assistant" class="mb-8">
          <h2 class="text-xl font-bold text-gray-100 mb-2">Using the Conversational Assistant</h2>
          <p class="text-gray-300 mb-2">
            The conversational assistant lets you practice languages by speaking with an AI-powered assistant.
          </p>
          <ol class="list-decimal list-inside text-gray-300">
            <li>Choose your target language from the dropdown menu.</li>
            <li>Click the "Speak" button and use your microphone to ask a question or make a statement.</li>
            <li>View the assistant's response in real-time and hear it spoken aloud (if auto-speak is enabled).</li>
          </ol>
        </section>
  
        <section id="text-translation" class="mb-8">
          <h2 class="text-xl font-bold text-gray-100 mb-2">Text Translation</h2>
          <p class="text-gray-300 mb-2">
            Translate any text from one language to another with ease.
          </p>
          <ol class="list-decimal list-inside text-gray-300">
            <li>Navigate to the "Text Translation" page from the menu.</li>
            <li>Enter your text into the input box.</li>
            <li>Select your desired target language from the dropdown.</li>
            <li>Click the "Translate" button to see the translated text.</li>
          </ol>
        </section>
  
        <section id="document-translation" class="mb-8">
          <h2 class="text-xl font-bold text-gray-100 mb-2">Document Translation</h2>
          <p class="text-gray-300 mb-2">
            Upload a document and have it translated into your desired language.
          </p>
          <ol class="list-decimal list-inside text-gray-300">
            <li>Navigate to the "Document Translation" page from the menu.</li>
            <li>Upload a document (e.g., a .txt file) using the file input.</li>
            <li>Select your desired target language from the dropdown.</li>
            <li>Click the "Translate Document" button to see the translated content.</li>
          </ol>
        </section>
  
        <section id="saving-and-uploading-history" class="mb-8">
          <h2 class="text-xl font-bold text-gray-100 mb-2">Saving and Uploading History</h2>
          <p class="text-gray-300 mb-2">
            Save your conversation history or upload a previously saved history to pick up where you left off.
          </p>
          <ol class="list-decimal list-inside text-gray-300">
            <li>To save your conversation history, click the "Save History" button on the homepage.</li>
            <li>To upload a previously saved history, click the "Upload History" button and select your file.</li>
          </ol>
        </section>
  
        <!-- Footer Note -->
        <p class="text-gray-400 text-sm">
          For further assistance, feel free to contact our support team. Enjoy using Shake Lingo!
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "HowTo",
  };
  </script>
  
  <style>
  /* Tailwind CSS is used for styling */
  </style>
  