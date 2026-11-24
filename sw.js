// 알림 전용 서비스 워커. 화면을 저장(캐시)하지 않으므로 사이트는 언제나 최신 파일로 열린다.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  if (e.action === "close") return;
  const href = (e.notification.data && e.notification.data.href) || "";
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const c = list[0];
    if (c) { try { await c.focus(); } catch {} c.postMessage({ type: "nt-open", href }); return; }
    await self.clients.openWindow("./" + href);
  })());
});
