import { NextResponse } from "next/server";
import { z } from "zod";

const checkSchema = z.object({
  query: z
    .string()
    .min(1, "Введите номер заявки или телефон")
    .max(100),
});

const statusLabels: Record<string, string> = {
  draft: "Черновик",
  documents_pending: "Ожидаем документы",
  payment_pending: "Ожидаем оплату",
  processing: "В обработке",
  submitted: "Подана в Дептранс",
  approved: "Одобрена",
  rejected: "Отклонена",
  cancelled: "Отменена",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = checkSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Ошибка валидации",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // TODO: When DB is connected, look up order by ID or phone
    // const { query } = result.data;
    // const order = await ordersDAL.findByIdOrPhone(query);

    // For now, return a helpful message
    return NextResponse.json({
      success: false,
      error:
        "Проверка статуса онлайн временно недоступна. Пожалуйста, свяжитесь с нами по телефону или в мессенджере для уточнения статуса вашей заявки.",
      statusLabels,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Произошла ошибка. Попробуйте позже.",
      },
      { status: 500 },
    );
  }
}
