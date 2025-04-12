
package com.ecommerce.service;

import com.ecommerce.dto.ProductCreateRequest;
import com.ecommerce.dto.ProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    Page<ProductDto> getAllProducts(Pageable pageable);
    ProductDto getProductById(Long id);
    Page<ProductDto> searchProducts(String keyword, Pageable pageable);
    Page<ProductDto> filterProducts(String category, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    ProductDto createProduct(ProductCreateRequest productRequest);
    ProductDto updateProduct(Long id, ProductCreateRequest productRequest);
    void deleteProduct(Long id);
    Page<ProductDto> getSellerProducts(Pageable pageable);
    List<ProductDto> getLatestProducts();
    List<ProductDto> getUpcomingProducts();
    List<ProductDto> getFeaturedProducts();
}
