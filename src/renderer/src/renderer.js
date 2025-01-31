const info = document.getElementById('info')

document.addEventListener('DOMContentLoaded', async () => {
  const partners = await window.electronAPI.getPartners()

  // info.textContent = JSON.stringify(partners, null, 2); // Преобразуем в строку
  info.innerHTML = partners
    .map(
      (partner) =>
        `<div class="container" data-id="${partner.id}">
      <p>${partner.organization_type} | ${partner.name}</p>
      <p>${partner.ceo}</p>
      <p>${partner.phone}</p>
      <p>Рейтинг: ${partner.rating}</p>
    </div>`
    )
    .join('')

  const containers = document.querySelectorAll('.container')
  containers.forEach((container) => {
    container.addEventListener('click', () => {
      const partnerId = container.getAttribute('data-id')
      // Переходим на страницу редактирования с ID партнера
      window.location.href = `./edit.html?id=${partnerId}`
    })
  })
})

//
//
// info.innerHTML = partners
// .map(
//   (p) =>
//     `<div class="container">
//   <p>${p.organization_type} | ${p.name}</p>
//   <p>${p.ceo}</p>
//   <p>Почта: ${p.email}</p>
//   <p>Телефон: ${p.phone}</p>
//   <p>Адрес: ${p.address}</p>
//   <p>ID: ${p.taxpayer_id}</p>
//   <p>Рейтинг: ${p.rating}</p>
//   <p>
// </div>`
// )
// .join('')
