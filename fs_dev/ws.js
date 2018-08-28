var cacheName = 'Den_Trai_Tim-3n'
var filesToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/love.min.js',
  '/heart-icon.png',
  '/ws.js'
]

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install')
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell')
      return cache.addAll(filesToCache)
    })
  )
})

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate')
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key)
          return caches.delete(key)
        }
      }))
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', function (event) {
  console.log('Fetch event for ', event.request.url)
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (/\/rpc\//i.test(event.request.url) /* || /\/ws.js/i.test(event.request.url) */) {
        console.log('Network request for ', event.request.url)
        return fetch(event.request.clone())
      }
      if (response) {
        console.log('Found ', event.request.url, ' in cache')
        return response
      }
      console.log('Network request for ', event.request.url)
      return fetch(event.request.clone()).then(function (response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }
        var responseToCache = response.clone()
        caches.open(cacheName).then(function (cache) {
          cache.put(event.request, responseToCache)
        })
        return response
      })
    }).catch(function (error) {
      console.error('Fetch:', error)
      // return caches.match('/index.html')
    })
  )
})
