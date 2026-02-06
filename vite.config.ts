
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Assicurati che questo corrisponda al nome del repo: arvaia---distribuzione
  base: '/arvaia---distribuzione/', 
});
