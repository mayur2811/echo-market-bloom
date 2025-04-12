
package com.ecommerce.service.impl;

import com.ecommerce.dto.ProductCreateRequest;
import com.ecommerce.dto.ProductDto;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;
    
    @Override
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(product -> modelMapper.map(product, ProductDto.class));
    }
    
    @Override
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        return modelMapper.map(product, ProductDto.class);
    }
    
    @Override
    public Page<ProductDto> searchProducts(String keyword, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(keyword, pageable)
                .map(product -> modelMapper.map(product, ProductDto.class));
    }
    
    @Override
    public Page<ProductDto> filterProducts(String category, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return productRepository.filterProducts(category, minPrice, maxPrice, pageable)
                .map(product -> modelMapper.map(product, ProductDto.class));
    }
    
    @Override
    @Transactional
    public ProductDto createProduct(ProductCreateRequest productRequest) {
        UserDetailsImpl userDetails = getCurrentUserDetails();
        User seller = userService.findById(userDetails.getId());
        
        if (seller.getRole() != User.Role.SELLER) {
            throw new UnauthorizedException("Only sellers can create products");
        }
        
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setDiscountPrice(productRequest.getDiscountPrice());
        product.setStock(productRequest.getStock());
        product.setCategory(productRequest.getCategory());
        product.setImageUrl(productRequest.getImageUrl());
        product.setFeatured(productRequest.isFeatured());
        product.setUpcoming(productRequest.isUpcoming());
        product.setUser(seller);
        
        Product savedProduct = productRepository.save(product);
        return modelMapper.map(savedProduct, ProductDto.class);
    }
    
    @Override
    @Transactional
    public ProductDto updateProduct(Long id, ProductCreateRequest productRequest) {
        UserDetailsImpl userDetails = getCurrentUserDetails();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        // Check if the current user is the owner of the product
        if (!product.getUser().getId().equals(userDetails.getId())) {
            throw new UnauthorizedException("You don't have permission to update this product");
        }
        
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setDiscountPrice(productRequest.getDiscountPrice());
        product.setStock(productRequest.getStock());
        product.setCategory(productRequest.getCategory());
        product.setImageUrl(productRequest.getImageUrl());
        product.setFeatured(productRequest.isFeatured());
        product.setUpcoming(productRequest.isUpcoming());
        
        Product updatedProduct = productRepository.save(product);
        return modelMapper.map(updatedProduct, ProductDto.class);
    }
    
    @Override
    @Transactional
    public void deleteProduct(Long id) {
        UserDetailsImpl userDetails = getCurrentUserDetails();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        // Check if the current user is the owner of the product
        if (!product.getUser().getId().equals(userDetails.getId())) {
            throw new UnauthorizedException("You don't have permission to delete this product");
        }
        
        productRepository.delete(product);
    }
    
    @Override
    public Page<ProductDto> getSellerProducts(Pageable pageable) {
        UserDetailsImpl userDetails = getCurrentUserDetails();
        User seller = userService.findById(userDetails.getId());
        
        return productRepository.findByUser(seller, pageable)
                .map(product -> modelMapper.map(product, ProductDto.class));
    }
    
    @Override
    public List<ProductDto> getLatestProducts() {
        return productRepository.findTop8ByOrderByCreatedAtDesc().stream()
                .map(product -> modelMapper.map(product, ProductDto.class))
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductDto> getUpcomingProducts() {
        return productRepository.findByUpcomingTrue().stream()
                .map(product -> modelMapper.map(product, ProductDto.class))
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue().stream()
                .map(product -> modelMapper.map(product, ProductDto.class))
                .collect(Collectors.toList());
    }
    
    private UserDetailsImpl getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }
}
