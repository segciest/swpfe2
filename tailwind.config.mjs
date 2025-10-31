/** @type {import('tailwindcss').Config} */
export default {
  // BÁO CHO TAILWIND BIẾT SẼ DÙNG CLASS 'dark'
  darkMode: 'class', 
  
  // RẤT QUAN TRỌNG: Khai báo các thư mục chứa code
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    extend: {
      // Bạn có thể thêm các tùy chỉnh (màu sắc, font...) vào đây sau
    },
  },
  plugins: [],
}