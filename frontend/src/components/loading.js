const dataContainer = document.getElementById('app');

function showLoading() {
    dataContainer.textContent = 'Loading data...';
}

function hideLoading() {
    dataContainer.textContent = '';
}

export { showLoading, hideLoading }