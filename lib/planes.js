// Tarifa fija de publicación, en pesos uruguayos.
// Única fuente de verdad: la API de pago (route.js) nunca debe confiar en un monto
// enviado por el cliente, así que ambos lados importan esta constante.
export const PLAN_MONTO = 447;

// Recargo para pagos con Mercado Pago: compensa la comisión que MP descuenta
// al retirar el dinero, para que el monto neto recibido sea el mismo que
// con transferencia bancaria (Scotiabank/Itaú, sin comisión).
export const RECARGO_MERCADOPAGO = 0.10;
export const PLAN_MONTO_MERCADOPAGO = Math.round(PLAN_MONTO * (1 + RECARGO_MERCADOPAGO));
