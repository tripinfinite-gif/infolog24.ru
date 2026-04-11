interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientCompany?: string;
  clientInn?: string;
  items: { description: string; quantity: number; price: number }[];
  total: number;
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate an HTML invoice (Russian format).
 */
export function generateInvoiceHtml(data: InvoiceData): string {
  const itemsRows = data.items
    .map(
      (item, i) => `
      <tr>
        <td style="border:1px solid #333;padding:6px 10px;text-align:center;">${i + 1}</td>
        <td style="border:1px solid #333;padding:6px 10px;">${escapeHtml(item.description)}</td>
        <td style="border:1px solid #333;padding:6px 10px;text-align:center;">${item.quantity}</td>
        <td style="border:1px solid #333;padding:6px 10px;text-align:right;">${formatMoney(item.price)}</td>
        <td style="border:1px solid #333;padding:6px 10px;text-align:right;">${formatMoney(item.price * item.quantity)}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Счёт ${escapeHtml(data.invoiceNumber)}</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 14px; color: #333; margin: 0; padding: 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { font-size: 20px; margin: 0 0 5px; }
    .header p { margin: 2px 0; color: #555; font-size: 12px; }
    .title { font-size: 18px; font-weight: bold; text-align: center; margin: 30px 0 20px; border-top: 2px solid #333; border-bottom: 2px solid #333; padding: 10px 0; }
    .info { margin-bottom: 20px; }
    .info table { width: 100%; border-collapse: collapse; }
    .info td { padding: 3px 0; vertical-align: top; }
    .info .label { font-weight: bold; width: 180px; }
    .items { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items th { border: 1px solid #333; padding: 8px 10px; background: #f5f5f5; font-size: 13px; }
    .total { text-align: right; font-size: 16px; font-weight: bold; margin: 10px 0 30px; }
    .footer { margin-top: 60px; }
    .signature-line { border-bottom: 1px solid #333; width: 200px; display: inline-block; margin: 0 10px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>ООО &laquo;Инфологистик 24&raquo;</h1>
    <p>109044, г. Москва, 2-й Крутицкий пер., д. 18, стр. 1, помещ. 2/1</p>
    <p>ИНН 9701049890 / КПП 772301001 / ОГРН 1167746879486</p>
    <p>infolog24.ru | info@infolog24.ru | +7 (499) 110-55-49</p>
  </div>

  <div class="title">
    Счёт на оплату № ${escapeHtml(data.invoiceNumber)} от ${escapeHtml(data.date)}
  </div>

  <div class="info">
    <table>
      <tr>
        <td class="label">Исполнитель:</td>
        <td>ООО &laquo;Инфологистик 24&raquo;, ИНН 9701049890, КПП 772301001</td>
      </tr>
      <tr>
        <td class="label">Заказчик:</td>
        <td>
          ${data.clientCompany ? escapeHtml(data.clientCompany) : escapeHtml(data.clientName)}
          ${data.clientInn ? ` (ИНН: ${escapeHtml(data.clientInn)})` : ""}
        </td>
      </tr>
    </table>
  </div>

  <table class="items">
    <thead>
      <tr>
        <th style="width:40px;">№</th>
        <th>Наименование</th>
        <th style="width:60px;">Кол-во</th>
        <th style="width:120px;">Цена</th>
        <th style="width:120px;">Сумма</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>

  <div class="total">
    Итого к оплате: ${formatMoney(data.total)}
  </div>

  <p style="font-size:12px;color:#555;">
    НДС не облагается (УСН).
  </p>

  <div class="footer">
    <p>Руководитель: <span class="signature-line">&nbsp;</span> / <span class="signature-line">&nbsp;</span></p>
    <p style="margin-top:20px;">М.П.</p>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
