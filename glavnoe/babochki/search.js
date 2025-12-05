// search.js

// Модальное окно (уже в HTML, но управляем из JS)
const modal = document.getElementById('search-modal');
const resultsContainer = document.getElementById('search-results');
const noResultsMsg = document.getElementById('no-results');
const searchInput = document.querySelector('.search-box input');

// Открытие модалки
function openSearch() {
    modal.style.display = 'block';
}

// Закрытие модалки
function closeSearch() {
    modal.style.display = 'none';
    searchInput.value = '';
}

// Основная функция поиска
function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    fetch('search-data.json')
        .then(response => {
            if (!response.ok) throw new Error('Не удалось загрузить данные');
            return response.json();
        })
        .then(data => {
            const matches = data.filter(item => 
                item.name.toLowerCase().includes(query)
            );

            if (matches.length === 0) {
                noResultsMsg.style.display = 'block';
                resultsContainer.innerHTML = '';
            } else {
                noResultsMsg.style.display = 'none';
                resultsContainer.innerHTML = matches.map(item => `
                    <a href="${item.url}" class="search-result-item">
                        <strong>${highlightText(item.name, query)}</strong>
                    </a>
                `).join('');
            }

            openSearch();
        })
        .catch(err => {
            console.error(err);
            alert('Ошибка поиска. Проверьте подключение к интернету и наличие файла search-data.json');
        });
}

// Подсветка найденного текста
function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Обработчик Enter
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Закрытие по кнопке
document.addEventListener('click', function(e) {
    if (e.target.matches('#search-modal button')) {
        closeSearch();
    }
});

// Закрытие по клику вне контента
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeSearch();
    }
});

// Добавляем стили для подсветки (встроим в JS, чтобы не трогать CSS)
const style = document.createElement('style');
style.textContent = `
    .search-result-item {
        display: block;
        padding: 12px;
        margin: 8px 0;
        background: rgba(0,255,255,0.1);
        border: 1px solid #0ff;
        border-radius: 8px;
        color: #0ff;
        text-decoration: none;
        transition: 0.2s;
        font-size: 1rem;
    }
    .search-result-item:hover {
        background: rgba(0,255,255,0.2);
    }
    .highlight {
        background: #0ff;
        color: #000;
        padding: 0 4px;
        border-radius: 3px;
    }
`;
document.head.appendChild(style);
