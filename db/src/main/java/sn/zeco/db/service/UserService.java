package sn.zeco.db.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import sn.zeco.db.exceptions.NoDataFoundException;
import sn.zeco.db.exceptions.UserNotFoundException;
import sn.zeco.db.model.User;
import sn.zeco.db.repository.UserRepository;

@Service
public class UserService {
	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public List<User> findAll(){
		List<User> users = userRepository.findAll();
		if(users.isEmpty()) throw new NoDataFoundException();
		else return users;
	}

	public User findById(long id) {
		
		return userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
	}
	public User findByPseudo(String pseudo) {
		
		return Optional.of(userRepository.findByPseudo(pseudo)).orElseThrow(()-> new UserNotFoundException("name", pseudo));
	}

	public User save (User user) {
		return userRepository.save(user);
	}

	public User update(User user) {
		User userUpdate = this.findById(user.getId());
		if (userUpdate!=null) {
			userUpdate.setPseudo(user.getPseudo());
			return this.save(userUpdate);
		}
		return null;
	}
	
	public boolean delete (Long id) {
		if(this.findById(id)!=null) { userRepository.deleteById(id);return true;}
		else return false;
	}
}
