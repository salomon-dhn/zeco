package sn.zeco.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sn.zeco.db.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	User findByPseudo(String pseudo);
	User findById(Integer id);

}