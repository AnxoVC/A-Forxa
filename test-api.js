async function test() {
  try {
    const res = await fetch('https://world.openfoodfacts.org/api/v2/search?search_terms=colacao&fields=code,product_name,brands,nutriments&page_size=20', {
      headers: {
        'User-Agent': 'AForxa/1.0'
      }
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body:', text.substring(0, 500));
  } catch (e) {
    console.error('Error:', e.message);
  }
}
test();
