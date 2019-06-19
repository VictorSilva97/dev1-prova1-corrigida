/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.edu.ifrs.restinga.dev1.victor.prova1.controller;

import br.edu.ifrs.restinga.dev1.victor.prova1.erro.NaoEncontradoException;
import br.edu.ifrs.restinga.dev1.victor.prova1.erro.RequisicaoInvalidaException;
import br.edu.ifrs.restinga.dev1.victor.prova1.modelo.dao.ILocatarioDAO;
import br.edu.ifrs.restinga.dev1.victor.prova1.modelo.dao.IPagamentoDAO;
import br.edu.ifrs.restinga.dev1.victor.prova1.modelo.dao.IVagaDAO;
import br.edu.ifrs.restinga.dev1.victor.prova1.modelo.entidade.Locatario;
import br.edu.ifrs.restinga.dev1.victor.prova1.modelo.entidade.Pagamento;
import br.edu.ifrs.restinga.dev1.victor.prova1.modelo.entidade.Vaga;
import java.util.ArrayList;
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
public class Locatarios {
    
    @Autowired
    ILocatarioDAO locatarioDAO;
    
    @Autowired
    IPagamentoDAO pagamentoDAO;    
    
    @Autowired
    IVagaDAO vagaDAO;

    @RequestMapping(path="/locatarios/pesquisar/nome/{nome}", method=RequestMethod.GET)
    public Iterable<Locatario> pesquisaPorParteDoNome(@PathVariable String nome){
        return locatarioDAO.findByNomeContaining(nome);
    }
    
    @RequestMapping(path="/locatarios/", method=RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public Locatario inserir(@RequestBody Locatario locatario){
        try{
            if(ehLocatarioValido(locatario))        
                return locatarioDAO.save(locatario);
        }catch(Exception e){
            throw e;
        }
        return null;        
    } 
    
    @RequestMapping(path="/locatarios/", method=RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Iterable<Locatario> listar(){
        return locatarioDAO.findAll();
    } 
    
    @RequestMapping(path="/locatarios/pagamentos/{forma}", method=RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public List<Locatario> listarPagamentos(@PathVariable String forma){
        Iterable<Locatario> locatarios = listar();
        List<Locatario> locatariosNaforma = new ArrayList<Locatario>();
        
        for(Locatario locatario : locatarios){            
            
            for(Pagamento pagamento : locatario.getPagamento()){
                if(pagamento.getForma().equals(forma)){
                    locatariosNaforma.add(locatario);
                    break;
                }
            }            
        }
            
        return locatariosNaforma;
    } 
    
    @RequestMapping(path="/locatarios/{idLocatario}/pagamentos", method=RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Iterable<Pagamento> listarPagamentos(@PathVariable int idLocatario){
        Locatario locatario = recuperar(idLocatario);
        
        return locatario.getPagamento();
    }
    
    @RequestMapping(path="/locatarios/{idLocatario}/pagamentos", method=RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void apagarPagamento(@PathVariable int idLocatario){
        Locatario locatario = recuperar(idLocatario);
        
        locatario.getPagamento().removeAll(locatario.getPagamento());
        locatarioDAO.save(locatario);                
    }
    
    @RequestMapping(path="/locatarios/{id}", method=RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public Locatario recuperar(@PathVariable int id){
        final Optional<Locatario> locatario = locatarioDAO.findById(id);
        if(locatario.isPresent())
            return locatario.get();
        else 
            throw new NaoEncontradoException("ID não encontrado.");
    }
       
    @RequestMapping(path="/locatarios/{id}", method=RequestMethod.PUT)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Locatario atualizar(@PathVariable int id, @RequestBody Locatario locatarioAtualizado){
        Locatario locatario = this.recuperar(id);

        try{
            if(ehLocatarioValido(locatarioAtualizado)){
                locatario.setNome(locatarioAtualizado.getNome());
                locatario.setCpf(locatarioAtualizado.getCpf());
                
                return locatarioDAO.save(locatario);                
            }
        }catch(Exception e){
            throw e;
        }
        return null;   
    }
    
    @RequestMapping(path="/locatarios/{id}", method=RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void apagar(@PathVariable int id){
        if(locatarioDAO.existsById(id))
            locatarioDAO.deleteById(id);
        else
            throw new NaoEncontradoException("ID não encontrado");        
    } 
    
    @RequestMapping(path="/locatarios/{idLocatario}/pagamentos", method=RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public List<Pagamento> inserirPagamento(@PathVariable int idLocatario, @RequestBody Pagamento pagamento){
        Locatario locatario = recuperar(idLocatario);
        
        try{
            if(ehPagamentoValido(pagamento, idLocatario)){
                locatario.getPagamento().add(pagamentoDAO.save(pagamento));
                locatarioDAO.save(locatario);
                
                return locatario.getPagamento();
            }                
        }catch(Exception e){
            throw e;
        }
        return null;            
    }
    
    private boolean ehLocatarioValido(Locatario locatario) {
        if(ehNuloOuVazio(locatario.getNome()))
            throw new RequisicaoInvalidaException("O campo nome não pode ser nulo nem vazio.");
        
        if(ehNuloOuVazio(locatario.getCpf()))
            throw new RequisicaoInvalidaException("O campo cpf não pode ser nulo nem vazio.");
        
        if(locatario.getCpf().length() != 11)
            throw new RequisicaoInvalidaException("O cpf deve ter 11 caracteres");
               
        return true;
    }
    
    private boolean ehPagamentoValido(Pagamento pagamento, int idLocatario) {
        
            if(ehNuloOuVazio(pagamento.getForma()))
                throw new RequisicaoInvalidaException("o campo forma é obrigatório");

            if(pagamento.getData()==null)
                throw new RequisicaoInvalidaException("o campo data é obrigatório");

            if(ehNuloOuVazio(String.valueOf(pagamento.getValor())))
                throw new RequisicaoInvalidaException("o campo valor é obrigatório");

            if(NaoAceitaFormaDePagamento(pagamento.getForma()))
                throw new RequisicaoInvalidaException("Forma de pagamento inválida");

            if(pagamento.getValor() <= 0)
                throw new RequisicaoInvalidaException("Valor deve ser maior que zero");     
            
            if(existePagNesteMesEdata(pagamento, idLocatario))
                throw new RequisicaoInvalidaException("Não pode ter mais de um pagamento para o mesmo mês e ano");
        
        return true;
    }

    private boolean NaoAceitaFormaDePagamento(String forma) {
        final List<String> formasAceitas = new ArrayList<>();
            formasAceitas.add("dinheiro");
            formasAceitas.add("cheque");
            formasAceitas.add("crédito");
            formasAceitas.add("débito");
            
            if(formasAceitas.contains(forma))
                return false;         
        
        return true;        
    }  

    private boolean existePagNesteMesEdata(Pagamento pagamento, int idLocatario) {
        Iterable<Pagamento> pagamentos = listarPagamentos(idLocatario);
        
        for(Pagamento pag : pagamentos){
            if(pag.getData().getMonth() == pagamento.getData().getMonth() && pag.getData().getDay() == pagamento.getData().getDay())
                return true;                
        }  
        
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
