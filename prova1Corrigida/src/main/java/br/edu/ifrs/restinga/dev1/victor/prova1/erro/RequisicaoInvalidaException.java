/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.edu.ifrs.restinga.dev1.victor.prova1.erro;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 *
 * @author Victor
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class RequisicaoInvalidaException extends RuntimeException{
    public RequisicaoInvalidaException(String mensagem){
        super(mensagem);
    }
}
