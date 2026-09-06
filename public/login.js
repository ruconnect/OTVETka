const users = [
  { 
    fullName: 'Романова Екатерина Романовна', 
    token: 'velyminovo2026', 
    redirectPage: 'index.html' 
  },
  { 
    fullName: 'Киреев Никита Демидович', 
    token: 'velyminovo2026', 
    redirectPage: 'new.html' 
  }
];

document.getElementById('registrationForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const token = document.getElementById('token').value.trim();

  // Находим пользователя по ФИО и токену
  const matchedUser = users.find(user => user.fullName === fullName && user.token === token);

  if (matchedUser) {
    // Переходим на индивидуальную страницу
    window.location.href = matchedUser.redirectPage;
  } else {
    alert('Неверные данные. Попробуйте снова.');
  }
});