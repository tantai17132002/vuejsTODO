import { defineRule, configure } from "vee-validate";
import * as rules from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";

// Khai báo kiểu dữ liệu cho function tự động import của Nuxt
declare const defineNuxtPlugin: any;

// Plugin vee-validate cho Nuxt - cấu hình validation
export default defineNuxtPlugin(() => {
  // Đăng ký tất cả các rule validation có sẵn
  Object.keys(rules).forEach((rule) => {
    defineRule(rule, rules[rule]);
  });

  // Cấu hình vee-validate
  configure({
    // Tạo thông báo lỗi bằng tiếng Việt
    generateMessage: localize("vi", {
      messages: {
        required: "Trường này là bắt buộc",
        email: "Email không hợp lệ",
        min: "Tối thiểu {length} ký tự",
        max: "Tối đa {length} ký tự",
        min_value: "Giá trị tối thiểu là {min}",
        max_value: "Giá trị tối đa là {max}",
        confirmed: "Xác nhận không khớp",
        alpha: "Chỉ được chứa chữ cái",
        alpha_num: "Chỉ được chứa chữ cái và số",
        numeric: "Chỉ được chứa số",
        integer: "Phải là số nguyên",
        decimal: "Phải là số thập phân",
        digits: "Phải có đúng {length} chữ số",
        alpha_dash: "Chỉ được chứa chữ cái, số, gạch ngang và gạch dưới",
        url: "URL không hợp lệ",
        date_format: "Định dạng ngày không hợp lệ",
        after: "Phải sau ngày {target}",
        before: "Phải trước ngày {target}",
        between: "Phải nằm trong khoảng {min} và {max}",
        length: "Phải có đúng {length} ký tự",
        regex: "Định dạng không hợp lệ",
      },
    }),
    // Validate ngay khi người dùng nhập liệu
    validateOnInput: true,
    // Validate khi blur (rời khỏi trường)
    validateOnBlur: true,
  });
});
