import { put } from '@vercel/blob'
import { readFileSync } from 'fs'

const TOKEN = 'vercel_blob_rw_aMRqpe0w5Rz8KDSV_6YuTsiqScltRijZxtKp3Fid2EKafR4'

console.log('Uploading hero video (desktop)...')
const heroData = readFileSync('c:/Users/sabin/OneDrive/Documents/cabin studio/public/videos/hero-bg.mp4')
const hero = await put('hero-bg.mp4', heroData, {
  access: 'public',
  contentType: 'video/mp4',
  token: TOKEN,
  addRandomSuffix: false,
})

console.log('Uploading door video...')
const doorData = readFileSync('c:/Users/sabin/OneDrive/Documents/cabin studio/public/videos/door-video.mp4')
const door = await put('door-video.mp4', doorData, {
  access: 'public',
  contentType: 'video/mp4',
  token: TOKEN,
  addRandomSuffix: false,
})

console.log('Uploading mobile hero video...')
const mobileData = readFileSync('c:/Users/sabin/OneDrive/Documents/mobile-hero-web.mp4')
const mobile = await put('mobile-hero.mp4', mobileData, {
  access: 'public',
  contentType: 'video/mp4',
  token: TOKEN,
  addRandomSuffix: false,
})

console.log('\n✅ Done! URLs:\n')
console.log('Hero (desktop):', hero.url)
console.log('Door:', door.url)
console.log('Mobile hero:', mobile.url)
