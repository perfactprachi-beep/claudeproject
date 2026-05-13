import sgMail from '@sendgrid/mail'
import { env } from '../config/env'
import { logger } from '../utils/logger'

sgMail.setApiKey(env.SENDGRID_API_KEY)

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(opts: EmailOptions): Promise<void> {
  try {
    await sgMail.send({
      to: opts.to,
      from: { email: env.SENDGRID_FROM_EMAIL, name: env.SENDGRID_FROM_NAME },
      subject: opts.subject,
      html: opts.html,
      text: opts.text ?? opts.subject,
    })
  } catch (err) {
    logger.error('SendGrid error', { err, to: opts.to })
  }
}

export async function sendOrderConfirmation(email: string, orderId: string, total: number): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Order Confirmed — #${orderId}`,
    html: `<h2>Thank you for your order!</h2><p>Your order <strong>#${orderId}</strong> worth <strong>₹${total.toLocaleString('en-IN')}</strong> has been confirmed.</p><p>We'll notify you once it's shipped.</p>`,
  })
}

export async function sendShippingNotification(email: string, orderId: string, trackingNumber: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Your order #${orderId} has been shipped`,
    html: `<h2>Your order is on its way!</h2><p>Tracking number: <strong>${trackingNumber}</strong></p>`,
  })
}

export async function sendLowStockAlert(catalogueEmail: string, lowStockItems: { sku: string; product: string; stock: number }[]): Promise<void> {
  const rows = lowStockItems.map(i => `<tr><td>${i.sku}</td><td>${i.product}</td><td>${i.stock}</td></tr>`).join('')
  await sendEmail({
    to: catalogueEmail,
    subject: 'Low Stock Alert — Shoppers Stop',
    html: `<h2>Low Stock Alert</h2><table border="1"><tr><th>SKU</th><th>Product</th><th>Stock</th></tr>${rows}</table>`,
  })
}

export async function sendWeeklyRevenueDigest(adminEmail: string, revenue: number, orders: number): Promise<void> {
  await sendEmail({
    to: adminEmail,
    subject: `Weekly Revenue Digest — ₹${revenue.toLocaleString('en-IN')}`,
    html: `<h2>Weekly Summary</h2><p>Revenue: <strong>₹${revenue.toLocaleString('en-IN')}</strong></p><p>Orders: <strong>${orders}</strong></p>`,
  })
}
