// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react-swc'

// // // https://vitejs.dev/config/
// // export default defineConfig({
// //   server: {
// //     proxy: {
// //       'http://https://mern-estate-backend-iz4a.onrender.com/api': {
// //         target: 'http://localhost:3000',
// //         source: false
// //       }
// //     }
// //   },
// //   plugins: [react()],
// // })


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       'http://https://mern-estate-backend-iz4a.onrender.com/api': {
//         target: 'http://localhost:3000',
//         changeOrigin: true
//       }
//     }
//   }
// })


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     proxy: {
//       'http://https://mern-estate-backend-iz4a.onrender.com/api': {
//         target: 'http://localhost:3000',
//         source: false
//       }
//     }
//   },
//   plugins: [react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://https://mern-estate-backend-iz4a.onrender.com",
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
