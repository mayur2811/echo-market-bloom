
import { useState } from 'react';
import { toast } from 'sonner';

const ProductReviews = ({ product, isAuthenticated, currentUser, addReview }) => {
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  
  // Handle review submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (!reviewForm.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    
    const newReview = {
      userId: currentUser.id,
      username: currentUser.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    };
    
    addReview(product.id, newReview);
    setReviewForm({ rating: 5, comment: '' });
  };
  
  return (
    <div>
      {/* Reviews list */}
      {product.reviews && product.reviews.length > 0 ? (
        <div className="space-y-6 mb-8">
          {product.reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                    {review.username ? review.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-medium">{review.username}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= review.rating ? "text-yellow-400" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-8">No reviews yet. Be the first to review this product!</p>
      )}
      
      {/* Review form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-medium mb-4">Write a Review</h3>
        <form onSubmit={handleReviewSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  className="focus:outline-none text-2xl"
                >
                  <span className={star <= reviewForm.rating ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="comment">Review</label>
            <textarea
              id="comment"
              rows="4"
              className="exclusive-input"
              placeholder="Write your review here..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              required
            ></textarea>
          </div>
          <button type="submit" className="exclusive-btn">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductReviews;
