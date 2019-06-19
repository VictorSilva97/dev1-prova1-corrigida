/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.edu.ifrs.restinga.dev1.victor.prova1.modelo.dao;

import br.edu.ifrs.restinga.dev1.victor.prova1.modelo.entidade.Pagamento;
import java.util.Date;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Victor
 */
@Repository
public interface IPagamentoDAO extends CrudRepository<Pagamento, Integer>{
    List<Pagamento> findByData(Date data);
}
