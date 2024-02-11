module.exports = {

  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#4CE895",
        'secondary': "#CAD0C9"
        
      },
      boxShadow: {
        'custom': 'rgba(60, 64, 67, 0.1) 0px 1px 2px 0px, rgba(60, 64, 67, 0.1) 0px 2px 6px 2px;',
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
]
}

