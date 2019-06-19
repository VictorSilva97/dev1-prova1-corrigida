/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.edu.ifrs.restinga.dev1.victor.prova1.controller;

import br.edu.ifrs.restinga.dev1.victor.prova1.erro.NaoEncontradoException;
import br.edu.ifrs.restinga.dev1.victor.prova1.erro.RequisicaoInvalidaException;
import br.edu.ifrs.restinga.dev1.victor.prova1.modelo.dao.IVagaDAO;
import br.edu.ifrs.restinga.dev1.victor.prova1.modelo.entidade.Vaga;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Victor
 */
@RestController
@RequestMapping("/api/")
public class Vagas {
    
    @Autowired
    IVagaDAO vagaDAO;
    
    @RequestMapping(path="/vagas/", method=RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public Vaga inserir(@RequestBody Vaga vaga){
        try{
            if(ehVagaValida(vaga)){                
               return vagaDAO.save(vaga);
            }
        }catch(Exception e){
            throw e;
        }
        return null;
    } 
    
    @RequestMapping(path="/vagas/pesquisar/andar/{andar}", method=RequestMethod.GET)
    public Iterable<Vaga> pesquisaPorAndar(@PathVariable int andar){
        return vagaDAO.findByAndar(andar);
    } 
    
    @RequestMapping(path="/vagas", method=RequestMethod.GET)
    public Iterable<Vaga> pesquisar(){
        return vagaDAO.findAll();
    }
    
    @RequestMapping(path="/vagas/{idVaga}", method=RequestMethod.PUT)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Vaga atualizar(@PathVariable int idVaga, @RequestBody Vaga vagaAtualizada){
        Vaga vaga = this.recuperar(idVaga);
        
        try{
            if(ehVagaValida(vagaAtualizada)){
                vaga.setAndar(vagaAtualizada.getAndar());
                vaga.setLocal(vagaAtualizada.getLocal());
                return vagaDAO.save(vaga);
            }                                           
        }catch(Exception e){
            throw e;
        }
        return null;   
    }
    
    @RequestMapping(path="/vagas/{id}", method=RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Vaga recuperar(@PathVariable int id){
        final Optional<Vaga> vaga = vagaDAO.findById(id);
        if(vaga.isPresent())
            return vaga.get();
        else 
            throw new NaoEncontradoException("ID não encontrado.");
    }
    
    @RequestMapping(path="/vagas/{id}", method=RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void apagar(@PathVariable int id){
        if(vagaDAO.existsById(id))
            vagaDAO.deleteById(id);
        else
            throw new NaoEncontradoException("ID não encontrado");        
    } 
    
    private boolean ehVagaValida(Vaga vaga) {
        if(ehNuloOuVazio(vaga.getLocal()))
            throw new RequisicaoInvalidaException("O campo local é obrigatório");
        
        if(ehLocalInvalido(vaga.getLocal()))
            throw new RequisicaoInvalidaException("Local deve ser formado por 2 caracteres numéricos e uma letra.");
        
        if(ehNuloOuVazio(String.valueOf(vaga.getAndar())))
            throw new RequisicaoInvalidaException("O campo local é obrigatório");
        
        if(vaga.getAndar() < 1 || vaga.getAndar() > 10)
            throw new RequisicaoInvalidaException("Andar deve ser um valor entre 1 e 10");

        if(existeVagaComEsseLocalEandar(vaga))
            throw new RequisicaoInvalidaException("Não pode ser cadastrado mais de uma vaga com o mesmo local e andar");
                
        return true;        
    }
    
    private boolean ehLocalInvalido(String local){        
        return !local.matches("\\d{2}[A-Z]");
    }
    
    private boolean existeVagaComEsseLocalEandar(Vaga vaga){
        List<Vaga> vagas = vagaDAO.findByLocalAndAndar(vaga.getLocal(), vaga.getAndar());
        
        if(vagas.size() > 0)
            return true;        
        return false;
    }
    
    private boolean ehNuloOuVazio(String valor) {
        if(valor == null)
            return true;
        if(valor.isEmpty())
            return true;
        
        return false;
    }

}
