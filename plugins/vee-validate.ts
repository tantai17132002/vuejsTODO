// Plugin vee-validate cho Nuxt
import { defineNuxtPlugin } from '#app'
import { configure } from 'vee-validate'

export default defineNuxtPlugin(() => {
  // Cấu hình VeeValidate - chỉ validate khi submit
  configure({
    validateOnInput: false,    // Không validate khi gõ
    validateOnChange: false,   // Không validate khi thay đổi
    validateOnBlur: false, // Không validate khi click ra ngoài
    validateOnMount: false,   // Không validate khi mount
    validateOnModelUpdate: false, // Không validate khi model update
  })
});
