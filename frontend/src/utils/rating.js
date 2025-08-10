// Calculate average rating safely
function averageRating(reviews) {
    if (!reviews.length) {
        return 0
    };

    let sum = 0;
    for (const review of reviews) {
        sum += review.rating;
    }

    return Math.floor(sum / reviews.length);
}

// Render stars dynamically
function displayRating(star) {
    const fullStars = '⭐'.repeat(star);
    const emptyStars = '⚝'.repeat(5 - star);

    return fullStars + emptyStars;
}

export { averageRating, displayRating };
