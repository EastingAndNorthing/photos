
export async function get(url, params) {
    if (params) params = Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&')
    try {
        let response = await fetch(params ? url+'?'+params : url);
        return await response.json();
    } catch(e) {
        console.log('Fetch failed');
    }
}
