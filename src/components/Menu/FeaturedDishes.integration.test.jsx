
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";

const { getDishesMock } = vi.hoisted(() => ({
  getDishesMock: vi.fn(),
}));

vi.mock("../../services/dishService", () => ({
  getDishes: getDishesMock,
}));

vi.mock("./DishCard", () => ({
  default: ({ dish }) => <div>{dish.name}</div>,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

import FeaturedDishes from "./FeaturedDishes";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Integración: FeaturedDishes + dishService", () => {
  it("muestra los platos recibidos del servicio", async () => {
    getDishesMock.mockResolvedValue([
      {
        id: "qa-pollo",
        name: "Pollo QA",
        price: 25,
        description: "Plato de prueba",
        rating: 5,
        reviews: 1,
        image: "",
      },
      {
        id: "qa-chifa",
        name: "Chifa QA",
        price: 30,
        description: "Otro plato de prueba",
        rating: 4,
        reviews: 2,
        image: "",
      },
    ]);

    render(<FeaturedDishes />);

    expect(await screen.findByText("Pollo QA")).toBeTruthy();
    expect(await screen.findByText("Chifa QA")).toBeTruthy();

    expect(getDishesMock).toHaveBeenCalledTimes(1);
  });

  
  it("maneja un error cuando falla la carga de platos", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    getDishesMock.mockRejectedValueOnce(
      new Error("Error simulado de Firebase")
    );

    render(<FeaturedDishes />);

    await waitFor(() => {
      expect(getDishesMock).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error obteniendo platos:",
        expect.any(Error)
      );
    });

    consoleError.mockRestore();
  });

  it("acepta una respuesta vacía del servicio", async () => {
    getDishesMock.mockResolvedValueOnce([]);

    render(<FeaturedDishes />);

    await waitFor(() => {
      expect(getDishesMock).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByText("Pollo QA")).toBeNull();
    expect(screen.queryByText("Chifa QA")).toBeNull();
  });

});
