const fs = require('fs')
const path = require('path')

// Simple performance monitoring script
function analyzeBundleSize() {
  const nextDir = path.join(__dirname, '../.next')
  
  if (fs.existsSync(nextDir)) {
    const staticDir = path.join(nextDir, 'static')
    if (fs.existsSync(staticDir)) {
      const jsDir = path.join(staticDir, 'chunks')
      if (fs.existsSync(jsDir)) {
        const files = fs.readdirSync(jsDir)
        let totalSize = 0
        
        files.forEach(file => {
          if (file.endsWith('.js')) {
            const filePath = path.join(jsDir, file)
            const stats = fs.statSync(filePath)
            totalSize += stats.size
            console.log(`${file}: ${(stats.size / 1024 / 1024).toFixed(2)} MB`)
          }
        })
        
        console.log(`\nTotal JS bundle size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
      }
    }
  }
}

// Run analysis if called directly
if (require.main === module) {
  analyzeBundleSize()
}

module.exports = { analyzeBundleSize }
