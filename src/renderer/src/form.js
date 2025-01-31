const form = document.getElementById('form')

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const partner = {
    type: event.target.type.value,
    name: event.target.name.value,
    ceo: event.target.ceo.value,
    email: event.target.email.value,
    phone: event.target.phone.value,
    address: event.target.address.value,
    rating: event.target.rating.value
  }
  await window.electronAPI.createPartner(partner)
  form.reset()
})
