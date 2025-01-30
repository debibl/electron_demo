const info = document.getElementById('info');

document.addEventListener('DOMContentLoaded', async () => {
  const partners = await window.electronAPI.getPartners();

  // info.textContent = JSON.stringify(partners, null, 2); // Преобразуем в строку
  info.innerHTML = partners.map((p) => (
    `<div class="container">
      <p>${p.organization_type} | ${p.name}</p>
      <p>${p.ceo}</p>
      <p>Почта: ${p.email}</p>
      <p>Телефон: ${p.phone}</p>
      <p>Адрес: ${p.address}</p>
      <p>ID: ${p.taxpayer_id}</p>
      <p>Рейтинг: ${p.rating}</p>
      <p>
    </div>`
  )).join('');
});
