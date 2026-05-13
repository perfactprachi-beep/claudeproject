function fireEvent(eventName: string, params: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

export function trackHeroBannerClick(slideIndex: number, ctaLabel: string): void {
  fireEvent('hero_banner_click', { slide_index: slideIndex, cta_label: ctaLabel })
}

export function trackCategoryTileClick(categoryName: string): void {
  fireEvent('category_tile_click', { category_name: categoryName })
}

export function trackProductImpression(productId: string, position: number): void {
  fireEvent('product_impression', { product_id: productId, position })
}

export function trackFilterApplied(filterType: string, filterValue: string): void {
  fireEvent('filter_applied', { filter_type: filterType, filter_value: filterValue })
}

export function trackSortChanged(sortType: string): void {
  fireEvent('sort_changed', { sort_type: sortType })
}

export function trackProductClick(
  productId: string,
  productName: string,
  position: number,
  listName: string,
): void {
  fireEvent('product_click', {
    product_id: productId,
    product_name: productName,
    position,
    list_name: listName,
  })
}

export function trackAddToWishlist(productId: string): void {
  fireEvent('add_to_wishlist', { product_id: productId })
}

// ── Search GA4 events ─────────────────────────────────────────────────────────

export function trackSearch(searchTerm: string): void {
  fireEvent('search', { search_term: searchTerm })
}

export function trackViewSearchResults(searchTerm: string, resultCount: number): void {
  fireEvent('view_search_results', { search_term: searchTerm, result_count: resultCount })
}

export function trackSelectSearchContent(contentType: string, contentId: string): void {
  fireEvent('select_content', { content_type: contentType, content_id: contentId })
}

// ── PDP GA4 events ────────────────────────────────────────────────────────────

export function trackViewItem(
  productId: string,
  productName: string,
  brand: string,
  price: number,
): void {
  fireEvent('view_item', { product_id: productId, product_name: productName, brand, price })
}

export function trackAddToCart(
  productId: string,
  productName: string,
  price: number,
  quantity: number,
): void {
  fireEvent('add_to_cart', { product_id: productId, product_name: productName, price, quantity })
}

export function trackSelectItem(
  productId: string,
  productName: string,
  position: number,
  listName: string,
): void {
  fireEvent('select_item', {
    product_id: productId,
    product_name: productName,
    position,
    list_name: listName,
  })
}
