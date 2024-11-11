export interface SearchParams {
  cr: string|null;
  dpr: string|null;
  upr: string|null;
}
export const SearchProductFetch = async ({ cr, dpr, upr }: SearchParams) => {
  try {
    let response = await fetch(`http://localhost:3000/api/product?cr=${cr}&dpr=${dpr}&upr=${upr}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Ürünler getirilemedi');
    }
    return response.json();
  } catch (error) {
    console.error('Ürün getirme hatası:', error);
    throw error;
  }
};
