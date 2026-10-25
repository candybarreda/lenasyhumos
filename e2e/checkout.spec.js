
import { test, expect } from "@playwright/test";

const testProduct = {
  id: "qa-pollo-cilindro",
  name: "Pollo al cilindro QA",
  price: 25,
  quantity: 1,
  description: "Producto de prueba",
  rating: 5,
  reviews: 1,
  image: "",
};

async function openAppWithCart(page, cart = []) {
  await page.addInitScript((initialCart) => {
    localStorage.setItem("cart", JSON.stringify(initialCart));
  }, cart);

  await page.goto("/");
}

async function openCart(page) {
  await page
    .locator("button")
    .filter({
      has: page.locator('[data-testid="ShoppingCartOutlinedIcon"]'),
    })
    .first()
    .click();
}

test("muestra el carrito vacío", async ({ page }) => {
  await openAppWithCart(page);
  await openCart(page);

  await expect(
    page.getByText("Tu carrito está vacío")
  ).toBeVisible();
});

test("permite aumentar la cantidad de un producto", async ({ page }) => {
  await openAppWithCart(page, [testProduct]);
  await openCart(page);

  await page.getByRole("button", {
    name: "Sumar Pollo al cilindro QA",
  }).click();

  await expect(
    page.getByText("S/ 50.00", { exact: true })
  ).toBeVisible();
});

test("impide revisar el pedido si faltan datos obligatorios", async ({ page }) => {
  await openAppWithCart(page, [testProduct]);
  await openCart(page);

  await page.getByRole("button", {
    name: "Continuar con mis datos",
  }).click();

  const name = page.getByLabel("Nombre completo");
  const phone = page.getByLabel(/Tel.fono de contacto/);

  expect(await name.evaluate((el) => el.checkValidity())).toBe(false);
  expect(await phone.evaluate((el) => el.checkValidity())).toBe(false);

  await expect(name).toHaveAttribute("required", "");
  await expect(phone).toHaveAttribute("required", "");

  // El navegador debe considerar inválidos los campos vacíos.
  expect(await name.evaluate((el) => el.checkValidity())).toBe(false);
  expect(await phone.evaluate((el) => el.checkValidity())).toBe(false);

  // Intentar enviar el formulario vacío.
  await page.getByRole("button", {
    name: /Revisar mi pedido/,
  }).click();

  // El formulario debe permanecer visible y no avanzar.
  await expect(name).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Confirmar pedido" })
  ).toHaveCount(0);
});

test("permite revisar un pedido de prueba", async ({ page }) => {
  await openAppWithCart(page, [testProduct]);
  await openCart(page);

  await page.getByRole("button", {
    name: "Continuar con mis datos",
  }).click();

  await page.getByLabel("Nombre completo").fill("Cliente QA");
  await page.getByLabel(/Tel.fono de contacto/).fill("999888777");
  await page.getByLabel("Dirección de entrega").fill(
    "Dirección de prueba 123"
  );

  await page.getByRole("button", {
    name: /Revisar mi pedido/,
  }).click();

  await expect(
    page.getByRole("heading", { name: "Confirmar pedido" })
  ).toBeVisible();

  await expect(page.getByText("Cliente QA")).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Enviar pedido por WhatsApp" })
  ).toBeVisible();
});

test("prepara WhatsApp sin abrir una ventana real", async ({ page }) => {
  await openAppWithCart(page, [testProduct]);

  await page.evaluate(() => {
    window.__qaOpenedUrls = [];

    window.open = (url) => {
      window.__qaOpenedUrls.push(url);
      return null;
    };
  });

  await openCart(page);

  await page.getByRole("button", {
    name: "Continuar con mis datos",
  }).click();

  await page.getByLabel("Nombre completo").fill("Cliente QA");
  await page.getByLabel(/Tel.fono de contacto/).fill("999888777");
  await page.getByLabel("Dirección de entrega").fill(
    "Dirección de prueba 123"
  );

  await page.getByRole("button", {
    name: /Revisar mi pedido/,
  }).click();

  await page.getByRole("button", {
    name: "Enviar pedido por WhatsApp",
  }).click();

  const openedUrls = await page.evaluate(
    () => window.__qaOpenedUrls
  );

  expect(openedUrls).toHaveLength(1);
  expect(openedUrls[0]).toContain("https://wa.me/51936995196");
  expect(openedUrls[0]).toContain("Cliente%20QA");
});
