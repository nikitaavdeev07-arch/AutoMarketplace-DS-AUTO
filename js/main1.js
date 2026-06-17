const brands = [
    { name: 'BMW', count: 7 },
    { name: 'Mercedes-Benz', count: 7 },
    { name: 'Audi', count: 6 },
    { name: 'Lexus', count: 6 },
    { name: 'Toyota', count: 6 },
    { name: 'Volkswagen', count: 6 },
    { name: 'Kia', count: 6 },
    { name: 'Nissan', count: 6 },
    { name: 'Subaru', count: 6 },
    { name: 'Porsche', count: 6 },
];

function getBrandUrl(brandName) {
    const slug = brandName.toLowerCase().replace(/\s+/g, '-');
    return `${slug}.html`;
}

function renderBrands() {
    const container = document.getElementById('brandContainer');
    
    brands.forEach(brand => {
        const card = document.createElement('div');
        card.className = 'brand-card';
        
        const link = document.createElement('a');
        link.href = getBrandUrl(brand.name);
        link.innerHTML = `
            ${brand.name}
            <span class="brand-count">${brand.count} авто</span>
        `;
        
        card.appendChild(link);
        container.appendChild(card);
    });
}

function showNotification(message, type = 'success') {
    const oldNotification = document.querySelector('.custom-notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">${icons[type] || icons.success}</div>
        <div class="notification-content">
            <div class="notification-title">${type === 'success' ? 'Заявка принята!' : 'Ошибка'}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">×</button>
        <div class="notification-progress"></div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

function showPhoneModal(title, callback) {
    const oldModal = document.querySelector('.phone-modal');
    if (oldModal) {
        oldModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'phone-modal';
    
    modal.innerHTML = `
        <div class="phone-modal-overlay"></div>
        <div class="phone-modal-content">
            <button class="phone-modal-close">&times;</button>
            <div class="phone-modal-icon">📞</div>
            <h3>${title}</h3>
            <p>Оставьте ваш номер телефона, и мы свяжемся с вами</p>
            <form class="phone-form" id="phoneForm">
                <div class="input-group">
                    <input type="tel" id="phoneNumber" placeholder="+7 (___)-___-__-__" autocomplete="off">
                    <span class="input-border"></span>
                </div>
                <button type="submit" class="submit-btn">Отправить заявку</button>
            </form>
            <p class="modal-hint">Мы не передаём данные третьим лицам</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    const closeBtn = modal.querySelector('.phone-modal-close');
    const overlay = modal.querySelector('.phone-modal-overlay');
    
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    const phoneInput = modal.querySelector('#phoneNumber');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        let formatted = '';
        if (value.length > 0) {
            formatted = '+7';
            if (value.length > 1) {
                formatted += ` (${value.slice(1, 4)}`;
            }
            if (value.length >= 4) {
                formatted += `) ${value.slice(4, 7)}`;
            }
            if (value.length >= 7) {
                formatted += `-${value.slice(7, 9)}`;
            }
            if (value.length >= 9) {
                formatted += `-${value.slice(9, 11)}`;
            }
        }
        e.target.value = formatted;
    });
    
    const form = modal.querySelector('#phoneForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = phoneInput.value.trim();
        
        if (phone.length < 10) {
            showNotification('Пожалуйста, введите корректный номер телефона', 'error');
            phoneInput.style.borderColor = '#ef4444';
            setTimeout(() => {
                phoneInput.style.borderColor = '';
            }, 2000);
            return;
        }
        
        showNotification(`Заявка принята! Мы перезвоним на номер ${phone}`, 'success');
        closeModal();
        if (callback) callback(phone);
    });
    
    setTimeout(() => phoneInput.focus(), 100);
}

function createBottomDrawer() {
    if (document.querySelector('.bottom-drawer')) return;
    
    const drawerHTML = `
        <div class="bottom-drawer" id="bottomDrawer">
            <div class="drawer-handle"></div>
            <div class="drawer-content">
                <div class="drawer-header">
                    <p id="drawerSubtitle">Выберите услугу ниже:</p>
                </div>
                
                <div class="drawer-services">
                    <div class="service-card" data-service="tradein">
                        <div class="service-icon">🔄</div>
                        <div class="service-info">
                            <h4>Trade-In</h4>
                            <p>Оценим ваш автомобиль за 15 минут</p>
                            <button class="service-btn tradein-btn">Оценить</button>
                        </div>
                    </div>
                    
                    <div class="service-card" data-service="evaluate">
                        <div class="service-icon">📊</div>
                        <div class="service-info">
                            <h4>Оценка авто</h4>
                            <p>Бесплатная экспертная оценка</p>
                            <button class="service-btn evaluate-btn">Записаться</button>
                        </div>
                    </div>
                    
                    <div class="service-card" data-service="callback">
                        <div class="service-icon">📞</div>
                        <div class="service-info">
                            <h4>Запрос звонка</h4>
                            <p>Перезвоним за 30 секунд</p>
                            <button class="service-btn callback-btn">Позвоните мне</button>
                        </div>
                    </div>
                </div>
                
                <div class="drawer-contact">
                    <a href="tel:+79999999999" class="drawer-phone">📞 +7 999 999-99-99</a>
                    <a href="mailto:info@dsauto.ru" class="drawer-email">✉️ info@dsauto.ru</a>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', drawerHTML);
}

function addDrawerStyles() {
    if (document.getElementById('drawerStyles')) return;
    
    const styles = `
        <style id="drawerStyles">
            :root {
                --dark-gray: #1a1a2e;
                --dark-gray-2: #16213e;
                --silver: #c0c0c0;
                --silver-light: #e0e0e0;
                --silver-dark: #9ca3af;
                --accent: #a0a0a0;
                --accent-hover: #c0c0c0;
            }
            
            .bottom-drawer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, var(--dark-gray) 0%, var(--dark-gray-2) 100%);
                border-radius: 24px 24px 0 0;
                box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
                transform: translateY(calc(100% - 40px));
                transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
                z-index: 1000;
                border-top: 1px solid rgba(192, 192, 192, 0.3);
            }
            
            .bottom-drawer.open {
                transform: translateY(0);
            }
            
            .drawer-handle {
                width: 50px;
                height: 4px;
                background: var(--silver-dark);
                border-radius: 2px;
                margin: 12px auto 8px;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .drawer-handle:hover {
                background: var(--silver);
            }
            
            .drawer-content {
                padding: 16px 20px 24px;
                max-height: 70vh;
                overflow-y: auto;
            }
            
            .drawer-header {
                text-align: center;
                margin-bottom: 20px;
            }
            
            .drawer-header p {
                font-size: 1rem;
                font-weight: 500;
                color: var(--silver-light);
                letter-spacing: 0.5px;
            }
            
            .drawer-services {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }
            
            .service-card {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                border: 1px solid rgba(192, 192, 192, 0.2);
                transition: all 0.3s ease;
                cursor: pointer;
                backdrop-filter: blur(10px);
            }
            
            .service-card:hover {
                transform: translateY(-3px);
                border-color: var(--silver);
                background: rgba(192, 192, 192, 0.1);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            }
            
            .service-icon {
                font-size: 2rem;
            }
            
            .service-info h4 {
                font-size: 1rem;
                font-weight: 700;
                color: var(--silver-light);
                margin-bottom: 4px;
            }
            
            .service-info p {
                font-size: 0.7rem;
                color: var(--silver-dark);
                margin-bottom: 8px;
            }
            
            .service-btn {
                background: rgba(192, 192, 192, 0.15);
                border: 1px solid rgba(192, 192, 192, 0.3);
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.7rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                color: var(--silver-light);
            }
            
            .service-btn:hover {
                background: var(--silver);
                color: var(--dark-gray);
                border-color: var(--silver);
            }
            
            .drawer-contact {
                display: flex;
                justify-content: center;
                gap: 24px;
                padding-top: 16px;
                border-top: 1px solid rgba(192, 192, 192, 0.2);
            }
            
            .drawer-phone, .drawer-email {
                text-decoration: none;
                color: var(--silver-dark);
                font-weight: 500;
                font-size: 0.85rem;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: color 0.2s;
            }
            
            .drawer-phone:hover, .drawer-email:hover {
                color: var(--silver);
            }
            
            .custom-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                min-width: 280px;
                max-width: 400px;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border-radius: 16px;
                box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                gap: 14px;
                padding: 16px 20px;
                z-index: 2000;
                transform: translateX(120%);
                transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
                border-left: 4px solid var(--silver);
                backdrop-filter: blur(10px);
            }
            
            .custom-notification.show {
                transform: translateX(0);
            }
            
            .custom-notification.error {
                border-left-color: #ef4444;
            }
            
            .notification-icon {
                font-size: 1.8rem;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 700;
                font-size: 0.9rem;
                color: var(--silver-light);
                margin-bottom: 4px;
            }
            
            .notification-message {
                font-size: 0.75rem;
                color: var(--silver-dark);
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.4rem;
                cursor: pointer;
                color: var(--silver-dark);
                transition: color 0.2s;
                line-height: 1;
            }
            
            .notification-close:hover {
                color: var(--silver);
            }
            
            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: var(--silver);
                width: 100%;
                animation: progress 4s linear forwards;
                border-radius: 0 0 0 16px;
            }
            
            @keyframes progress {
                0% { width: 100%; }
                100% { width: 0%; }
            }
            
            .phone-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1500;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .phone-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .phone-modal-overlay {
                position: absolute;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            
            .phone-modal-content {
                position: relative;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border-radius: 32px;
                max-width: 420px;
                width: 90%;
                padding: 32px 28px;
                text-align: center;
                transform: scale(0.9);
                transition: transform 0.3s ease;
                box-shadow: 0 30px 50px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(192, 192, 192, 0.2);
            }
            
            .phone-modal.show .phone-modal-content {
                transform: scale(1);
            }
            
            .phone-modal-icon {
                font-size: 3rem;
                margin-bottom: 16px;
            }
            
            .phone-modal-content h3 {
                font-size: 1.5rem;
                font-weight: 700;
                background: linear-gradient(135deg, var(--silver-light), var(--silver));
                background-clip: text;
                -webkit-background-clip: text;
                color: transparent;
                margin-bottom: 8px;
            }
            
            .phone-modal-content p {
                font-size: 0.85rem;
                color: var(--silver-dark);
                margin-bottom: 24px;
            }
            
            .phone-modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--silver-dark);
                transition: color 0.2s;
            }
            
            .phone-modal-close:hover {
                color: var(--silver);
            }
            
            .input-group {
                position: relative;
                margin-bottom: 24px;
            }
            
            .input-group input {
                width: 100%;
                padding: 14px 16px;
                font-size: 1rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(192, 192, 192, 0.2);
                border-radius: 16px;
                outline: none;
                transition: all 0.2s;
                font-family: inherit;
                color: var(--silver-light);
            }
            
            .input-group input:focus {
                border-color: var(--silver);
                box-shadow: 0 0 0 3px rgba(192, 192, 192, 0.1);
            }
            
            .input-group input::placeholder {
                color: var(--silver-dark);
            }
            
            .submit-btn {
                width: 100%;
                background: linear-gradient(135deg, var(--silver), var(--silver-dark));
                color: var(--dark-gray);
                border: none;
                padding: 14px 24px;
                border-radius: 16px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(192, 192, 192, 0.3);
                background: linear-gradient(135deg, var(--silver-light), var(--silver));
            }
            
            .modal-hint {
                font-size: 0.7rem;
                color: var(--silver-dark);
                margin-top: 16px;
            }
            
            .brand-card {
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 1px solid rgba(192, 192, 192, 0.2);
                border-radius: 16px;
                padding: 20px;
                text-align: center;
                transition: all 0.3s ease;
            }
            
            .brand-card:hover {
                transform: translateY(-5px);
                border-color: var(--silver);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            }
            
            .brand-card a {
                text-decoration: none;
                color: var(--silver-light);
                font-weight: 600;
                font-size: 1.1rem;
                display: block;
            }
            
            .brand-card .brand-count {
                display: block;
                font-size: 0.8rem;
                color: var(--silver-dark);
                margin-top: 8px;
            }
            
            .brand-card.active {
                animation: pulse 0.5s ease;
                border-color: var(--silver);
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(0.98); }
            }
            
            .advantages-section {
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 1px solid rgba(192, 192, 192, 0.1);
            }
            
            .advantages-title, .advantage-title {
                color: var(--silver-light);
            }
            
            .advantage-desc {
                color: var(--silver-dark);
            }
            
            .icon-box {
                background: rgba(192, 192, 192, 0.1);
                color: var(--silver);
            }
            
            .footer {
                background: #0f0f1a;
            }
            
            @media (max-width: 700px) {
                .drawer-services {
                    grid-template-columns: 1fr;
                }
                .drawer-content {
                    padding: 12px 16px 20px;
                }
                .drawer-contact {
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }
                .custom-notification {
                    left: 20px;
                    right: 20px;
                    min-width: auto;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

function updateDrawerContent(brandName) {
    document.querySelectorAll('.brand-card').forEach(card => {
        card.classList.remove('active');
        const link = card.querySelector('a');
        if (link && link.textContent.includes(brandName)) {
            card.classList.add('active');
            setTimeout(() => card.classList.remove('active'), 500);
        }
    });
}

function addDrawerHoverHandlers() {
    const cards = document.querySelectorAll('.brand-card');
    const drawer = document.getElementById('bottomDrawer');
    
    if (!drawer) return;
    
    let hoverTimeout;
    
    cards.forEach(card => {
        const link = card.querySelector('a');
        const brandName = link.childNodes[0].nodeValue.trim();
        
        card.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            updateDrawerContent(brandName);
            drawer.classList.add('open');
        });
        
        card.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                drawer.classList.remove('open');
            }, 300);
        });
    });
    
    drawer.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        drawer.classList.add('open');
    });
    
    drawer.addEventListener('mouseleave', () => {
        drawer.classList.remove('open');
    });
}

function addDrawerButtonsHandlers() {
    const tradeinBtn = document.querySelector('.tradein-btn');
    if (tradeinBtn) {
        tradeinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPhoneModal('Trade-In программа');
        });
    }
    
    const evaluateBtn = document.querySelector('.evaluate-btn');
    if (evaluateBtn) {
        evaluateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPhoneModal('Экспертная оценка авто');
        });
    }
    
    const callbackBtn = document.querySelector('.callback-btn');
    if (callbackBtn) {
        callbackBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPhoneModal('Запрос звонка');
        });
    }
    
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const service = card.dataset.service;
            if (service === 'tradein') {
                showPhoneModal('Trade-In программа');
            } else if (service === 'evaluate') {
                showPhoneModal('Экспертная оценка авто');
            } else if (service === 'callback') {
                showPhoneModal('Запрос звонка');
            }
        });
    });
}

function initBottomDrawer() {
    addDrawerStyles();
    createBottomDrawer();
    addDrawerHoverHandlers();
    addDrawerButtonsHandlers();
    
    const handle = document.querySelector('.drawer-handle');
    const drawer = document.getElementById('bottomDrawer');
    if (handle && drawer) {
        handle.addEventListener('click', () => {
            drawer.classList.toggle('open');
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderBrands();
    initBottomDrawer();
});