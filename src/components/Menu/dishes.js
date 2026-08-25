import chancho from "../../assets/images/chancho.jpg";
import pollo from "../../assets/images/pollo.jpg";
import combinado from "../../assets/images/combinado.jpg";
import cerveza from "../../assets/images/cerveza.jpg";
import cerverzaCramberrry from "../../assets/images/cramberry.jpg"
import inkacola from "../../assets/images/inkacola.jpg"
import cocacola from "../../assets/images/cocacola.jpg"

export const dishes = [
  {
    id: 1,
    name: "Chancho al Cilindro",
    description:
      "Carne de cerdo marinada durante 24 horas y cocinada lentamente al cilindro con ensalada.",
    price: 30.0,
    image: chancho,
    reviews: 130,
    category: "Cilindro",
    rating: 5,
  },
  {
    id: 2,
    name: "Pollo al Cilindro",
    description:
      "Pollo jugoso con el auténtico sabor ahumado acompañado de papas  nativas y ensalada.",
    price: 25.0,
    image: pollo,
    reviews: 126,
    category: "Cilindro",
    rating: 5,
  },
  {
    id: 3,
    name: "Combinado al Cilindro",
    description:
      "Carne de cerdo  y Pollo jugoso con el auténtico sabor ahumado y cocinada al cilindro.",
    price: 50.,
    image: combinado,
    reviews: 126,
    category: "Cilindro",
    rating: 5,
  },
  {
    id: 4,
    name: "Cerveza Dörcher Trigo",
    description:
    "Elaborada en Pozuzo, Oxapampa, que combina granos de trigo malteado con tradición alemana.",
    price: 15.,
    image: cerveza,
    reviews: 16,
    category: "Bebidas",
    rating: 5,
  },
  {
    id: 5,
    name: "Cerveza Dörcher Cramberrry",
    description:
    "Elaborada en Pozuzo, Oxapampa, que combina granos de trigo malteado con tradición alemana.",
    price: 15.0,
    image: cerverzaCramberrry,
    reviews: 20,
    category: "Bebidas",
    rating: 5,
  },
  {
    id: 6,
    name: "Gaseosa Inka Cola",
    description:
      "Gaseosa INCA KOLA Original Botella 600ml.",
    price: 5.0,
    image: inkacola,
    reviews: 10,
    category: "Bebidas",
    rating: 5,
  },
  {
    id: 6,
    name: "Gaseosa Coca Cola",
    description:
      "Gaseosa Coca Cola Original Botella 600ml.",
    price: 5.0,
    image: cocacola,
    reviews: 10,
    category: "Bebidas",
    rating: 5,
  },
];
export default dishes;