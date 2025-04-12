
package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.ProductDto;
import com.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductDto>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        
        Sort sort = direction.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ProductDto> products = productService.getAllProducts(pageable);
        
        return ResponseEntity.ok(
                ApiResponse.<Page<ProductDto>>builder()
                        .success(true)
                        .message("Products fetched successfully")
                        .data(products)
                        .build()
        );
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        
        return ResponseEntity.ok(
                ApiResponse.<ProductDto>builder()
                        .success(true)
                        .message("Product fetched successfully")
                        .data(product)
                        .build()
        );
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ProductDto>>> searchProducts(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDto> products = productService.searchProducts(name, pageable);
        
        return ResponseEntity.ok(
                ApiResponse.<Page<ProductDto>>builder()
                        .success(true)
                        .message("Search results fetched successfully")
                        .data(products)
                        .build()
        );
    }
    
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<Page<ProductDto>>> filterProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDto> products = productService.filterProducts(category, minPrice, maxPrice, pageable);
        
        return ResponseEntity.ok(
                ApiResponse.<Page<ProductDto>>builder()
                        .success(true)
                        .message("Filtered products fetched successfully")
                        .data(products)
                        .build()
        );
    }
    
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getLatestProducts() {
        List<ProductDto> products = productService.getLatestProducts();
        
        return ResponseEntity.ok(
                ApiResponse.<List<ProductDto>>builder()
                        .success(true)
                        .message("Latest products fetched successfully")
                        .data(products)
                        .build()
        );
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getUpcomingProducts() {
        List<ProductDto> products = productService.getUpcomingProducts();
        
        return ResponseEntity.ok(
                ApiResponse.<List<ProductDto>>builder()
                        .success(true)
                        .message("Upcoming products fetched successfully")
                        .data(products)
                        .build()
        );
    }
    
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getFeaturedProducts() {
        List<ProductDto> products = productService.getFeaturedProducts();
        
        return ResponseEntity.ok(
                ApiResponse.<List<ProductDto>>builder()
                        .success(true)
                        .message("Featured products fetched successfully")
                        .data(products)
                        .build()
        );
    }
}
