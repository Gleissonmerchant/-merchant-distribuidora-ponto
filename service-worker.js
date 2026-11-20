
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "Merchant Distribuidora",
      body: event.data ? event.data.text() : "Novo registro de ponto."
    };
  }

  const title = data.title || "Merchant Distribuidora";

  const options = {
    body: data.body || "Novo registro de ponto.",
    icon: "logo.png",
    badge: "logo.png",
    tag: data.tag || "merchant-ponto",
    renotify: true,
    data: { url: data.url || "./admin.html" }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const target = new URL(
    event.notification.data?.url || "./admin.html",
    self.registration.scope
  ).href;

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    for (const client of windows) {
      if (
        client.url.startsWith(self.registration.scope) &&
        "focus" in client
      ) {
        await client.focus();

        if (client.navigate) {
          await client.navigate(target);
        }

        return;
      }
    }

    if (self.clients.openWindow) {
      await self.clients.openWindow(target);
    }
  })());
});

