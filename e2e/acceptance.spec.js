
import { test, expect } from "@playwright/test";

test.describe("Pruebas de aceptación - Leñas y Humos", () => {
  async function openCart(page) {
    await page.goto("/");

    await page
      .getByRole("button", { name: /agregar al carrito/i })
      .first()
      .click();

    // Abrir el carrito desde el botón real del encabezado.
    // El primer IconButton del encabezado es el carrito en escritorio.
    await page.locator("header button").filter({
      has: page.locator("svg[data-testid='ShoppingCartOutlinedIcon']"),
    }).first().click();

    await expect(
      page.getByText("Mi carrito", { exact: true })
    ).toBeVisible();
  }

  async function openCustomerForm(page) {
    await openCart(page);

    await page
      .getByRole("button", { name: /continuar con mis datos/i })
      .click();

    await expect(
      page.getByLabel("Nombre completo")
    ).toBeVisible();
  }

  async function fillCustomerData(page) {
    await page.getByLabel("Nombre completo").fill("Cliente de prueba");
    await page
      .getByLabel("Teléfono de contacto")
      .fill("987654321");

    await page
      .getByLabel("Dirección de entrega")
      .fill("Av. de prueba 123");
  }

  test("AT-01: el cliente visualiza productos y la opción de agregarlos", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("button", { name: /agregar al carrito/i }).first()
    ).toBeVisible();
  });

  test("AT-02: el cliente puede agregar un producto al carrito", async ({
    page,
  }) => {
    await openCart(page);

    await expect(
      page.getByRole("button", { name: /continuar con mis datos/i })
    ).toBeVisible();
  });

  test("AT-03: el cliente puede revisar su carrito antes de continuar", async ({
    page,
  }) => {
    await openCart(page);

    await expect(
      page.getByRole("button", { name: /vaciar carrito/i })
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: /continuar con mis datos/i })
    ).toBeVisible();
  });

  test("AT-04: el cliente puede ingresar sus datos de entrega", async ({
    page,
  }) => {
    await openCustomerForm(page);

    await expect(page.getByLabel("Nombre completo")).toBeVisible();
    await expect(page.getByLabel("Teléfono de contacto")).toBeVisible();
    await expect(page.getByLabel("Dirección de entrega")).toBeVisible();
    await expect(page.getByLabel("Referencia (opcional)")).toBeVisible();
  });

  test("AT-05: el cliente puede elegir recojo en local sin dirección", async ({
    page,
  }) => {
    await openCustomerForm(page);

    await page.getByLabel("Recojo en local").check();

    await expect(page.getByLabel("Recojo en local")).toBeChecked();
    await expect(page.getByLabel("Dirección de entrega")).toHaveCount(0);
    await expect(page.getByLabel("Referencia (opcional)")).toHaveCount(0);
  });

  test("AT-06: el cliente puede elegir un método de pago", async ({
    page,
  }) => {
    await openCustomerForm(page);

    await expect(page.getByLabel("Yape")).toBeVisible();
    await expect(page.getByLabel("Plin")).toBeVisible();
    await expect(page.getByLabel("Efectivo")).toBeVisible();

    await page.getByLabel("Plin").check();
    await expect(page.getByLabel("Plin")).toBeChecked();

    await page.getByLabel("Efectivo").check();
    await expect(page.getByLabel("Efectivo")).toBeChecked();
    await expect(
      page.getByLabel(/¿con cuánto pagarás\? \(opcional\)/i)
    ).toBeVisible();
  });

  test("AT-07: el cliente puede revisar los datos de su pedido", async ({
    page,
  }) => {
    await openCustomerForm(page);
    await fillCustomerData(page);

    await page
      .getByRole("button", { name: /revisar mi pedido/i })
      .click();

    await expect(
      page.getByText("Confirmar pedido", { exact: true })
    ).toBeVisible();

    await expect(page.getByText("Cliente de prueba")).toBeVisible();
    await expect(page.getByText("987654321")).toBeVisible();
    await expect(page.getByText("Av. de prueba 123")).toBeVisible();
  });

  test("AT-08: el cliente puede llegar a la confirmación para enviar por WhatsApp", async ({
    page,
  }) => {
    await openCustomerForm(page);
    await fillCustomerData(page);

    await page
      .getByRole("button", { name: /revisar mi pedido/i })
      .click();

    await expect(
      page.getByRole("button", { name: /enviar pedido por whatsapp/i })
    ).toBeVisible();
  });
});
