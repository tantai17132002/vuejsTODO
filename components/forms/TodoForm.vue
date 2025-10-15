<template>
  <div class="max-w-2xl w-full">
    <div
      class="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <div class="flex items-center space-x-3">
          <div class="bg-white/20 p-2 rounded-lg">
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">
              {{ $t("todoForm.title") }}
            </h2>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
          <!-- Title Input -->
           <FormsFormInput
             id="title"
             v-model="formData.title"
             v-bind="titleAttrs"
            :label="$t('todoForm.titleLabel')"
            type="text"
            :placeholder="$t('todoForm.titlePlaceholder')"
            :error="errors.title"
          >
            <template #icon>
              <svg
                class="h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </template>
          </FormsFormInput>

          <!-- Description Input -->
          <div>
            <label
              for="description"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              {{ $t("todoForm.descriptionLabel") }}
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors duration-200 resize-none"
              :placeholder="$t('todoForm.descriptionPlaceholder')"
            ></textarea>
          </div>

          <!-- Status Toggle (chỉ hiển thị khi edit) -->
          <div
            v-if="isEdit"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">
                  {{ $t("statusLabel") }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ $t("statusDescription") }}
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="toggleStatus"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
                formData.isDone ? 'bg-green-600' : 'bg-gray-200',
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                  formData.isDone ? 'translate-x-6' : 'translate-x-1',
                ]"
              />
            </button>
          </div>

          <!-- Error Message -->
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div class="flex">
              <svg
                class="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  {{ $t("todoForm.errorTitle") }}
                </h3>
                <div class="mt-2 text-sm text-red-700">{{ error }}</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-4 pt-6">
            <BaseButton
              type="button"
              variant="ghost"
              size="md"
              :ignore-modal-state="true"
              @click="handleCancel"
              class="px-6 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {{ $t("todoForm.cancel") }}
            </BaseButton>
            <BaseButton
              type="submit"
              :disabled="loading"
              size="md"
              :ignore-modal-state="true"
              class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span class="flex items-center">
                <svg
                  v-if="loading"
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {{ loading ? $t("todoForm.saving") : $t("todoForm.save") }}
              </span>
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";

// Props
interface Props {
  initialData?: {
    title: string;
    description?: string;
    isDone?: boolean;
  };
  isEdit?: boolean;
  loading?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  loading: false,
  error: "",
});

// Emits
const emit = defineEmits<{
  submit: [data: { title: string; description?: string; isDone?: boolean }];
  cancel: [];
}>();

// Form data
const formData = reactive({
  title: props.initialData?.title || "",
  description: props.initialData?.description || "",
  isDone: props.initialData?.isDone || false,
});

// Validation schema
const schema = computed(() =>
  yup.object({
    title: yup
      .string()
      .required($t("validation.title.required"))
      .min(3, $t("validation.title.minLength")),
  })
);

// Form validation
const {
  errors,
  handleSubmit: validateForm,
  defineField,
} = useForm({
  validationSchema: schema.value,
});

const [title, titleAttrs] = defineField("title");

// Methods
const toggleStatus = () => {
  formData.isDone = !formData.isDone;
};

const handleSubmit = validateForm((values) => {
  emit("submit", {
    title: values.title,
    description: formData.description,
    isDone: formData.isDone,
  });
});

const handleCancel = () => {
  emit("cancel");
};

// Watch for prop changes
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.title = newData.title;
      formData.description = newData.description || "";
      formData.isDone = newData.isDone || false;
      title.value = newData.title;
    }
  },
  { deep: true, immediate: true }
);

// Watch for title changes to sync with formData
watch(title, (newValue) => {
  formData.title = newValue;
});

// Watch for formData.title changes to sync with title
watch(() => formData.title, (newValue) => {
  title.value = newValue;
});
</script>
