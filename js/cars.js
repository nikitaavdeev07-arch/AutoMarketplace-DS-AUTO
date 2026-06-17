function formatPrice(price) {
    return price.toLocaleString('ru-RU') + " ₽";
}

function showSuccessToast(carName, clientName) {
    const existingToast = document.querySelector('.success-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'success-toast';
    
    const firstName = clientName.trim().split(/\s+/)[0] || 'Клиент';
    
    toast.innerHTML = `
        <div class="toast-icon">✓</div>
        <div class="toast-content">
            <strong>Заявка успешно принята! 🚀</strong>
            <p>${firstName}, ваш запрос на <strong>${carName}</strong> получен.<br>Менеджер DS Auto свяжется с вами в течение 15 минут.</p>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 400);
    }, 4800);
}

function openOrderModal(car) {
    window.currentSelectedCar = car;
    const modalCarTitleSpan = document.getElementById('modalCarTitle');
    if (modalCarTitleSpan) {
        modalCarTitleSpan.innerText = `${car.brand} ${car.model} · ${car.year}  |  ${formatPrice(car.price)}`;
    }
    
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    
    if (fullNameInput) fullNameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (emailInput) emailInput.value = '';
    
    hideAllErrors();
    
    const modal = document.getElementById('orderModal');
    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('orderModal');
    if (modal) modal.classList.remove('active');
    window.currentSelectedCar = null;
}

function hideAllErrors() {
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const emailError = document.getElementById('emailError');
    
    if (nameError) nameError.style.display = 'none';
    if (phoneError) phoneError.style.display = 'none';
    if (emailError) emailError.style.display = 'none';
}

function validateForm() {
    let isValid = true;
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    
    const nameWords = fullName.split(/\s+/);
    const nameError = document.getElementById('nameError');
    if (fullName.length < 5 || nameWords.length < 2) {
        if (nameError) nameError.style.display = 'block';
        isValid = false;
    } else {
        if (nameError) nameError.style.display = 'none';
    }
    
    const phoneDigits = phone.replace(/[\s\(\)\-\+]/g, '');
    const phoneError = document.getElementById('phoneError');
    if (phoneDigits.length < 10 || phoneDigits.length > 15 || !/^[\d]+$/.test(phoneDigits)) {
        if (phoneError) phoneError.style.display = 'block';
        isValid = false;
    } else {
        if (phoneError) phoneError.style.display = 'none';
    }
    
    const emailPattern = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    const emailError = document.getElementById('emailError');
    if (!emailPattern.test(email)) {
        if (emailError) emailError.style.display = 'block';
        isValid = false;
    } else {
        if (emailError) emailError.style.display = 'none';
    }
    return isValid;
}

function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    
    const carInfo = window.currentSelectedCar ? 
        `${window.currentSelectedCar.brand} ${window.currentSelectedCar.model} (${window.currentSelectedCar.year})` : 
        'Автомобиль DS Auto';
    
    showSuccessToast(carInfo, fullName);
    
    console.log(`✅ Заявка: ${fullName}, ${phone}, ${email}, Авто: ${carInfo}`);
    
    closeModal();
    const form = document.getElementById('buyerForm');
    if (form) form.reset();
    hideAllErrors();
}

function initEventHandlers() {
    const form = document.getElementById('buyerForm');
    if (form) {
        form.removeEventListener('submit', handleFormSubmit);
        form.addEventListener('submit', handleFormSubmit);
    }
    
    const modal = document.getElementById('orderModal');
    if (modal) {
        window.removeEventListener('click', handleOutsideClick);
        window.addEventListener('click', handleOutsideClick);
    }
    
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.removeEventListener('click', closeModal);
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    
    if (fullNameInput) {
        fullNameInput.removeEventListener('input', hideNameError);
        fullNameInput.addEventListener('input', hideNameError);
    }
    
    if (phoneInput) {
        phoneInput.removeEventListener('input', hidePhoneError);
        phoneInput.addEventListener('input', hidePhoneError);
    }
    
    if (emailInput) {
        emailInput.removeEventListener('input', hideEmailError);
        emailInput.addEventListener('input', hideEmailError);
    }
    
    const logoBtn = document.getElementById('dsLogoBtn');
    if (logoBtn && logoBtn.tagName !== 'A') {
        logoBtn.removeEventListener('click', handleLogoClick);
        logoBtn.addEventListener('click', handleLogoClick);
    }
}

function handleOutsideClick(e) {
    const modal = document.getElementById('orderModal');
    if (e.target === modal) closeModal();
}

function hideNameError() {
    const nameError = document.getElementById('nameError');
    if (nameError) nameError.style.display = 'none';
}

function hidePhoneError() {
    const phoneError = document.getElementById('phoneError');
    if (phoneError) phoneError.style.display = 'none';
}

function hideEmailError() {
    const emailError = document.getElementById('emailError');
    if (emailError) emailError.style.display = 'none';
}

function handleLogoClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const modal = document.getElementById('orderModal');
    if (modal && modal.classList.contains('active')) closeModal();
    
    const tempMsg = document.createElement('div');
    tempMsg.innerText = 'Добро пожаловать в DS Auto';
    tempMsg.style.position = 'fixed';
    tempMsg.style.bottom = '30px';
    tempMsg.style.left = '50%';
    tempMsg.style.transform = 'translateX(-50%)';
    tempMsg.style.backgroundColor = '#2d3741';
    tempMsg.style.color = '#e0e9f2';
    tempMsg.style.padding = '12px 24px';
    tempMsg.style.borderRadius = '60px';
    tempMsg.style.fontWeight = '600';
    tempMsg.style.zIndex = '1200';
    tempMsg.style.backdropFilter = 'blur(12px)';
    tempMsg.style.border = '1px solid rgba(210,220,240,0.3)';
    tempMsg.style.fontSize = '0.9rem';
    document.body.appendChild(tempMsg);
    
    setTimeout(() => {
        tempMsg.style.opacity = '0';
        setTimeout(() => tempMsg.remove(), 500);
    }, 1800);
}

window.formatPrice = formatPrice;
window.openOrderModal = openOrderModal;
window.initEventHandlers = initEventHandlers;
window.currentSelectedCar = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventHandlers);
} else {
    initEventHandlers();
}