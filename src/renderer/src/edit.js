document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const partnerId = urlParams.get('id')

  const partner = await window.electronAPI.getPartnerById(partnerId)

  document.getElementById('type').value = partner.organization_type
  document.getElementById('name').value = partner.name
  document.getElementById('ceo').value = partner.ceo
  document.getElementById('phone').value = partner.phone
  document.getElementById('rating').value = String(partner.rating)
  document.getElementById('email').value = partner.email
  document.getElementById('address').value = partner.address

  const form = document.getElementById('edit-form')

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const partner = {
      type: event.target.type.value,
      name: event.target.name.value,
      ceo: event.target.ceo.value,
      email: event.target.email.value,
      phone: event.target.phone.value,
      address: event.target.address.value,
      rating: event.target.rating.value,
      id: partnerId
    }
    await window.electronAPI.updatePartner(partner)
  })
})
