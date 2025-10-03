<template>
  <!-- Trang chủ ToDo Application - Landing page chính -->
  <div class="bg-gray-50">
    
    <!-- Hero section - Phần giới thiệu chính với gradient background -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <!-- Container chính với max-width và căn giữa -->
      <div class="max-w-7xl mx-auto px-6 text-center">
        <!-- Tiêu đề chính của trang -->
        <h1 class="text-5xl font-bold mb-6">
          {{ $t('home.title') }}
        </h1>
        <!-- Mô tả phụ về ứng dụng -->
        <p class="text-xl mb-8 text-blue-100">
          {{ $t('home.subtitle') }}
        </p>
      </div>
    </section>
    
    <!-- Features section - Phần giới thiệu tính năng -->
    <section class="py-16 bg-white">
      <!-- Container chính -->
      <div class="max-w-7xl mx-auto px-6">
        <!-- Tiêu đề phần tính năng -->
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">
          {{ $t('home.features.title') }}
        </h2>
        
        <!-- Grid layout cho 3 tính năng chính -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Feature 1: Quản lý dễ dàng -->
          <div class="text-center p-6">
            <!-- Icon container với background xanh dương -->
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <!-- Icon checklist SVG -->
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
            <!-- Tiêu đề tính năng -->
            <h3 class="text-xl font-semibold mb-2 text-gray-800">{{ $t('home.features.feature1.title') }}</h3>
            <!-- Mô tả tính năng -->
            <p class="text-gray-600">{{ $t('home.features.feature1.description') }}</p>
          </div>
          
          <!-- Feature 2: Theo dõi tiến độ -->
          <div class="text-center p-6">
            <!-- Icon container với background xanh lá -->
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <!-- Icon đồng hồ SVG -->
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <!-- Tiêu đề tính năng -->
            <h3 class="text-xl font-semibold mb-2 text-gray-800">{{ $t('home.features.feature2.title') }}</h3>
            <!-- Mô tả tính năng -->
            <p class="text-gray-600">{{ $t('home.features.feature2.description') }}</p>
          </div>
          
          <!-- Feature 3: Tăng năng suất -->
          <div class="text-center p-6">
            <!-- Icon container với background tím -->
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <!-- Icon tia sét SVG -->
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <!-- Tiêu đề tính năng -->
            <h3 class="text-xl font-semibold mb-2 text-gray-800">{{ $t('home.features.feature3.title') }}</h3>
            <!-- Mô tả tính năng -->
            <p class="text-gray-600">{{ $t('home.features.feature3.description') }}</p>
          </div>
          
        </div>
      </div>
    </section>
  </div>
</template>
