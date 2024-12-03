<template>
    <div class="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <!-- Header -->
      <header class="bg-gray-800 py-4 shadow-md">
        <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-blue-400">Shake Lingo</h1>
          <nav>
            <ul class="flex space-x-6 text-gray-300">

              <li>
                <NuxtLink
                  to="/how-to"
                  class="hover:text-blue-400 transition"
                  exact-active-class="text-blue-400"
                >
                  How To
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/"
                  class="hover:text-blue-400 transition"
                  exact-active-class="text-blue-400"
                >
                  Conversational Assistant
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/text-translate"
                  class="hover:text-blue-400 transition"
                  exact-active-class="text-blue-400"
                >
                  Text Translation
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/document-translate"
                  class="hover:text-blue-400 transition"
                  exact-active-class="text-blue-400"
                >
                  Document Translation
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
  
      <!-- Page Content -->
      <main class="max-w-7xl mx-auto px-6 py-10">
        <slot />
      </main>
  
      <!-- Footer -->
      <footer class="bg-gray-800 py-6 text-center">
        <p class="text-gray-500 text-sm mb-4">
          © {{ new Date().getFullYear() }} Shake Lingo. All rights reserved.
        </p>
        <div class="flex justify-center space-x-4">
          <!-- GitHub -->
          <a
            href="https://github.com/mastashake08/shake-lingo"
            target="_blank"
            class="text-gray-300 hover:text-blue-400 transition"
            aria-label="GitHub"
          >
            <i class="fab fa-github text-2xl"></i>
          </a>
          <!-- Twitter -->
          <a
            href="https://twitter.com/jyroneparker"
            target="_blank"
            class="text-gray-300 hover:text-blue-400 transition"
            aria-label="Twitter"
          >
            <i class="fab fa-twitter text-2xl"></i>
          </a>
          <!-- YouTube -->
          <a
            href="https://youtube.com/@jyroneparker"
            target="_blank"
            class="text-gray-300 hover:text-blue-400 transition"
            aria-label="YouTube"
          >
            <i class="fab fa-youtube text-2xl"></i>
          </a>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: "DefaultLayout",
  };
  </script>
  
  <style>
  /* Font Awesome is used for social icons */
  </style>
  