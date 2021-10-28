package sn.zeco.db.exceptions;

@SuppressWarnings("serial")
public class UserNotFoundException extends RuntimeException {

	public UserNotFoundException(Long id) {
		super(String.format("User with Id %d not found", id));
	}

	public UserNotFoundException(String field, String value) {
		super(String.format("User with %s : %s not found", field, value));
	}

}
