export {}
declare global {
    interface Location { 
        setSearchParams: (params: { [key: string]: string }) => void,
    }
}
Location.prototype.setSearchParams = function(params: { [key: string]: string }): void {
    let currentURL = new URL(window.location);
    for (const [key, value] of Object.entries(params)) {
        if (value === '') {
            currentURL.searchParams.delete(key);
        } else {
            currentURL.searchParams.set(key, value);
        }
    }
    window.location = currentURL;
}