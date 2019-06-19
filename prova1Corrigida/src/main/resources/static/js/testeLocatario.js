function randLocal() {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return (Math.floor(Math.random() * (99 - 10)) + 10) +
        letras[Math.floor(Math.random() * letras.length)];

}

async function teste(pronto) {
    let vaga = new TestController("api/vagas/");

    let id = 0;
    await vaga.testar(
        {
            metodo: "POST",
            conteudo: {
                "andar": 8,
                "local": randLocal()
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 201, "Status HTTP", "Cadastrar api/vagas/", 0.1);
            verificar(resposta.conteudo.andar == resposta.retorno.andar && resposta.conteudo.local == resposta.retorno.local,
                "Campos cadastrados", "Cadastrar api/vagas/", 0.1);
            fechar();
            id = resposta.retorno.id;

        });


    await vaga.testar({ metodo: "GET" },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 200 && Array.isArray(resposta.retorno), "Listar", "Listar api/vagas/", 0.2);
            fechar();
        });

    let respostaPut = null;
    await vaga.testar(
        {
            metodo: "PUT",
            param: id,
            conteudo: {
                "andar": 9,
                "local": randLocal()
            }

        },
        (resposta) => {
            respostaPut = resposta;
        });


    await vaga.testar({ metodo: "GET", param: id },
        (resposta2) => {
            exibir(respostaPut);
            exibir(resposta2);
            verificar(respostaPut.status == 204, "Status HTTP", "Atualizar api/vagas/", 0.1);
            verificar(respostaPut.conteudo.andar == resposta2.retorno.andar
                && respostaPut.conteudo.local == resposta2.retorno.local,
                "Valores não atualizados", "Atualizar api/vagas/", 0.1);
            fechar();
        });





    await vaga.testar({ metodo: "GET", param: id },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 200, "Recuperar item cadastrado", "Recuperar api/vagas/", 0.2);
            fechar();
        });



    await vaga.testar(
        {
            metodo: "DELETE",
            param: id
        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 204, "Apagar conteúdo", "Apagar api/vagas/", 0.1);
            fechar();
        });


    await vaga.testar(
        {
            metodo: "POST",
            conteudo: {
                "andar": 5,
                "local": randLocal()
            }

        },
        (resposta) => {
            id = resposta.retorno.id;
        });


    await vaga.testar(
        {
            metodo: "POST",
            conteudo: {
                "andar": 5,
                "local": null
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Cadastrar Vaga - Todos os campos obrigatórios",
                "Vaga - Todos os campos obrigatórios", 0.2);
            fechar();
        });


    await vaga.testar(
        {
            metodo: "POST",
            conteudo: {
                "andar": -1,
                "local": "41A"
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Cadastrar Andar negativo", "Vaga - Andar deve ser um valor entre 1 e 10", 0.1);
            fechar();
        });


    await vaga.testar(
        {
            metodo: "POST",
            conteudo: {
                "andar": 100,
                "local": "41A"
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Cadastrar Andar maior que 10", "Vaga - Andar deve ser um valor entre 1 e 10", 0.1);
            fechar();
        });

    await vaga.testar(
        {
            metodo: "POST",
            conteudo: {
                "andar": "5",
                "local": "4A2asc2"
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Cadastrar Local errado", "Vaga - Local deve ser formado por 2 caracteres numéricos e uma letra (ex: 41A, 32B)", 0.2);
            fechar();
        });

    await vaga.testar(
        {
            metodo: "PUT",
            param: id,
            conteudo: {
                "andar": 3,
                "local": null
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Atualizar Vaga - Todos os campos obrigatórios",
                "Vaga - Todos os campos obrigatórios", 0.2);
            fechar();
        });

    await vaga.testar(
        {
            metodo: "PUT",
            param: id,
            conteudo: {
                "andar": -1,
                "local": "42A"
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Atualizar Andar negativo", "Vaga - Andar deve ser um valor entre 1 e 10", 0.1);
            fechar();
        });


    await vaga.testar(
        {
            metodo: "PUT",
            param: id,
            conteudo: {
                "andar": 100,
                "local": "42A"
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Atualizar Andar maior que 10", "Vaga - Andar deve ser um valor entre 1 e 10", 0.1);
            fechar();
        });


    await vaga.testar(
        {
            metodo: "PUT",
            param: id,
            conteudo: {
                "andar": "15",
                "local": "422aA"
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Atualizar Local errado", "Vaga - Local deve ser formado por 2 caracteres numéricos e uma letra (ex: 41A, 32B)", 0.2);
            fechar();
        });

    let local = randLocal();
    await vaga.testar(
        {
            metodo: "POST",
            conteudo: {
                "andar": 4,
                "local": local
            }

        },
        (resposta) => {
            exibir(resposta);
        });

    await vaga.testar(
        {
            metodo: "POST",
            conteudo: {
                "andar": 4,
                "local": local
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Cadastrar Vaga - Não pode ser cadastrado mais de uma vaga com o mesmo local e andar",
                "Vaga - Não pode ser cadastrado mais de uma vaga com o mesmo local e andar", 0.4);
            fechar();
        });




    await vaga.testar(
        {
            metodo: "DELETE",
            param: 999999
        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 404, "Apagar conteúdo inexistente", "Apagar api/vagas/", 0.1);
            fechar();
        });


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let locatario = new TestController("api/locatarios/");
    await locatario.testar({ metodo: "GET" },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 200 && Array.isArray(resposta.retorno), "Listar", "Listar api/locatarios/", 0.2);
            fechar();
        });
    id = 0;
    await locatario.testar(
        {
            metodo: "POST",
            conteudo: {
                "nome": "Exemplo",
                "cpf": "12345678901"
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 201, "Status HTTP", "Cadastrar api/locatarios/", 0.1);
            verificar(resposta.conteudo.nome == resposta.retorno.nome && resposta.conteudo.cpf == resposta.retorno.cpf,
                "Campos cadastrados", "Cadastrar api/locatarios/", 0.1);
            fechar();
            id = resposta.retorno.id;

        });




    await locatario.testar({ metodo: "GET", param: id },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 200, "Recuperar item cadastrado", "Recuperar api/locatarios/", 0.2);
            fechar();
        });


    await locatario.testar(
        {
            metodo: "PUT",
            param: id,
            conteudo: {
                "nome": "Exemplo Mudado",
                "cpf": "10987654321"
            }

        },
        (resposta) => {
            respostaPut = resposta;
        });

    await locatario.testar({ metodo: "GET", param: id },
        (resposta2) => {
            exibir(respostaPut);
            exibir(resposta2);
            verificar(respostaPut.status == 204, "Status HTTP", "Atualizar api/locatarios/", 0.1);
            verificar(respostaPut.conteudo.nome == resposta2.retorno.nome
                && respostaPut.conteudo.cpf == resposta2.retorno.cpf,
                "Valores não atualizados", "Atualizar api/locatarios/", 0.1);
            fechar();
        });


    await locatario.testar(
        {
            metodo: "DELETE",
            param: 999999
        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 404, "Apagar conteúdo inexistente", "Apagar api/locatarios/", 0.1);
            fechar();
        });

    await locatario.testar(
        {
            metodo: "DELETE",
            param: id
        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 204, "Apagar conteúdo", "Apagar api/locatarios/", 0.1);
            fechar();
        });

    await locatario.testar(
        {
            metodo: "POST",
            conteudo: {
                "nome": "Exemplo 2",
                "cpf": "12345678901"
            }

        },
        (resposta) => {
            id = resposta.retorno.id;
        });


    await locatario.testar(
        {
            metodo: "POST",
            conteudo: {
                "nome": "Exemplo 2",
                "cpf": null
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Cadastrar Locatario - Todos os campos obrigatórios",
                "Locatario - Todos os campos obrigatórios", 0.2);
            fechar();
        });


    await locatario.testar(
        {
            metodo: "POST",
            conteudo: {
                "nome": "Carlos",
                "cpf": "12"
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Cadastrar CPF menos de 11 caracteres", "Locatario - CPF deve ter 11 caracteres", 0.1);
            fechar();
        });


    await locatario.testar(
        {
            metodo: "POST",
            conteudo: {
                "nome": "Carlos",
                "cpf": "45345454353454545456"
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Cadastrar CPF mais de 11 caracteres", "Locatario - CPF deve ter 11 caracteres", 0.1);
            fechar();
        });



    await locatario.testar(
        {
            metodo: "PUT",
            param: id,
            conteudo: {
                "nome": 10,
                "cpf": null
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Atualizar Locatario - Todos os campos obrigatórios",
                "Locatario - Todos os campos obrigatórios", 0.2);
            fechar();
        });

    await locatario.testar(
        {
            metodo: "PUT",
            param: id,
            conteudo: {
                "nome": "Rafael",
                "cpf": "412"
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Atualizar CPF menos de 11 caracteres", "Locatario - CPF deve ter 11 caracteres", 0.1);
            fechar();
        });


    await locatario.testar(
        {
            metodo: "PUT",
            param: id,
            conteudo: {
                "nome": "Carlos",
                "cpf": "5454353454354"
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Atualizar CPF mais de 11 caracteres", "Locatario - CPF deve ter 11 caracteres", 0.1);
            fechar();
        });



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    id = 0;
    await locatario.testar(
        {
            metodo: "POST",
            conteudo: {
                "nome": "Teste pagamentos",
                "cpf": "12345678901"
            }

        },
        (resposta) => {
            id = resposta.retorno.id;
        });

    let idPagamento = 0;
    let pagamento = new TestController(`api/locatarios/${id}/pagamentos/`);
    await pagamento.testar(
        {
            metodo: "POST",
            conteudo: {
                forma: "cheque",
                data: "2018-01-01",
                valor: 3
            }

        },
        (resposta) => {
            idPagamento = resposta.retorno.id;
            exibir(resposta);
            verificar(resposta.status == 201, "Status HTTP", "Cadastrar api/locatarios/${id}/pagamentos/", 0.1);
            verificar(resposta.conteudo.forma == resposta.retorno.forma
                && resposta.conteudo.pagamento == resposta.retorno.pagamento,
                "Campos cadastrados", "Cadastrar api/locatarios/${id}/pagamentos/", 0.3);
            fechar();
        });

    await pagamento.testar({ metodo: "GET" },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 200 && Array.isArray(resposta.retorno), "Listar", "Listar api/locatarios/${id}/pagamentos/", 0.4);
            fechar();
        });

    await pagamento.testar(
        {
            metodo: "DELETE",
            param: idPagamento
        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 204, "Apagar conteúdo", "Apagar  api/locatarios/${id}/pagamentos/", 0.2);
            fechar();
        });


    await pagamento.testar(
        {
            metodo: "POST",
            conteudo: {
                forma: "cheque",
                data: "2018-02-01",
                valor: 3
            }

        },
        (resposta) => {
            idPagamento = resposta.retorno.id;
        });


    await pagamento.testar(
        {
            metodo: "POST",
            conteudo: {
                forma: "cheque"
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Cadastrar Pagamento - Todos os campos obrigatórios",
                "Pagamento - Todos os campos obrigatórios", 0.4);
            fechar();
        });


    await pagamento.testar(
        {
            metodo: "POST",
            conteudo: {
                forma: "cheque",
                data: "2018-03-01",
                valor: -1
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Cadastrar Pagamento - Pagamento deve ser maior que 0",
                "Pagamento - Pagamento deve ser maior que 0", 0.4);
            fechar();
        });

    await pagamento.testar(
        {
            metodo: "POST",
            conteudo: {
                forma: "casa",
                data: "2018-04-01",
                valor: 1
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Cadastrar Pagamento - Forma só pode aceitar os valores 'prova', 'trabalho', 'teste' e 'seminário'",
                "Pagamento - Forma só pode aceitar os valores 'prova', 'trabalho', 'teste' e 'seminário'", 0.4);
            fechar();
        });

    await pagamento.testar(
        {
            metodo: "POST",
            conteudo: {
                forma: "cheque",
                data: "2018-02-01",
                valor: 9
            }

        },
        (resposta) => {
            exibir(resposta);
            verificar(resposta.status == 400, "Cadastrar Pagamento - Não pode ter mais de um pagamento para o mesmo mês e ano",
                "Pagamento - Não pode ter mais de um pagamento para o mesmo mês e ano", 0.4);
            fechar();
        });


    pronto();
}
