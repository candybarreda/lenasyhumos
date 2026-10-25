
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

async function openAppWithCart(page, cart = [testProduct]) {
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

async function openCustomerForm(page) {
  await openCart(page);

  await page.getByRole("button", {
    name: "Continuar con mis datos",
  }).click();
}

async function fillDeliveryData(page) {
  await page.getByLabel("Nombre completo").fill("Cliente Sistema QA");
  await page.getByLabel(/Tel.fono de contacto/).fill("999888777");
  await page.getByLabel("Dirección de entrega").fill("Dirección de prueba 123");
}

test("ST-01: disminuye la cantidad y actualiza el total", async ({ page }) => {
  await openAppWithCart(page, [{ ...testProduct, quantity: 2 }]);
  await openCart(page);

  await page.getByRole("button", {
    name: "Restar Pollo al cilindro QA",
  }).click();

  await expect(page.getByText("Subtotal: S/ 25.00")).toBeVisible();
 await expect(
  page.getByRole("heading", { name: "S/ 25.00" })
).toBeVisible();
});

test("ST-02: elimina un producto del carrito", async ({ page }) => {
  await openAppWithCart(page);
  await openCart(page);

  await page.getByRole("button", {
    name: "Eliminar Pollo al cilindro QA",
  }).click();

  await expect(page.getByText("Tu carrito está vacío")).toBeVisible();
});

test("ST-03: vacía el carrito completo", async ({ page }) => {
  await openAppWithCart(page, [
    testProduct,
    { ...testProduct, id: "qa-chifa", name: "Chifa QA", price: 30 },
  ]);
  await openCart(page);

  await page.getByRole("button", { name: "Vaciar carrito" }).click();

  await expect(page.getByText("Tu carrito está vacío")).toBeVisible();
});

test("ST-04: permite elegir recojo en local", async ({ page }) => {
  await openAppWithCart(page);
  await openCustomerForm(page);

  await page.getByLabel("Nombre completo").fill("Cliente Sistema QA");
  await page.getByLabel(/Tel.fono de contacto/).fill("999888777");
  await page.getByLabel("Recojo en local").check();

  await expect(page.getByLabel("Dirección de entrega")).toHaveCount(0);

  await page.getByRole("button", { name: /Revisar mi pedido/ }).click();

  await expect(
    page.getByRole("heading", { name: "Confirmar pedido" })
  ).toBeVisible();

  await expect(page.getByText("Recojo en local")).toBeVisible();
});

test("ST-05: permite seleccionar Yape, Plin y efectivo", async ({ page }) => {
  await openAppWithCart(page);
  await openCustomerForm(page);

  await page.getByLabel("Yape").check();
  await expect(page.getByLabel("Yape")).toBeChecked();

  await page.getByLabel("Plin").check();
  await expect(page.getByLabel("Plin")).toBeChecked();

  await page.getByLabel("Efectivo").check();
  await expect(page.getByLabel("Efectivo")).toBeChecked();

  await expect(
    page.getByLabel("¿Con cuánto pagarás? (opcional)")
  ).toBeVisible();
});

test("ST-06: rechaza un teléfono con menos de siete dígitos", async ({ page }) => {
  await openAppWithCart(page);
  await openCustomerForm(page);

  await page.getByLabel("Nombre completo").fill("Cliente Sistema QA");
  await page.getByLabel(/Tel.fono de contacto/).fill("123456");
  await page.getByLabel("Dirección de entrega").fill("Dirección de prueba 123");

  await page.getByRole("button", { name: /Revisar mi pedido/ }).click();

  await expect(page.getByText("Revisa el número de teléfono.")).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Confirmar pedido" })
  ).toHaveCount(0);
});

test("ST-07: permite volver y corregir los datos del pedido", async ({ page }) => {
  await openAppWithCart(page);
  await openCustomerForm(page);
  await fillDeliveryData(page);

  await page.getByRole("button", { name: /Revisar mi pedido/ }).click();

  await expect(
    page.getByRole("heading", { name: "Confirmar pedido" })
  ).toBeVisible();

  await page.getByRole("button", {
    name: "Volver y corregir datos",
  }).click();

  await expect(page.getByLabel("Nombre completo")).toHaveValue(
    "Cliente Sistema QA"
  );

  await page.getByLabel("Nombre completo").fill("Cliente Corregido QA");

  await page.getByRole("button", { name: /Revisar mi pedido/ }).click();

  await expect(page.getByText("Cliente Corregido QA")).toBeVisible();
});

test("ST-08: muestra los datos e importes correctos en la confirmación", async ({ page }) => {
  await openAppWithCart(page, [{ ...testProduct, quantity: 2 }]);
  await openCustomerForm(page);
  await fillDeliveryData(page);

  await page.getByLabel("Referencia (opcional)").fill("Puerta azul");
  await page.getByLabel("Plin").check();

  await page.getByRole("button", { name: /Revisar mi pedido/ }).click();

  await expect(
    page.getByRole("heading", { name: "Confirmar pedido" })
  ).toBeVisible();

  await expect(page.getByText("Cliente Sistema QA")).toBeVisible();
  await expect(page.getByText("999888777")).toBeVisible();
  await expect(page.getByText("Dirección de prueba 123")).toBeVisible();
  await expect(page.getByText("Referencia: Puerta azul")).toBeVisible();
  await expect(page.getByText("2 × Pollo al cilindro QA")).toBeVisible();
  await expect(page.getByText("Plin", { exact: true })).toBeVisible();
  await expect(
  page.getByRole("heading", { name: "S/ 50.00" })
).toBeVisible();
});
