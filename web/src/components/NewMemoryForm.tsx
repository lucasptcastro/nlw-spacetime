"use client";
// "use client" -> serve para habilitar o javascript deste component no navegador

import { Camera } from "lucide-react";
import { MediaPicker } from "./MediaPicker";
import { FormEvent } from "react";
import { api } from "@/lib/api";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";

export function NewMemoryForm() {
  const router = useRouter();

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // o "currentTarget" coleta todos os elementos do form que possuem o "name".
    // diferentemente do "target" que coleta apenas o elemento que for disparado o evento,
    // o "currentTarget" coleta o de todos
    const formData = new FormData(event.currentTarget);

    // coleta o "coverUrl" dos targets do event
    const fileToUpload = formData.get("coverUrl");

    let coverUrl = "";

    // verifica se algum arquivo foi selecionado
    if (fileToUpload) {
      // cria um formData e seta o arquivo para passar o file para o back. pois tem que usar o multipart e não json
      const uploadFormData = new FormData();
      uploadFormData.set("file", fileToUpload);

      // envia o formData com o arquivo para a rota de upload do back
      const uploadResponse = await api.post("/upload", uploadFormData);

      // coleta a url do arquivo que é devolvida pelo back após o upload
      coverUrl = uploadResponse.data.fileUrl;
    }

    // para usar os cookies quando tem o "use client" precisar utilizar o document.cookie
    // daí para retirar o token do cookie dá para usar um regex ou uma biblioteca específica pra isso (js-cookie)
    const token = Cookie.get("token");

    // envia os demais campos que foram preenchidos no form para a rota /memories
    await api.post(
      "/memories",
      {
        coverUrl,
        content: formData.get("content"),
        isPublic: formData.get("isPublic"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // redireciona o usuário para a página raíz quando a função termina
    router.push("/");
  }

  return (
    <form className="flex flex-1 flex-col gap-2" onSubmit={handleCreateMemory}>
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Anexar mídia
        </label>

        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            value="true"
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
          />
          Tornar memória pública
        </label>
      </div>

      <MediaPicker />

      <textarea
        name="content"
        spellCheck="true"
        className="w-full flex-1 resize-none border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, videos e relatos sobre esta experiência que você quer lembrar para sempre."
      />

      <button
        type="submit"
        className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        Salvar
      </button>
    </form>
  );
}
