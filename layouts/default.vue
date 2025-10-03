<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <Navbar />
    
    <!-- Main content với padding-top để tránh bị che bởi navbar cố định -->
    <main class="flex-1 pt-16">
      <slot />
    </main>
    
    <!-- Footer -->
    <Footer />
  </div>
</template>