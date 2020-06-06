export = ProjectInterfaces;
export as namespace ProjectInterfaces;

declare namespace ProjectInterfaces {
  interface Item {
    id: number,
    image_url: string,
    title: string,
  };

  interface IbgeResponse {
    sigla: string,
    nome: string,
  };

  interface FormData {
    name: string,
    email: string,
    whatsapp: string,
  };
}
