  // Если уже есть данные в localStorage — перенаправляем
if (localStorage.getItem('isLoggedIn') ) {
  window.location.href = 'geo-assistant.html'; // основная страница
}

// Настроенные логин/пароль
const validEmail = "a5b4bfe7a087861bd36f51452d11fddb313918dc4c98125b78931bdb7053201c";// хэш от "vidkein75@gmail.com"
const validPasswordHash = "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"; // хэш от "password123"

// Функция хеширования SHA-256
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Логин
async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('pass').value;
  const rememberme = document.getElementById('rememberme');
  
  const hash = await sha256(password);
  const emailSHA = await sha256(email);

  if (emailSHA === validEmail && hash === validPasswordHash) {
    if (rememberme.checked) {
        localStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('email','true');
        window.location.href = 'geo-assistant.html'; // основная страница
    } else {
        sessionStorage.setItem('email','true');
        window.location.href = 'geo-assistant.html'; // основная страница
    }
  } else {
    alert('Неверный логин или пароль');
  }
}