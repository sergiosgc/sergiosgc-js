import "../../call-on-load/src/index";

globalThis.sergiosgc.callOnLoad(function() {
    const navigation = window['navigation'] as any;
    navigation.addEventListener('navigate', function(ev: any) {
        const url = new URL(ev.destination.url);
        const method = url.searchParams.get('x-verb');
        if (!method || method === 'GET') return;
        url.searchParams.delete('x-verb');
        ev.intercept({
            handler: async () => {
              const response = await fetch(url, { method, redirect: 'manual' });
              if (response.status >= 300 && response.status < 400 && response.headers.has('Location')) {
                  const redirectUrl = response.headers.get('Location');
                  if (redirectUrl) {
                      window.location.href = redirectUrl;
                      return;
                  }
              }
            }
          });

    });

});
