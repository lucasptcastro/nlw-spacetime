import axios from "axios";

// define a base da url para requisições com o back.
// sendo assim, não precisa ficar colocando localhost
// nas requicisões, basta passar a rota
export const api = axios.create({
  baseURL: "http://localhost:3333",
});
