
package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.ProductCreateRequest;
import com.ecommerce.dto.ProductDto;
import com.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/seller")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
public class SellerController {
    
    private final ProductService productService;
    
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<Page<ProductDto>>> getSellerProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort sort = direction.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ProductDto> products = productService.getSellerProducts(pageable);
        
        return ResponseEntity.ok(
                ApiResponse.<Page<ProductDto>>builder()
                        .success(true)
                        .message("Seller products fetched successfully")
                        .data(products)
                        .build()
        );
    }
    
    @PostMapping("/products/add")
    public ResponseEntity<ApiResponse<ProductDto>> addProduct(@Valid @RequestBody ProductCreateRequest productRequest) {
        ProductDto product = productService.createProduct(productRequest);
        
        return ResponseEntity.ok(
                ApiResponse.<ProductDto>builder()
                        .success(true)
                        .message("Product added successfully")
                        .data(product)
                        .build()
        );
    }
    
    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductCreateRequest productRequest) {
        
        ProductDto product = productService.updateProduct(id, productRequest);
        
        return ResponseEntity.ok(
                ApiResponse.<ProductDto>builder()
                        .success(true)
                        .message("Product updated successfully")
                        .data(product)
                        .build()
        );
    }
    
    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Product deleted successfully")
                        .build()
        );
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<String>> getDashboard() {
        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Dashboard fetched successfully")
                        .data("Seller Dashboard Data")
                        .build()
        );
    }
}
