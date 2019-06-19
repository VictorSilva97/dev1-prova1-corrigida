/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


class TestController {
    constructor(url) {
        this.url=url;

    }

    testar(envio, callBack) {
        if(!envio.param)
            envio.param="";
        if(!envio.conteudo)
            envio.conteudo={};

            
        return fetch(`${this.url}${envio.param}`,{
            method:envio.metodo,
             headers: new Headers({
                'Content-Type': 'application/json'
               }),
            body:envio.metodo=="GET"?null:JSON.stringify(envio.conteudo)
        }).then((resposta) =>resposta.json().then(
                        (retorno)=>{
                            callBack({...envio, url:`${this.url}${envio.param}`,status:resposta.status,retorno});
                        }
                        ).catch((erro)=>callBack({...envio,erro:erro,url:`${this.url}${envio.param}`,status:resposta.status,retorno:{}}))
        );

    }
 
    
    
}