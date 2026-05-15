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

export async function sendOrderDelivered(email: string, orderId: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Your order #${orderId} has been delivered!`,
    html: `<h2>Your order has arrived!</h2><p>Order <strong>#${orderId}</strong> was delivered successfully. We hope you love your purchase!</p><p>Share your experience and leave a review on the app.</p>`,
  })
}

export async function sendReturnApproved(email: string, orderId: string, refundAmount: number, timelineDays: number): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Return approved for order #${orderId}`,
    html: `<h2>Your return has been approved</h2><p>Refund of <strong>₹${refundAmount.toLocaleString('en-IN')}</strong> will be credited within <strong>${timelineDays} business days</strong>.</p>`,
  })
}

export async function sendWelcomeEmail(email: string, name: string, fcMemberNumber?: string): Promise<void> {
  const fcPart = fcMemberNumber
    ? `<p>Your First Citizen membership number: <strong>${fcMemberNumber}</strong></p>`
    : ''
  await sendEmail({
    to: email,
    subject: 'Welcome to Shoppers Stop!',
    html: `<h2>Welcome, ${name}!</h2><p>We're thrilled to have you join the Shoppers Stop family. Start shopping India's finest fashion &amp; lifestyle brands today.</p>${fcPart}`,
  })
}

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Your Shoppers Stop OTP',
    html: `<h2>Your One-Time Password</h2><p>Use the OTP below to verify your account. It expires in 10 minutes.</p><h1 style="letter-spacing:8px;font-size:2rem;color:#C0001D;">${otp}</h1><p>Do not share this OTP with anyone.</p>`,
  })
}
