import daisyui from 'daisyui';
import tailwindcss from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: { extend: {} },
  plugins: [tailwindcss, daisyui],
  daisyui: {
    themes: ['dark'],
  },
};
