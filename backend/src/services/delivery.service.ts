import { env } from '../config/env'
import { logger } from '../utils/logger'

interface ShiprocketToken {
  token: string
  expiresAt: number
}

let cachedToken: ShiprocketToken | null = null

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token

  const res = await fetch(`${env.SHIPROCKET_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: env.SHIPROCKET_EMAIL, password: env.SHIPROCKET_PASSWORD }),
  })
  const data = await res.json() as { token: string }
  cachedToken = { token: data.token, expiresAt: Date.now() + 9 * 60 * 60 * 1000 }
  return data.token
}

export async function checkPincodeServiceability(pincode: string): Promise<{
  serviceable: boolean
  cod: boolean
  etaDays: number | null
}> {
  try {
    const token = await getToken()
    const res = await fetch(
      `${env.SHIPROCKET_BASE_URL}/courier/serviceability/?pickup_postcode=400001&delivery_postcode=${pincode}&weight=0.5&cod=0`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    const data = await res.json() as { status: number; data?: { available_courier_companies?: { etd?: string; cod?: number }[] } }
    if (data.status !== 200 || !data.data?.available_courier_companies?.length) {
      return { serviceable: false, cod: false, etaDays: null }
    }
    const first = data.data.available_courier_companies[0]
    const etaDays = first.etd ? parseInt(first.etd, 10) : null
    return { serviceable: true, cod: Boolean(first.cod), etaDays }
  } catch (err) {
    logger.error('Shiprocket serviceability check failed', { err, pincode })
    return { serviceable: true, cod: true, etaDays: 5 }
  }
}

export async function createShipment(orderData: {
  orderId: string
  customerName: string
  mobile: string
  address: string
  city: string
  state: string
  pincode: string
  items: { name: string; sku: string; qty: number; price: number }[]
  total: number
}): Promise<{ shipmentId: string; trackingNumber: string } | null> {
  try {
    const token = await getToken()
    const res = await fetch(`${env.SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: orderData.orderId,
        order_date: new Date().toISOString(),
        pickup_location: 'Primary',
        billing_customer_name: orderData.customerName,
        billing_phone: orderData.mobile,
        billing_address: orderData.address,
        billing_city: orderData.city,
        billing_state: orderData.state,
        billing_pincode: orderData.pincode,
        billing_country: 'India',
        shipping_is_billing: true,
        order_items: orderData.items.map(i => ({
          name: i.name, sku: i.sku, units: i.qty, selling_price: i.price,
        })),
        payment_method: 'Prepaid',
        sub_total: orderData.total,
        length: 20, breadth: 15, height: 10, weight: 0.5,
      }),
    })
    const data = await res.json() as { shipment_id?: string; awb_code?: string }
    if (!data.shipment_id) return null
    return { shipmentId: String(data.shipment_id), trackingNumber: data.awb_code ?? '' }
  } catch (err) {
    logger.error('Shiprocket create shipment failed', { err })
    return null
  }
}
