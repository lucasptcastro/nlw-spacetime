"use client";
// "use client" -> serve para habilitar o javascript deste component no navegador
import { ChangeEvent, useState } from "react";

export function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null);

  // funcao que recebe um evento do input e verifica se há um file no event.target
  // se não existir, não continua. se existir, cria uma url contendo a primeira posicao
  // do objeto "files" e seta a url no preview state
  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    if (!files) {
      return;
    }

    const previewURL = URL.createObjectURL(files[0]);

    setPreview(previewURL);
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        type="file"
        id="media"
        accept="image/*"
        className="invisible h-0 w-0"
        name="coverUrl"
      />

      {/* && -> é tipo um ? : só que sem precisar do : */}
      {preview && (
        // "eslint-disable-next-line" -> desabilita o eslint na próxima linha
        // eslint-disable-next-line
        <img
          src={preview}
          alt=""
          className="oject-cover aspect-video w-full rounded-lg"
        />
      )}
    </>
  );
}
