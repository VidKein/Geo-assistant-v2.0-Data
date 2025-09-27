// Если уже есть данные в localStorage — перенаправляем
if (localStorage.getItem('isLoggedIn') ) {
  window.location.href = 'geo-assistant.html'; // основная страница
}
let funktionalAddEdit = document.querySelector("#buttonSubmit");
funktionalAddEdit.addEventListener("click",login);

// Логин
async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('pass').value;
  const rememberme = document.getElementById('rememberme');

  if (email !== '' && password !== '') {
    try{
      const API_URL = '/loginGeo';
      const response = await fetch(API_URL, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({email, password})
      });
      const data = await response.json();
      if (data.message === true && !data.errorScanBD ) {
        if (rememberme.checked) {
          localStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('email','true');
          window.location.href = 'geo-assistant.html'; // основная страница
          } else {
          sessionStorage.setItem('email','true');
          window.location.href = 'geo-assistant.html'; // основная страница
          }
      }else{
        if(data.errorScanBD == "pass"){
          alert("⚠️ Возможно вы неправильно ввели пароль!!!");
        }else{
          alert("⚠️ Возможно вы неправильно ввели данные!!!");
        }
      }
      
    }catch(err){
      alert("❌ Ошибка соединения с сервером!");
      console.error(err);
    }
    
  } else 
  {alert("Введи данные, поля не заполненные..");}

}