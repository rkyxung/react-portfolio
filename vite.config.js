import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 배포 시 레포 이름에 맞춰 base 경로 설정
  // https://rkyxung.github.io/zero/ → "/zero/"
  base: "/zero",

})
