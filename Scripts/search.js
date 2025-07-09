// Tạo danh sách sản phẩm và đường dẫn
const productLinks = {
    'trà sữa kem dâu': 'trasuakemdau.html',
    'trà sữa truyền thống': 'trasuachuyenthong.html',
    'trà sữa matcha': 'trasuamatcha.html',
    'trà sữa trân châu đường đen': 'trasuachanchauduongden.html',
    'trà sữa kem tươi': 'trasuakemtuoi.html',
    'cà phê đen': 'capheden.html',
    'cà phê sữa': 'caphesua.html',
    'trà chanh': 'trachanh.html',
    'trà việt quất': 'travietquat.html',
    'trà chanh': 'hongtrachanh.html',
    'milo dằm': 'milodam.html',
    'milo kem tươi': 'milokemtuoi.html',
    'trà trái cây': 'tratraicay.html'
};

// Hàm tìm kiếm gần đúng
function findClosestMatch(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    let bestMatch = null;
    let highestSimilarity = 0;

    for (let product in productLinks) {
        let similarity = calculateSimilarity(searchTerm, product);
        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            bestMatch = product;
        }
    }

    // Trả về kết quả nếu độ tương đồng > 0.3 (30%)
    return highestSimilarity > 0.3 ? productLinks[bestMatch] : null;
}

// Hàm tính độ tương đồng giữa hai chuỗi
function calculateSimilarity(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len1][len2]) / maxLen;
}

// Xử lý sự kiện tìm kiếm
document.querySelector('.search-button').addEventListener('click', handleSearch);
document.querySelector('.search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const searchTerm = document.querySelector('.search-input').value;
    const matchedProduct = findClosestMatch(searchTerm);

    if (matchedProduct) {
        // Chuyển hướng đến trang sản phẩm
        window.location.href = matchedProduct;
    } else {
        // Nếu không tìm thấy, chuyển đến trang menu với thông báo
        window.location.href = 'menu.html?search=' + encodeURIComponent(searchTerm);
    }
}

// Hiển thị gợi ý khi gõ
document.querySelector('.search-input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const suggestions = [];
    
    for (let product in productLinks) {
        if (product.toLowerCase().includes(searchTerm) && searchTerm.length > 0) {
            suggestions.push(product);
        }
    }

    showSuggestions(suggestions);
});

function showSuggestions(suggestions) {
    let suggestionsBox = document.querySelector('.search-suggestions');
    if (!suggestionsBox) {
        suggestionsBox = document.createElement('div');
        suggestionsBox.className = 'search-suggestions';
        document.querySelector('.search-container').appendChild(suggestionsBox);
    }

    if (suggestions.length > 0) {
        suggestionsBox.innerHTML = suggestions
            .map(s => `<div class="suggestion-item">${s}</div>`)
            .join('');
        suggestionsBox.style.display = 'block';

        // Thêm sự kiện click cho các gợi ý
        suggestionsBox.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelector('.search-input').value = this.textContent;
                suggestionsBox.style.display = 'none';
                handleSearch();
            });
        });
    } else {
        suggestionsBox.style.display = 'none';
    }
}

// Ẩn gợi ý khi click ra ngoài
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-container')) {
        const suggestionsBox = document.querySelector('.search-suggestions');
        if (suggestionsBox) {
            suggestionsBox.style.display = 'none';
        }
    }
});

document.querySelector('.search-button').addEventListener('click', function() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    // Thực hiện tìm kiếm
    searchProducts(searchTerm);
});

document.querySelector('.search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const searchTerm = this.value.toLowerCase();
        // Thực hiện tìm kiếm
        searchProducts(searchTerm);
    }
});

function searchProducts(term) {
    // Lấy tất cả sản phẩm
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        if (title.includes(term)) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
    });
}