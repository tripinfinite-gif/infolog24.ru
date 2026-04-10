interface ActData {
  actNumber: string;
  date: string;
  clientName: string;
  clientCompany?: string;
  services: { description: string; amount: number }[];
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
 * Generate an HTML act of completed works (Russian format).
 */
export function generateActHtml(data: ActData): string {
  const servicesRows = data.services
    .map(
      (svc, i) => `
      <tr>
        <td style="border:1px solid #333;padding:6px 10px;text-align:center;">${i + 1}</td>
        <td style="border:1px solid #333;padding:6px 10px;">${escapeHtml(svc.description)}</td>
        <td style="border:1px solid #333;padding:6px 10px;text-align:right;">${formatMoney(svc.amount)}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Акт ${escapeHtml(data.actNumber)}</title>
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
    .signatures { margin-top: 60px; display: flex; justify-content: space-between; }
    .signature-block { width: 45%; }
    .signature-line { border-bottom: 1px solid #333; width: 200px; display: inline-block; margin: 0 10px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>ООО &laquo;Инфологистик-24&raquo;</h1>
    <p>Москва | infolog24.ru | info@infolog24.ru</p>
  </div>

  <div class="title">
    Акт выполненных работ № ${escapeHtml(data.actNumber)} от ${escapeHtml(data.date)}
  </div>

  <div class="info">
    <table>
      <tr>
        <td class="label">Исполнитель:</td>
        <td>ООО &laquo;Инфологистик-24&raquo;</td>
      </tr>
      <tr>
        <td class="label">Заказчик:</td>
        <td>${data.clientCompany ? escapeHtml(data.clientCompany) : escapeHtml(data.clientName)}</td>
      </tr>
    </table>
  </div>

  <p>
    Исполнитель выполнил, а Заказчик принял следующие работы (услуги):
  </p>

  <table class="items">
    <thead>
      <tr>
        <th style="width:40px;">№</th>
        <th>Наименование услуги</th>
        <th style="width:140px;">Сумма</th>
      </tr>
    </thead>
    <tbody>
      ${servicesRows}
    </tbody>
  </table>

  <div class="total">
    Итого: ${formatMoney(data.total)}
  </div>

  <p style="font-size:12px;color:#555;">
    НДС не облагается (УСН).
  </p>

  <p style="margin-top:20px;">
    Вышеперечисленные услуги выполнены полностью и в срок.
    Заказчик претензий по объёму, качеству и срокам оказания услуг не имеет.
  </p>

  <div class="signatures">
    <div class="signature-block">
      <p><strong>Исполнитель:</strong></p>
      <p style="margin-top:30px;"><span class="signature-line">&nbsp;</span></p>
      <p style="font-size:12px;color:#555;">подпись / М.П.</p>
    </div>
    <div class="signature-block">
      <p><strong>Заказчик:</strong></p>
      <p style="margin-top:30px;"><span class="signature-line">&nbsp;</span></p>
      <p style="font-size:12px;color:#555;">подпись / М.П.</p>
    </div>
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
